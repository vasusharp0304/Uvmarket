import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();
        
        if (!session?.user) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        return NextResponse.json({
            user: {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                role: session.user.role,
                subscriptionStatus: session.user.subscriptionStatus,
                subscriptionExpiresAt: session.user.subscriptionExpiresAt,
            }
        });
    } catch (error) {
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
