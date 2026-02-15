import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const messages = await prisma.chatMessage.findMany({
            where: { userId: (session.user as any).id },
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

        // Save user message
        const userMsg = await prisma.chatMessage.create({
            data: {
                userId: (session.user as any).id,
                message: message.trim(),
                sender: 'user',
            },
        });

        // Auto-reply bot logic
        const botReply = generateBotReply(message.trim());
        const botMsg = await prisma.chatMessage.create({
            data: {
                userId: (session.user as any).id,
                message: botReply,
                sender: 'bot',
            },
        });

        return NextResponse.json({ userMessage: userMsg, botReply: botMsg });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}

function generateBotReply(message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes('subscription') || lower.includes('plan') || lower.includes('price') || lower.includes('pricing')) {
        return "For subscription details, please visit our Pricing page. We offer Monthly, Quarterly, and Yearly plans. For any payment issues, please contact support.";
    }
    if (lower.includes('signal') || lower.includes('recommendation') || lower.includes('trade')) {
        return "Our signals are posted as market recommendations for educational purposes. Active signals are visible on your Dashboard. Please note: all signals are for educational purposes only and do not constitute financial advice.";
    }
    if (lower.includes('refund') || lower.includes('cancel')) {
        return "For refund requests, please email us at support@uvmarketschool.com with your payment details. Refunds are processed within 5-7 business days as per our refund policy.";
    }
    if (lower.includes('invoice') || lower.includes('bill') || lower.includes('receipt')) {
        return "You can download your invoices from the Dashboard > Invoices section. All invoices include GST details as applicable.";
    }
    if (lower.includes('password') || lower.includes('login') || lower.includes('access')) {
        return "If you're having trouble logging in, try the 'Forgot Password' option on the login page. If the issue persists, please contact support.";
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        return "Hello! 👋 Welcome to UV Market School support. How can I help you today? You can ask about subscriptions, signals, invoices, or any other queries.";
    }
    if (lower.includes('thank')) {
        return "You're welcome! If you have any more questions, feel free to ask. Happy trading! 📈";
    }

    return "Thank you for your message! I'm an automated assistant. For specific queries, you can ask about: Subscriptions, Signals, Invoices, Passwords, or Refunds. For complex issues, please email support@uvmarketschool.com.";
}
