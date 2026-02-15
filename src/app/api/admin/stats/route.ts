import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const [
            totalCustomers,
            activeSubscriptions,
            totalSignals,
            closedSignals,
            payments,
            chartPayments,
            chartSignals
        ] = await Promise.all([
            prisma.user.count({ where: { role: 'CUSTOMER' } }),
            prisma.user.count({ where: { role: 'CUSTOMER', subscriptionStatus: 'active' } }),
            prisma.signal.count(),
            prisma.signal.findMany({
                where: {
                    status: { in: ['TARGET_HIT', 'STOP_LOSS', 'CLOSED_MANUAL'] },
                    returnPercent: { not: null },
                },
                select: { returnPercent: true, status: true },
            }),
            prisma.payment.aggregate({
                where: { status: 'paid' },
                _sum: { amount: true },
                _count: true,
            }),
            prisma.payment.findMany({
                where: { status: 'paid', createdAt: { gte: sixMonthsAgo } },
                select: { amount: true, createdAt: true },
                orderBy: { createdAt: 'asc' }
            }),
            prisma.signal.findMany({
                where: {
                    status: { in: ['TARGET_HIT', 'STOP_LOSS', 'CLOSED_MANUAL'] },
                    returnPercent: { not: null },
                    createdAt: { gte: sixMonthsAgo }
                },
                select: { returnPercent: true, createdAt: true },
                orderBy: { createdAt: 'asc' }
            })
        ]);

        const winners = closedSignals.filter(
            (s) => s.returnPercent !== null && s.returnPercent > 0
        ).length;
        const totalClosed = closedSignals.length;
        const winRate = totalClosed > 0 ? Math.round((winners / totalClosed) * 100 * 100) / 100 : 0;
        const avgReturn =
            totalClosed > 0
                ? Math.round(
                    (closedSignals.reduce((sum, s) => sum + (s.returnPercent || 0), 0) / totalClosed) * 100
                ) / 100
                : 0;

        // Process Chart Data
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Revenue Chart (Group by Month)
        const revenueByMonthMap = new Map<string, number>();
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            revenueByMonthMap.set(key, 0);
        }

        chartPayments.forEach(p => {
            const d = new Date(p.createdAt);
            const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            if (revenueByMonthMap.has(key)) {
                revenueByMonthMap.set(key, (revenueByMonthMap.get(key) || 0) + p.amount);
            }
        });

        const revenueChart = Array.from(revenueByMonthMap.entries()).map(([name, value]) => ({ name, value }));

        // Performance Chart (Avg Return per Month) - simplified for visual
        // Or simplified to Cumulative PnL?
        // Let's do Monthly Net PnL %
        const pnlByMonthMap = new Map<string, number>();
        for (const key of revenueByMonthMap.keys()) {
            pnlByMonthMap.set(key, 0);
        }

        chartSignals.forEach(s => {
            const d = new Date(s.createdAt);
            const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            if (pnlByMonthMap.has(key)) {
                pnlByMonthMap.set(key, (pnlByMonthMap.get(key) || 0) + (s.returnPercent || 0));
            }
        });

        const performanceChart = Array.from(pnlByMonthMap.entries()).map(([name, value]) => ({
            name,
            value: Math.round(value * 100) / 100
        }));

        return NextResponse.json({
            totalCustomers,
            activeSubscriptions,
            totalSignals,
            totalClosed,
            winners,
            winRate,
            avgReturn,
            totalRevenue: payments._sum.amount || 0,
            totalPayments: payments._count,
            charts: {
                revenue: revenueChart,
                performance: performanceChart
            }
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
