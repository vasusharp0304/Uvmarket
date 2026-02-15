import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const closedStatuses = ['TARGET_HIT', 'STOP_LOSS', 'CLOSED_MANUAL'];

        const closedSignals = await prisma.signal.findMany({
            where: {
                status: { in: closedStatuses },
                returnPercent: { not: null },
            },
            select: {
                status: true,
                returnPercent: true,
            },
        });

        const totalTrades = closedSignals.length;
        const winners = closedSignals.filter(
            (s) => s.status === 'TARGET_HIT' || (s.returnPercent !== null && s.returnPercent > 0)
        ).length;
        const losers = totalTrades - winners;
        const avgReturn =
            totalTrades > 0
                ? closedSignals.reduce((sum, s) => sum + (s.returnPercent || 0), 0) / totalTrades
                : 0;
        const winRate = totalTrades > 0 ? (winners / totalTrades) * 100 : 0;

        return NextResponse.json({
            totalTrades,
            winners,
            losers,
            avgReturn: Math.round(avgReturn * 100) / 100,
            winRate: Math.round(winRate * 100) / 100,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
