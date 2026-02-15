import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        // Verify signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
        }

        // Update payment record
        const payment = await prisma.payment.findFirst({
            where: { razorpayOrderId: razorpay_order_id },
        });

        if (!payment) {
            return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
        }

        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                razorpayPaymentId: razorpay_payment_id,
                status: 'paid',
            },
        });

        // Update user subscription
        await prisma.user.update({
            where: { id: payment.userId },
            data: {
                subscriptionStatus: 'active',
                subscriptionExpiresAt: payment.validTo,
            },
        });

        return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
    }
}
