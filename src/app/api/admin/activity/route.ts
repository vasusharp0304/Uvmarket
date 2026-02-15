import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const userId = searchParams.get('userId');

        const logs = await prisma.activityLog.findMany({
            where: userId ? { userId } : {},
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });

        return NextResponse.json({ logs });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}

// Helper function to log activity (used by other API routes)
export async function logActivity(userId: string | null, action: string, details?: string, ipAddress?: string, userAgent?: string) {
    try {
        await prisma.activityLog.create({
            data: {
                userId,
                action,
                details,
                ipAddress,
                userAgent,
            },
        });
    } catch (err) {
        console.error('Activity log error:', err);
    }
}
