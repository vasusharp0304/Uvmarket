import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// User type from session
interface SessionUser {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    subscriptionStatus?: string;
    subscriptionExpiresAt?: string | null;
}

// GET /api/admin/customers — admin only
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user as SessionUser | undefined;
        if (!session || user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            where: { role: 'CUSTOMER' },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
                subscriptionStatus: true,
                subscriptionExpiresAt: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ customers: users });
    } catch (err) {
        console.error('Error fetching customers:', err);
        return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }
}

// POST /api/admin/customers — admin manually adds a customer
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user as SessionUser | undefined;
        if (!session || user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, email, phone, subscriptionExpiresAt } = body;

        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (existing) {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
        }

        // Generate a temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        const passwordHash = await bcrypt.hash(tempPassword, 12);

        const newUser = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                phone: phone || null,
                passwordHash,
                role: 'CUSTOMER',
                isActive: true,
                subscriptionStatus: subscriptionExpiresAt ? 'active' : 'inactive',
                subscriptionExpiresAt: subscriptionExpiresAt ? new Date(subscriptionExpiresAt) : null,
            },
        });

        return NextResponse.json({
            customer: newUser,
            tempPassword,
            message: `Customer created. Temporary password: ${tempPassword}`,
        }, { status: 201 });
    } catch (err) {
        console.error('Error creating customer:', err);
        return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
    }
}
