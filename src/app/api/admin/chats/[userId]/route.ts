import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

// GET /api/admin/chats/[userId] — admin only
// Returns full conversation history for a specific user
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId } = await params;

        // Get user details
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                photoUrl: true,
                subscriptionStatus: true,
                isActive: true,
                createdAt: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get all messages for this user
        const messages = await prisma.chatMessage.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
        });

        return NextResponse.json({ user, messages });
    } catch (error) {
        console.error('Error fetching user chat:', error);
        return NextResponse.json({ error: 'Failed to fetch chat' }, { status: 500 });
    }
}

// POST /api/admin/chats/[userId] — admin only
// Admin sends a reply to user's conversation
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId } = await params;
        const { message } = await req.json();

        if (!message?.trim()) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const trimmedMessage = message.trim();

        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Create admin reply message
        const adminMessage = await prisma.chatMessage.create({
            data: {
                userId: userId,
                message: trimmedMessage,
                sender: 'admin',
                needsAdminReview: false,
                adminReplied: true,
            },
        });

        // Mark all messages from this user as adminReplied
        await prisma.chatMessage.updateMany({
            where: {
                userId: userId,
                needsAdminReview: true,
                adminReplied: false,
            },
            data: {
                adminReplied: true,
            },
        });

        // Create notification for the user
        await prisma.notification.create({
            data: {
                userId: userId,
                title: 'New Message from Admin',
                message: 'You have received a reply from our support team. Check your chat for details.',
                type: 'system',
                link: '/dashboard',
            },
        });

        return NextResponse.json({
            message: adminMessage,
            success: true,
        });
    } catch (error) {
        console.error('Error sending admin reply:', error);
        return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
    }
}

// PATCH /api/admin/chats/[userId] — admin only
// Mark messages as reviewed without replying
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId } = await params;

        // Mark all messages from this user as adminReplied
        await prisma.chatMessage.updateMany({
            where: {
                userId: userId,
                needsAdminReview: true,
                adminReplied: false,
            },
            data: {
                adminReplied: true,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error marking messages as reviewed:', error);
        return NextResponse.json({ error: 'Failed to update messages' }, { status: 500 });
    }
}
