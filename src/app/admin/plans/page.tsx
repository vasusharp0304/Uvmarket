'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Loader2, Package } from 'lucide-react';

interface Plan {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    isActive: boolean;
    features: string | null;
    sortOrder: number;
}

export default function AdminPlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Plan | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await fetch('/api/admin/plans');
            const data = await res.json();
            setPlans(data.plans || []);
        } catch { } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editing) return;
        setSaving(true);
        try {
            const method = isNew ? 'POST' : 'PUT';
            const body = isNew ? {
                name: editing.name,
                description: editing.description,
                price: editing.price,
                duration: editing.duration,
                features: editing.features ? JSON.parse(editing.features) : [],
                sortOrder: editing.sortOrder,
            } : editing;

            const res = await fetch('/api/admin/plans', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                fetchPlans();
                setEditing(null);
                setIsNew(false);
            }
        } catch { } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this plan?')) return;
        await fetch(`/api/admin/plans?id=${id}`, { method: 'DELETE' });
        fetchPlans();
    };

    const startNew = () => {
        setEditing({
            id: '',
            name: '',
            description: '',
            price: 0,
            duration: 30,
            isActive: true,
            features: '["Feature 1", "Feature 2"]',
            sortOrder: plans.length,
        });
        setIsNew(true);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading plans...</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <Package className="text-purple-600" size={24} />
                        Subscription Plans
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage pricing plans visible on the pricing page</p>
                </div>
                <button onClick={startNew} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg">
                    <Plus size={16} /> Add Plan
                </button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <div key={plan.id} className={`bg-white rounded-2xl shadow-sm border p-6 relative ${plan.isActive ? 'border-gray-100' : 'border-red-200 opacity-60'}`}>
                        {!plan.isActive && (
                            <span className="absolute top-3 right-3 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">INACTIVE</span>
                        )}
                        <h3 className="text-lg font-bold text-gray-800">{plan.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">{plan.description || 'No description'}</p>
                        <div className="mt-4">
                            <span className="text-3xl font-bold text-gray-800">₹{plan.price}</span>
                            <span className="text-gray-400 text-sm"> / {plan.duration} days</span>
                        </div>
                        {plan.features && (
                            <ul className="mt-4 space-y-1.5 text-sm text-gray-600">
                                {JSON.parse(plan.features).map((f: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="flex gap-2 mt-6">
                            <button onClick={() => { setEditing(plan); setIsNew(false); }}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                                <Edit2 size={14} /> Edit
                            </button>
                            <button onClick={() => handleDelete(plan.id)}
                                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {plans.length === 0 && !editing && (
                <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                    <Package size={32} className="mx-auto mb-3 text-gray-300" />
                    <h3 className="text-gray-900 font-medium">No plans created yet</h3>
                    <p className="text-gray-500 text-sm mt-1">Click &quot;Add Plan&quot; to create your first subscription plan.</p>
                </div>
            )}

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">{isNew ? 'Create Plan' : 'Edit Plan'}</h2>
                            <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Plan Name</label>
                                <input type="text" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
                                    placeholder="e.g. Monthly, Quarterly"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Description</label>
                                <input type="text" value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Price (₹)</label>
                                    <input type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Duration (days)</label>
                                    <input type="number" value={editing.duration} onChange={e => setEditing({ ...editing, duration: parseInt(e.target.value) || 1 })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Features (JSON array)</label>
                                <textarea value={editing.features || '[]'} onChange={e => setEditing({ ...editing, features: e.target.value })} rows={3}
                                    placeholder='["Feature 1", "Feature 2"]'
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none resize-none font-mono text-sm" />
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" checked={editing.isActive} onChange={e => setEditing({ ...editing, isActive: e.target.checked })}
                                    className="w-4 h-4 accent-purple-600" />
                                <label className="text-sm font-medium text-gray-700">Active (visible to customers)</label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => { setEditing(null); setIsNew(false); }}
                                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all disabled:opacity-60">
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                {saving ? 'Saving...' : 'Save Plan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
