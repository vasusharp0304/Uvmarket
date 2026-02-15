import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const format = searchParams.get('format') || 'csv';
        const type = searchParams.get('type') || 'signals'; // signals | invoices | activity

        if (type === 'signals') {
            const signals = await prisma.signal.findMany({
                where: { isVisibleToCustomers: true },
                orderBy: { createdAt: 'desc' },
                take: 500,
            });

            if (format === 'csv') {
                const headers = 'Date,Symbol,Company,Segment,Type,Direction,Entry,Target,StopLoss,Exit,Return%,Status\n';
                const rows = signals.map(s =>
                    `${new Date(s.entryDateTime).toISOString()},${s.symbol},"${s.companyName}",${s.segment},${s.signalType},${s.direction},${s.entryPrice},${s.targetPrice},${s.stopLossPrice},${s.exitPrice || ''},${s.returnPercent || ''},${s.status}`
                ).join('\n');
                const csv = headers + rows;

                return new Response(csv, {
                    headers: {
                        'Content-Type': 'text/csv',
                        'Content-Disposition': `attachment; filename=signals_${Date.now()}.csv`,
                    },
                });
            }

            return NextResponse.json({ data: signals });
        }

        if (type === 'invoices') {
            const userId = (session.user as any).role === 'ADMIN' ? undefined : (session.user as any).id;
            const invoices = await prisma.invoice.findMany({
                where: userId ? { userId } : {},
                orderBy: { createdAt: 'desc' },
            });

            if (format === 'csv') {
                const headers = 'InvoiceNo,Date,Customer,Amount,GST,Total,Status\n';
                const rows = invoices.map(i =>
                    `${i.invoiceNumber},${new Date(i.createdAt).toISOString()},"${i.customerName}",${i.subtotal},${i.gstAmount},${i.totalAmount},Paid`
                ).join('\n');

                return new Response(headers + rows, {
                    headers: {
                        'Content-Type': 'text/csv',
                        'Content-Disposition': `attachment; filename=invoices_${Date.now()}.csv`,
                    },
                });
            }

            return NextResponse.json({ data: invoices });
        }

        return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({ error: 'Export failed' }, { status: 500 });
    }
}
