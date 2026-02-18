import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT /api/admin/customers/[id] — admin updates a customer
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

        const updateData: any = {};
        if (body.isActive !== undefined) updateData.isActive = body.isActive;
        if (body.subscriptionStatus !== undefined) updateData.subscriptionStatus = body.subscriptionStatus;
        if (body.subscriptionExpiresAt !== undefined) {
            updateData.subscriptionExpiresAt = body.subscriptionExpiresAt
                ? new Date(body.subscriptionExpiresAt)
                : null;
        }
        if (body.name !== undefined) updateData.name = body.name;
        if (body.phone !== undefined) updateData.phone = body.phone;

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ customer: user });
    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
    }
}

// DELETE /api/admin/customers/[id]
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
        await prisma.user.update({
            where: { id },
            data: { isActive: false },
        });

        return NextResponse.json({ message: 'Customer deactivated' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
    }
}
