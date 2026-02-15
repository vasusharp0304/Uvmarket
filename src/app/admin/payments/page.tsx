'use client';

import { useEffect, useState, useCallback } from 'react';
import { LoadingSpinner } from '@/components/Loading';
import { Search, Filter, Download, CreditCard, Calendar, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';

interface Payment {
    id: string;
    userId: string;
    planName: string;
    amount: number;
    currency: string;
    razorpayOrderId: string | null;
    razorpayPaymentId: string | null;
    status: string;
    validFrom: string | null;
    validTo: string | null;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
}

export default function AdminPayments() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPayments = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/payments');
            const data = await res.json();
            setPayments(data.payments || []);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    if (loading) return <LoadingSpinner />;

    const filtered = payments.filter((p) => {
        const matchesFilter = filter === 'all' || p.status === filter;
        const matchesSearch = p.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.razorpayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const totalPaid = payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const successfulPayments = payments.filter((p) => p.status === 'paid').length;
    const failedPayments = payments.filter((p) => p.status === 'failed').length;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <CreditCard className="text-purple-600" />
                        Payments & Revenue
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Track accurate financial records and subscription history</p>
                </div>
                {/* Export Button could go here */}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-extrabold text-gray-900">₹{totalPaid.toLocaleString('en-IN')}</h3>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                        <DollarSign size={24} />
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Successful</p>
                        <h3 className="text-3xl font-extrabold text-blue-900">{successfulPayments}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <CheckCircle size={24} />
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Failed / Pending</p>
                        <h3 className="text-3xl font-extrabold text-gray-900">{failedPayments + payments.filter(p => p.status === 'created').length}</h3>
                    </div>
                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                        <Clock size={24} />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search customer, email or ID..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter size={18} className="text-gray-400" />
                        <select
                            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="paid">Paid</option>
                            <option value="created">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Plan & Amount</th>
                                <th className="px-6 py-4">Validity</th>
                                <th className="px-6 py-4 text-right">Transaction ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase gap-1.5 ${payment.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                payment.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                            }`}>
                                            {payment.status === 'paid' && <CheckCircle size={12} />}
                                            {payment.status === 'failed' && <XCircle size={12} />}
                                            {payment.status === 'created' && <Clock size={12} />}
                                            {payment.status}
                                        </span>
                                        <div className="text-[10px] text-gray-400 mt-1 font-medium pl-1">
                                            {new Date(payment.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{payment.user.name}</div>
                                        <div className="text-xs text-gray-500">{payment.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-800">
                                                {payment.planName}
                                                <span className="ml-2 font-normal text-gray-500">• ₹{payment.amount.toLocaleString('en-IN')}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-gray-500 flex flex-col gap-1">
                                            {payment.validFrom && payment.validTo ? (
                                                <>
                                                    <span className="flex items-center gap-1.5"><Calendar size={12} className="text-green-500" /> {new Date(payment.validFrom).toLocaleDateString('en-IN')}</span>
                                                    <span className="flex items-center gap-1.5"><Calendar size={12} className="text-red-400" /> {new Date(payment.validTo).toLocaleDateString('en-IN')}</span>
                                                </>
                                            ) : (
                                                <span className="text-gray-400 italic">Not active</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="font-mono text-xs text-gray-600 bg-gray-100 py-1 px-2 rounded inline-block">
                                            {payment.razorpayPaymentId || '-'}
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-1">Order: {payment.razorpayOrderId || '-'}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="p-12 text-center text-gray-400 bg-gray-50/30">
                        <Search size={48} className="mx-auto mb-3 text-gray-200" />
                        <p className="font-medium">No payments found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}
