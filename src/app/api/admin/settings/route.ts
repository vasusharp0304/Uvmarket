import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        let settings = await prisma.appSettings.findFirst({ where: { id: 'default' } });
        if (!settings) {
            settings = await prisma.appSettings.create({
                data: { id: 'default' },
            });
        }
        return NextResponse.json({ settings });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        delete data.id; // Can't change ID

        const settings = await prisma.appSettings.upsert({
            where: { id: 'default' },
            update: data,
            create: { id: 'default', ...data },
        });

        return NextResponse.json({ settings });
    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
