import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/signals/[id]
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const signal = await prisma.signal.findUnique({
            where: { id },
            include: {
                screenshots: true,
                createdBy: { select: { name: true } },
            },
        });

        if (!signal) {
            return NextResponse.json({ error: 'Signal not found' }, { status: 404 });
        }

        return NextResponse.json({ signal });
    } catch (error) {
        console.error('Error fetching signal:', error);
        return NextResponse.json({ error: 'Failed to fetch signal' }, { status: 500 });
    }
}

// PUT /api/signals/[id] — admin only
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        const existingSignal = await prisma.signal.findUnique({ where: { id } });
        if (!existingSignal) {
            return NextResponse.json({ error: 'Signal not found' }, { status: 404 });
        }

        // Calculate return percent if closing trade
        let returnPercent = body.returnPercent;
        if (body.exitPrice && body.status && ['TARGET_HIT', 'STOP_LOSS', 'CLOSED_MANUAL'].includes(body.status)) {
            const entry = existingSignal.entryPrice;
            const exit = parseFloat(body.exitPrice);
            if (existingSignal.direction === 'BUY') {
                returnPercent = ((exit - entry) / entry) * 100;
            } else {
                returnPercent = ((entry - exit) / entry) * 100;
            }
            returnPercent = Math.round(returnPercent * 100) / 100;
        }

        const updateData: any = {};
        if (body.symbol !== undefined) updateData.symbol = body.symbol.toUpperCase();
        if (body.companyName !== undefined) updateData.companyName = body.companyName;
        if (body.segment !== undefined) updateData.segment = body.segment;
        if (body.signalType !== undefined) updateData.signalType = body.signalType;
        if (body.direction !== undefined) updateData.direction = body.direction;
        if (body.entryPrice !== undefined) updateData.entryPrice = parseFloat(body.entryPrice);
        if (body.targetPrice !== undefined) updateData.targetPrice = parseFloat(body.targetPrice);
        if (body.stopLossPrice !== undefined) updateData.stopLossPrice = parseFloat(body.stopLossPrice);
        if (body.exitPrice !== undefined) updateData.exitPrice = parseFloat(body.exitPrice);
        if (body.status !== undefined) updateData.status = body.status;
        if (body.notes !== undefined) updateData.notes = body.notes;
        if (body.isVisibleToCustomers !== undefined) updateData.isVisibleToCustomers = body.isVisibleToCustomers;
        if (returnPercent !== undefined) updateData.returnPercent = returnPercent;
        if (body.exitPrice) updateData.exitDateTime = new Date();

        const signal = await prisma.signal.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ signal });
    } catch (error) {
        console.error('Error updating signal:', error);
        return NextResponse.json({ error: 'Failed to update signal' }, { status: 500 });
    }
}

// DELETE /api/signals/[id] — admin only
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await prisma.signal.delete({ where: { id } });

        return NextResponse.json({ message: 'Signal deleted' });
    } catch (error) {
        console.error('Error deleting signal:', error);
        return NextResponse.json({ error: 'Failed to delete signal' }, { status: 500 });
    }
}
