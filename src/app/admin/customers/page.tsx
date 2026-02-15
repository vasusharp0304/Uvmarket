'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { SubscriptionBadge } from '@/components/Badges';
import { LoadingSpinner } from '@/components/Loading';
import { Check, X, Eye, FileText, User as UserIcon, Mail, Phone, Calendar } from 'lucide-react';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    photoUrl: string | null;
    role: string;
    isActive: boolean;
    subscriptionStatus: string;
    subscriptionExpiresAt: string | null;
    createdAt: string;
}

export default function AdminCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [showExtend, setShowExtend] = useState<Customer | null>(null);
    const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
    const [addForm, setAddForm] = useState({ name: '', email: '', phone: '', subscriptionExpiresAt: '' });
    const [extendDate, setExtendDate] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchCustomers = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/customers');
            const data = await res.json();
            setCustomers(data.customers || []);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const res = await fetch('/api/admin/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addForm),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to add customer');
                return;
            }
            setSuccess(`Customer added! Temporary password: ${data.tempPassword}`);
            setShowAdd(false);
            setAddForm({ name: '', email: '', phone: '', subscriptionExpiresAt: '' });
            fetchCustomers();
        } catch {
            setError('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActive = async (customer: Customer) => {
        try {
            await fetch(`/api/admin/customers/${customer.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !customer.isActive }),
            });
            fetchCustomers();
        } catch {
            setError('Failed to update customer status');
        }
    };

    const handleExtend = async () => {
        if (!showExtend || !extendDate) return;
        setSaving(true);
        try {
            await fetch(`/api/admin/customers/${showExtend.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subscriptionStatus: 'active',
                    subscriptionExpiresAt: extendDate,
                }),
            });
            setSuccess('Subscription extended!');
            setShowExtend(null);
            setExtendDate('');
            fetchCustomers();
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Failed to extend subscription');
        } finally {
            setSaving(false);
        }
    };

    const handlePrintProfile = () => {
        window.print();
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            {/* Print Only Section */}
            {viewCustomer && (
                <div className="hidden print:block print-only p-8 bg-white text-black">
                    <div className="text-center border-b pb-6 mb-6">
                        <h1 className="text-3xl font-bold mb-2">Customer Profile</h1>
                        <p className="text-gray-500">UV Market School</p>
                    </div>

                    <div className="flex items-start gap-8 mb-8">
                        <div className="w-40 h-40 bg-gray-100 rounded-full border-4 border-gray-200 overflow-hidden flex-shrink-0">
                            {viewCustomer.photoUrl ? (
                                <img src={viewCustomer.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                                    <span className="text-4xl font-bold">{viewCustomer.name.charAt(0)}</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold mb-2">{viewCustomer.name}</h2>
                            <p className="text-xl text-gray-600 mb-1">{viewCustomer.email}</p>
                            <p className="text-lg text-gray-600">{viewCustomer.phone || 'No phone provided'}</p>
                            <div className="mt-4 inline-block px-4 py-1 bg-gray-100 rounded-full border text-sm font-bold uppercase">
                                {viewCustomer.subscriptionStatus} Member
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 border-t pt-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4 uppercase text-gray-500">Subscription Details</h3>
                            <div className="mb-2">
                                <span className="font-semibold block">Status:</span>
                                <span>{viewCustomer.subscriptionStatus}</span>
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold block">Expires At:</span>
                                <span>{viewCustomer.subscriptionExpiresAt
                                    ? new Date(viewCustomer.subscriptionExpiresAt).toLocaleDateString('en-IN')
                                    : 'N/A'}</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4 uppercase text-gray-500">Account Info</h3>
                            <div className="mb-2">
                                <span className="font-semibold block">Joined:</span>
                                <span>{new Date(viewCustomer.createdAt).toLocaleDateString('en-IN')}</span>
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold block">User ID:</span>
                                <span className="font-mono text-sm">{viewCustomer.id}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t text-center text-sm text-gray-400">
                        Generated by UV Market School Admin Panel on {new Date().toLocaleDateString('en-IN')}
                    </div>
                </div>
            )}

            {/* Screen View */}
            <div className="print:hidden">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
                    <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                        + Add Customer
                    </button>
                </div>

                {error && <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-600">{error}</div>}
                {success && <div className="mb-4 p-4 rounded-lg bg-green-50 text-green-600">{success}</div>}

                {/* Customers Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Subscription</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm overflow-hidden border border-indigo-100">
                                                    {customer.photoUrl ? (
                                                        <img src={customer.photoUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        customer.name.charAt(0)
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{customer.name}</div>
                                                    <div className="text-xs text-gray-500">Joined {new Date(customer.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col text-sm text-gray-600">
                                                <span className="flex items-center gap-1.5"><Mail size={12} /> {customer.email}</span>
                                                {customer.phone && <span className="flex items-center gap-1.5 mt-0.5"><Phone size={12} /> {customer.phone}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <SubscriptionBadge status={customer.subscriptionStatus} />
                                            {customer.subscriptionExpiresAt && (
                                                <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                    <Calendar size={10} />
                                                    {new Date(customer.subscriptionExpiresAt).toLocaleDateString('en-IN')}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {customer.isActive ? 'Active' : 'Blocked'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setViewCustomer(customer)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                    title="View Profile"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => { setShowExtend(customer); setExtendDate(''); }}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                                    title="Extend Subscription"
                                                >
                                                    <FileText size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(customer)}
                                                    className={`p-1.5 rounded-lg transition-colors ${customer.isActive
                                                            ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                                            : 'text-red-600 bg-red-50 hover:bg-green-50 hover:text-green-600'
                                                        }`}
                                                    title={customer.isActive ? "Block User" : "Unblock User"}
                                                >
                                                    {customer.isActive ? <X size={16} /> : <Check size={16} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* View Profile Modal */}
                {viewCustomer && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewCustomer(null)}>
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800 text-xl">Customer Profile</h3>
                                <button onClick={() => setViewCustomer(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8">
                                <div className="flex items-start gap-6 mb-8">
                                    <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
                                        {viewCustomer.photoUrl ? (
                                            <img src={viewCustomer.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                                <UserIcon size={32} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{viewCustomer.name}</h2>
                                        <div className="flex flex-col gap-1 mt-1 text-gray-500">
                                            <span className="flex items-center gap-2 text-sm"><Mail size={14} /> {viewCustomer.email}</span>
                                            <span className="flex items-center gap-2 text-sm"><Phone size={14} /> {viewCustomer.phone || 'N/A'}</span>
                                            <span className="flex items-center gap-2 text-sm"><Calendar size={14} /> Joined {new Date(viewCustomer.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <FileText size={18} className="text-indigo-600" /> Subscription Status
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Current Plan</label>
                                            <div className="font-semibold uppercase text-indigo-600">{viewCustomer.subscriptionStatus}</div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Expires On</label>
                                            <div className="font-semibold text-gray-800">
                                                {viewCustomer.subscriptionExpiresAt
                                                    ? new Date(viewCustomer.subscriptionExpiresAt).toLocaleDateString('en-IN')
                                                    : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                <button className="btn btn-outline" onClick={() => setViewCustomer(null)}>
                                    Close
                                </button>
                                <button className="btn btn-primary" onClick={handlePrintProfile}>
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ... other modals (Add, Extend) ... */}
                {/* Simplified mostly as they were before, or I'll just re-include them if needed. 
                    Actually, I'll allow the previously defined Add/Extend logic to remain by copying it back or minimal re-implementation if I removed it.
                    I need to ensure Add and Extend are still there.
                */}
            </div>

            {/* Retaining Modal Logic for clarity in replacement */}
            {showAdd && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="font-bold text-lg mb-4">Add Customer</h3>
                        <form onSubmit={handleAdd}>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-medium mb-1">Name</label><input className="w-full border rounded p-2" required value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} /></div>
                                <div><label className="block text-sm font-medium mb-1">Email</label><input className="w-full border rounded p-2" type="email" required value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} /></div>
                                <div><label className="block text-sm font-medium mb-1">Phone</label><input className="w-full border rounded p-2" value={addForm.phone} onChange={e => setAddForm({ ...addForm, phone: e.target.value })} /></div>
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Adding...' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showExtend && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
                        <h3 className="font-bold text-lg mb-4">Extend Subscription</h3>
                        <input className="w-full border rounded p-2 mb-4" type="date" value={extendDate} onChange={e => setExtendDate(e.target.value)} />
                        <div className="flex justify-end gap-2">
                            <button className="btn btn-outline" onClick={() => setShowExtend(null)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleExtend} disabled={saving || !extendDate}>{saving ? 'Saving...' : 'Extend'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
