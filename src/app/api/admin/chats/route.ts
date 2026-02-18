import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/chats — admin only
// Returns all users with their chat summary (last message, unread count, needs review)
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get all users who have chat messages
        const usersWithChats = await prisma.user.findMany({
            where: {
                role: 'CUSTOMER',
                chatMessages: {
                    some: {},
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                photoUrl: true,
                subscriptionStatus: true,
                isActive: true,
                chatMessages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: {
                        id: true,
                        message: true,
                        sender: true,
                        needsAdminReview: true,
                        adminReplied: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                chatMessages: {
                    _count: 'desc',
                },
            },
        });

        // Get counts for each user
        const usersWithCounts = await Promise.all(
            usersWithChats.map(async (user) => {
                const [totalMessages, needsReviewCount, unreadCount] = await Promise.all([
                    prisma.chatMessage.count({
                        where: { userId: user.id },
                    }),
                    prisma.chatMessage.count({
                        where: {
                            userId: user.id,
                            needsAdminReview: true,
                            adminReplied: false,
                        },
                    }),
                    prisma.chatMessage.count({
                        where: {
                            userId: user.id,
                            sender: 'user',
                            needsAdminReview: true,
                            adminReplied: false,
                        },
                    }),
                ]);

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    photoUrl: user.photoUrl,
                    subscriptionStatus: user.subscriptionStatus,
                    isActive: user.isActive,
                    lastMessage: user.chatMessages[0] || null,
                    totalMessages,
                    needsReviewCount,
                    unreadCount,
                };
            })
        );

        // Sort by needsReviewCount (desc), then by last message date (desc)
        const sortedUsers = usersWithCounts.sort((a, b) => {
            if (b.needsReviewCount !== a.needsReviewCount) {
                return b.needsReviewCount - a.needsReviewCount;
            }
            const aDate = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
            const bDate = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
            return bDate - aDate;
        });

        return NextResponse.json({ users: sortedUsers });
    } catch (error) {
        console.error('Error fetching admin chats:', error);
        return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
    }
}
