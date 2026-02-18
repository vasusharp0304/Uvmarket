import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ADMIN_EMAIL = 'uvmarketsignal@gmail.com';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const messages = await prisma.chatMessage.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'asc' },
            take: 100,
        });

        return NextResponse.json({ messages });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { message } = await req.json();
        if (!message?.trim()) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

        const userId = session.user.id;
        const trimmedMessage = message.trim();

        // Check if this message needs admin review
        const botResult = generateBotReply(trimmedMessage);

        // Save user message
        const userMsg = await prisma.chatMessage.create({
            data: {
                userId: userId,
                message: trimmedMessage,
                sender: 'user',
                needsAdminReview: botResult.needsAdminReview,
            },
        });

        // Auto-reply bot logic
        const botMsg = await prisma.chatMessage.create({
            data: {
                userId: userId,
                message: botResult.reply,
                sender: 'bot',
            },
        });

        // If admin review needed, create notification for admin
        if (botResult.needsAdminReview) {
            try {
                // Find admin users
                const admins = await prisma.user.findMany({
                    where: { role: 'ADMIN' },
                    select: { id: true },
                });

                // Create notification for each admin
                await Promise.all(admins.map(admin =>
                    prisma.notification.create({
                        data: {
                            userId: admin.id,
                            title: 'Chat Requires Attention',
                            message: `User "${session.user.name || 'Unknown'}" asked a question that needs admin review.`,
                            type: 'system',
                            link: '/admin/chats',
                        },
                    })
                ));
            } catch (notifyError) {
                console.error('Failed to create admin notification:', notifyError);
            }
        }

        return NextResponse.json({ userMessage: userMsg, botReply: botMsg });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}

interface BotReplyResult {
    reply: string;
    needsAdminReview: boolean;
}

function generateBotReply(message: string): BotReplyResult {
    const lower = message.toLowerCase();

    // Check for explicit requests for human/admin help
    const humanHelpKeywords = [
        'human', 'agent', 'admin', 'support', 'help', 'representative',
        'speak to', 'talk to', 'chat with', 'real person', 'manager',
        'supervisor', 'contact', 'email', 'phone', 'call'
    ];

    const needsHumanHelp = humanHelpKeywords.some(keyword => lower.includes(keyword));

    // Check for complex issues that need admin attention
    const complexIssueKeywords = [
        'refund', 'dispute', 'complaint', 'legal', 'fraud', 'hack',
        'unauthorized', 'error in account', 'wrong charge', 'billing issue',
        'technical problem', 'not working', 'broken', 'bug', 'issue with'
    ];

    const hasComplexIssue = complexIssueKeywords.some(keyword => lower.includes(keyword));

    // If user explicitly asks for human help or has a complex issue, flag for admin
    if (needsHumanHelp && (lower.includes('human') || lower.includes('agent') || lower.includes('admin') || lower.includes('real person'))) {
        return {
            reply: `I understand you'd like to speak with a human representative. I've forwarded your request to our admin team. They will review your query and get back to you soon at ${ADMIN_EMAIL}. You can also email us directly if urgent.`,
            needsAdminReview: true,
        };
    }

    if (lower.includes('subscription') || lower.includes('plan') || lower.includes('price') || lower.includes('pricing')) {
        return {
            reply: "For subscription details, please visit our Pricing page. We offer Monthly, Quarterly, and Yearly plans. For any payment issues, please contact support.",
            needsAdminReview: false,
        };
    }
    if (lower.includes('signal') || lower.includes('recommendation') || lower.includes('trade')) {
        return {
            reply: "Our signals are posted as market recommendations for educational purposes. Active signals are visible on your Dashboard. Please note: all signals are for educational purposes only and do not constitute financial advice.",
            needsAdminReview: false,
        };
    }
    if (lower.includes('refund') || lower.includes('cancel')) {
        return {
            reply: `For refund requests, please email us at ${ADMIN_EMAIL} with your payment details. Refunds are processed within 5-7 business days as per our refund policy.`,
            needsAdminReview: true,
        };
    }
    if (lower.includes('invoice') || lower.includes('bill') || lower.includes('receipt')) {
        return {
            reply: "You can download your invoices from the Dashboard > Invoices section. All invoices include GST details as applicable.",
            needsAdminReview: false,
        };
    }
    if (lower.includes('password') || lower.includes('login') || lower.includes('access')) {
        return {
            reply: "If you're having trouble logging in, try the 'Forgot Password' option on the login page. If the issue persists, please contact support.",
            needsAdminReview: hasComplexIssue,
        };
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        return {
            reply: "Hello! 👋 Welcome to UV Market School support. How can I help you today? You can ask about subscriptions, signals, invoices, or any other queries.",
            needsAdminReview: false,
        };
    }
    if (lower.includes('thank')) {
        return {
            reply: "You're welcome! If you have any more questions, feel free to ask. Happy trading! 📈",
            needsAdminReview: false,
        };
    }

    // Default response with admin review flag for unrecognized complex queries
    const isSimpleQuery = lower.split(' ').length < 5;
    const needsAdminReview = hasComplexIssue || (!isSimpleQuery && !lower.includes('?') && lower.length > 50);

    return {
        reply: needsAdminReview
            ? `Thank you for your message! This query requires specialized attention. Our admin team has been notified and will review your message. For urgent matters, please contact us at ${ADMIN_EMAIL}.`
            : "Thank you for your message! I'm an automated assistant. For specific queries, you can ask about: Subscriptions, Signals, Invoices, Passwords, or Refunds. For complex issues, please email support.",
        needsAdminReview,
    };
}
