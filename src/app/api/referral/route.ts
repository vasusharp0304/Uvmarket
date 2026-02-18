import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// GET: fetch user's referral info
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const userId = session.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { referralCode: true }
        });

        // Auto-generate referral code if not exists
        if (!user?.referralCode) {
            const code = 'UV' + crypto.randomBytes(4).toString('hex').toUpperCase();
            await prisma.user.update({
                where: { id: userId },
                data: { referralCode: code },
            });

            const referrals = await prisma.referral.findMany({
                where: { referrerId: userId },
                include: { referred: { select: { name: true, email: true, createdAt: true } } },
            });

            return NextResponse.json({
                referralCode: code,
                referralLink: `/register?ref=${code}`,
                referrals,
                totalReferrals: referrals.length,
                completedReferrals: referrals.filter((r: any) => r.status === 'completed').length,
            });
        }

        const referrals = await prisma.referral.findMany({
            where: { referrerId: userId },
            include: { referred: { select: { name: true, email: true, createdAt: true } } },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            referralCode: user.referralCode,
            referralLink: `/register?ref=${user.referralCode}`,
            referrals,
            totalReferrals: referrals.length,
            completedReferrals: referrals.filter((r: any) => r.status === 'completed').length,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch referral info' }, { status: 500 });
    }
}
