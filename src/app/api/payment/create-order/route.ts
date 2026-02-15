import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PLANS: Record<string, { name: string; amount: number; months: number }> = {
    monthly: { name: 'Monthly', amount: 99900, months: 1 },
    quarterly: { name: 'Quarterly', amount: 249900, months: 3 },
    yearly: { name: 'Yearly', amount: 899900, months: 12 },
};

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { planId } = body;

        const plan = PLANS[planId];
        if (!plan) {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        const order = await razorpay.orders.create({
            amount: plan.amount,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: (session.user as any).id,
                planName: plan.name,
            },
        });

        // Create payment record
        const validFrom = new Date();
        const validTo = new Date();
        validTo.setMonth(validTo.getMonth() + plan.months);

        await prisma.payment.create({
            data: {
                userId: (session.user as any).id,
                planName: plan.name,
                amount: plan.amount / 100,
                currency: 'INR',
                razorpayOrderId: order.id,
                status: 'created',
                validFrom,
                validTo,
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: plan.amount,
            currency: 'INR',
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
