import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function generateInvoiceNumber() {
    const count = await prisma.invoice.count();
    const date = new Date();
    const prefix = `UVM${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    return `${prefix}-${String(count + 1).padStart(4, '0')}`;
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const userId = (session.user as any).role === 'ADMIN'
            ? searchParams.get('userId') || undefined
            : (session.user as any).id;

        const invoices = await prisma.invoice.findMany({
            where: userId ? { userId } : {},
            include: { payment: true },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        return NextResponse.json({ invoices });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { paymentId } = await req.json();
        if (!paymentId) return NextResponse.json({ error: 'Payment ID required' }, { status: 400 });

        // Check if invoice already exists
        const existing = await prisma.invoice.findUnique({ where: { paymentId } });
        if (existing) return NextResponse.json({ error: 'Invoice already exists for this payment' }, { status: 409 });

        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: { user: true },
        });

        if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });

        // Get app settings for company details
        const settings = await prisma.appSettings.findFirst({ where: { id: 'default' } });
        const gstPercent = settings?.gstPercent || 18;
        const subtotal = payment.amount / (1 + gstPercent / 100);
        const gstAmount = payment.amount - subtotal;

        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber: await generateInvoiceNumber(),
                userId: payment.userId,
                paymentId: payment.id,
                subtotal: Math.round(subtotal * 100) / 100,
                gstPercent,
                gstAmount: Math.round(gstAmount * 100) / 100,
                totalAmount: payment.amount,
                customerName: payment.user.name,
                customerEmail: payment.user.email,
                customerPhone: payment.user.phone,
                companyName: settings?.companyName || 'UV Market School',
                companyAddress: settings?.companyAddress,
                companyGST: settings?.companyGST,
                companyPAN: settings?.companyPAN,
                disclaimer: 'This is a computer-generated invoice. All amounts are in INR. For educational services only.',
            },
        });

        return NextResponse.json({ invoice }, { status: 201 });
    } catch (error) {
        console.error('Invoice creation error:', error);
        return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
    }
}
