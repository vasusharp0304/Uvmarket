import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const plans = await prisma.subscriptionPlan.findMany({
            orderBy: { sortOrder: 'asc' },
        });
        return NextResponse.json({ plans });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, description, price, duration, features, sortOrder } = body;

        const plan = await prisma.subscriptionPlan.create({
            data: {
                name,
                description: description || null,
                price: parseFloat(price),
                duration: parseInt(duration),
                features: features ? JSON.stringify(features) : null,
                sortOrder: sortOrder || 0,
            },
        });

        return NextResponse.json({ plan }, { status: 201 });
    } catch (error) {
        console.error('Create plan error:', error);
        return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, ...data } = body;

        if (data.price) data.price = parseFloat(data.price);
        if (data.duration) data.duration = parseInt(data.duration);
        if (data.features && Array.isArray(data.features)) data.features = JSON.stringify(data.features);

        const plan = await prisma.subscriptionPlan.update({
            where: { id },
            data,
        });

        return NextResponse.json({ plan });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Plan ID required' }, { status: 400 });

        await prisma.subscriptionPlan.delete({ where: { id } });
        return NextResponse.json({ message: 'Plan deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
    }
}
