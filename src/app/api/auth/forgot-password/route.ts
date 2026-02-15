import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Don't reveal if user exists
            return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExpiry },
        });

        // In production, send email here. For now, log and return token for dev.
        console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);

        return NextResponse.json({
            message: 'If that email exists, a reset link has been sent.',
            // Remove in production:
            devToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
