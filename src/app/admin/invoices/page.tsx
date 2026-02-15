'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Search } from 'lucide-react';

interface Invoice {
    id: string;
    invoiceNumber: string;
    userId: string;
    customerName: string;
    customerEmail: string;
    subtotal: number;
    gstPercent: number;
    gstAmount: number;
    totalAmount: number;
    companyName: string;
    companyGST: string | null;
    createdAt: string;
    payment: { planName: string; razorpayPaymentId: string | null };
}

export default function AdminInvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('/api/invoices')
            .then(r => r.json())
            .then(d => { setInvoices(d.invoices || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const exportCSV = () => {
        window.open('/api/export?type=invoices&format=csv', '_blank');
    };

    const filtered = invoices.filter(i =>
        i.customerName.toLowerCase().includes(search.toLowerCase()) ||
        i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        i.customerEmail.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Loading invoices...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <FileText className="text-purple-600" size={24} />
                        Invoices
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">{invoices.length} total invoices</p>
                </div>
                <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-all shadow-lg">
                    <Download size={16} /> Export CSV
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search by name, email, or invoice number..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Invoice #</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Plan</th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Subtotal</th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">GST</th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(inv => (
                                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-purple-600 font-semibold">{inv.invoiceNumber}</td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {new Date(inv.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-800">{inv.customerName}</div>
                                        <div className="text-xs text-gray-400">{inv.customerEmail}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-semibold">{inv.payment?.planName}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-600">₹{inv.subtotal.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right text-gray-400">₹{inv.gstAmount.toFixed(2)} ({inv.gstPercent}%)</td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-800">₹{inv.totalAmount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="py-12 text-center text-gray-400">
                        <FileText size={32} className="mx-auto mb-2 text-gray-300" />
                        <p>No invoices found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
