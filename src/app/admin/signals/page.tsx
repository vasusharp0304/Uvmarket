'use client';

import { useEffect, useState, useCallback } from 'react';
import { LoadingSpinner } from '@/components/Loading';
import { Search, Plus, Filter, Edit2, XCircle, Eye, EyeOff, CheckCircle2, TrendingUp, Clock, AlertCircle, Upload } from 'lucide-react';

interface Signal {
    id: string;
    symbol: string;
    companyName: string;
    segment: string;
    signalType: string;
    direction: string;
    entryPrice: number;
    targetPrice: number;
    stopLossPrice: number;
    exitPrice: number | null;
    status: string;
    returnPercent: number | null;
    notes: string | null;
    isVisibleToCustomers: boolean;
    entryDateTime: string;
    createdAt: string;
    screenshots?: { id: string; imageUrl: string }[];
}

const INITIAL_FORM = {
    symbol: '',
    companyName: '',
    segment: 'Equity',
    signalType: 'Swing',
    direction: 'BUY',
    entryPrice: '',
    targetPrice: '',
    stopLossPrice: '',
    notes: '',
    isVisibleToCustomers: true,
    status: 'ACTIVE',
};

const CLOSE_FORM_INITIAL = {
    exitPrice: '',
    status: 'TARGET_HIT',
};

export default function AdminSignals() {
    const [signals, setSignals] = useState<Signal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [showClose, setShowClose] = useState<string | null>(null);
    const [editingSignal, setEditingSignal] = useState<Signal | null>(null);
    const [form, setForm] = useState(INITIAL_FORM);
    const [closeForm, setCloseForm] = useState(CLOSE_FORM_INITIAL);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchSignals = useCallback(async () => {
        try {
            const res = await fetch('/api/signals?limit=200');
            const data = await res.json();
            setSignals(data.signals || []);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSignals();
    }, [fetchSignals]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, String(value));
            });
            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            const res = await fetch('/api/signals', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) {
                const d = await res.json();
                setError(d.error || 'Failed to create signal');
                return;
            }
            setSuccess('Signal created successfully!');
            setShowCreate(false);
            setForm(INITIAL_FORM);
            setSelectedFile(null);
            fetchSignals();
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSignal) return;
        setError('');
        setSaving(true);
        try {
            const res = await fetch(`/api/signals/${editingSignal.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const d = await res.json();
                setError(d.error || 'Failed to update signal');
                return;
            }
            setSuccess('Signal updated successfully!');
            setEditingSignal(null);
            setForm(INITIAL_FORM);
            setSelectedFile(null);
            fetchSignals();
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const handleClose = async (signalId: string) => {
        setError('');
        setSaving(true);
        try {
            const res = await fetch(`/api/signals/${signalId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    exitPrice: closeForm.exitPrice,
                    status: closeForm.status,
                }),
            });
            if (!res.ok) {
                const d = await res.json();
                setError(d.error || 'Failed to close signal');
                return;
            }
            setSuccess('Signal closed successfully!');
            setShowClose(null);
            setCloseForm(CLOSE_FORM_INITIAL);
            fetchSignals();
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleVisibility = async (signal: Signal) => {
        try {
            await fetch(`/api/signals/${signal.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isVisibleToCustomers: !signal.isVisibleToCustomers }),
            });
            fetchSignals();
        } catch {
            setError('Failed to toggle visibility');
        }
    };

    const openEdit = (signal: Signal) => {
        setEditingSignal(signal);
        setForm({
            symbol: signal.symbol,
            companyName: signal.companyName,
            segment: signal.segment,
            signalType: signal.signalType,
            direction: signal.direction,
            entryPrice: signal.entryPrice.toString(),
            targetPrice: signal.targetPrice.toString(),
            stopLossPrice: signal.stopLossPrice.toString(),
            notes: signal.notes || '',
            isVisibleToCustomers: signal.isVisibleToCustomers,
            status: signal.status,
        });
        setSelectedFile(null);
        setShowCreate(false);
    };

    const filteredSignals = signals.filter(signal => {
        const matchesSearch = signal.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            signal.companyName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || signal.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="text-purple-600" />
                        Signal Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Create and manage your trading signals</p>
                </div>
                <button
                    onClick={() => {
                        setShowCreate(true);
                        setEditingSignal(null);
                        setForm(INITIAL_FORM);
                        setSelectedFile(null);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all font-semibold"
                >
                    <Plus size={18} />
                    New Signal
                </button>
            </div>

            {error && <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center gap-2 animate-in fade-in"><AlertCircle size={18} /> {error}</div>}
            {success && <div className="p-4 rounded-xl bg-green-50 text-green-600 border border-green-100 flex items-center gap-2 animate-in fade-in"><CheckCircle2 size={18} /> {success}</div>}

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search symbol or company..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter size={18} className="text-gray-400" />
                    <select
                        className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="PENDING">Pending</option>
                        <option value="TARGET_HIT">Target Hit</option>
                        <option value="STOP_LOSS">Stop Loss</option>
                        <option value="CLOSED_MANUAL">Closed Manual</option>
                    </select>
                </div>
            </div>

            {/* Signals Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Media</th>
                                <th className="px-6 py-4">Symbol / Company</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Entry / Targets</th>
                                <th className="px-6 py-4">Performance</th>
                                <th className="px-6 py-4 text-center">Visibility</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredSignals.map((signal) => (
                                <tr key={signal.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase gap-1.5 ${signal.status === 'TARGET_HIT' ? 'bg-green-100 text-green-700' :
                                            signal.status === 'STOP_LOSS' ? 'bg-red-100 text-red-700' :
                                                signal.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {signal.status.replace('_', ' ')}
                                        </span>
                                        <div className="text-[10px] text-gray-400 mt-2 font-medium flex items-center gap-1">
                                            <Clock size={10} />
                                            {new Date(signal.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {signal.screenshots && signal.screenshots.length > 0 ? (
                                            <div className="relative group w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                                                <img
                                                    src={signal.screenshots[0].imageUrl}
                                                    alt="Chart"
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                            </div>
                                        ) : (
                                            <span className="text-gray-300 text-xs italic">None</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="font-bold text-gray-900">{signal.symbol}</div>
                                            <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded uppercase ${signal.direction === 'BUY' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                {signal.direction}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]">{signal.companyName}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2 py-1 rounded border border-purple-100 bg-purple-50 text-purple-700 text-xs font-semibold">
                                            {signal.signalType}
                                        </span>
                                        <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">{signal.segment}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between w-32">
                                                <span className="text-gray-500 text-xs">Entry:</span>
                                                <span className="font-medium">₹{signal.entryPrice}</span>
                                            </div>
                                            <div className="flex justify-between w-32">
                                                <span className="text-gray-500 text-xs">Target:</span>
                                                <span className="font-bold text-green-600">₹{signal.targetPrice}</span>
                                            </div>
                                            <div className="flex justify-between w-32">
                                                <span className="text-gray-500 text-xs">SL:</span>
                                                <span className="font-medium text-red-500">₹{signal.stopLossPrice}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {signal.returnPercent !== null ? (
                                            <div className={`font-bold text-lg ${signal.returnPercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {signal.returnPercent > 0 ? '+' : ''}{signal.returnPercent.toFixed(2)}%
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-sm">—</span>
                                        )}
                                        {signal.exitPrice && (
                                            <div className="text-[10px] text-gray-400 mt-1">Exit: ₹{signal.exitPrice}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleToggleVisibility(signal)}
                                            className={`p-2 rounded-lg transition-colors ${signal.isVisibleToCustomers ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                }`}
                                            title={signal.isVisibleToCustomers ? 'Visible to customers' : 'Hidden from customers'}
                                        >
                                            {signal.isVisibleToCustomers ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                                onClick={() => openEdit(signal)}
                                                title="Edit Signal"
                                            >
                                                <Edit2 size={16} />
                                            </button>

                                            {['PENDING', 'ACTIVE'].includes(signal.status) && (
                                                <button
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    onClick={() => setShowClose(signal.id)}
                                                    title="Close Trade"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredSignals.length === 0 && (
                    <div className="p-12 text-center text-gray-400 bg-gray-50/30">
                        <TrendingUp size={48} className="mx-auto mb-3 text-gray-200" />
                        <p className="font-medium">No signals found matching your criteria</p>
                        <button
                            className="mt-4 text-purple-600 hover:text-purple-700 font-semibold text-sm"
                            onClick={() => {
                                setShowCreate(true);
                                setEditingSignal(null);
                                setForm(INITIAL_FORM);
                                setSelectedFile(null);
                            }}
                        >
                            + Create New Signal
                        </button>
                    </div>
                )}
            </div>

            {/* Modal Overlay - Shared for Create/Edit/Close */}
            {(showCreate || editingSignal || showClose) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    {/* Create/Edit Modal */}
                    {(showCreate || editingSignal) && (
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="text-xl font-bold text-gray-800">{editingSignal ? 'Edit Signal' : 'Create New Signal'}</h3>
                                <button onClick={() => { setShowCreate(false); setEditingSignal(null); }} className="text-gray-400 hover:text-gray-600">×</button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                <form onSubmit={editingSignal ? handleEdit : handleCreate} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Symbol *</label>
                                            <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20" placeholder="e.g. TATASTEEL" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Company Name *</label>
                                            <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20" placeholder="e.g. Tata Steel Ltd" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Segment</label>
                                            <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white" value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })}>
                                                <option value="Equity">Equity</option>
                                                <option value="F&O">F&O</option>
                                                <option value="Commodity">Commodity</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
                                            <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white" value={form.signalType} onChange={(e) => setForm({ ...form, signalType: e.target.value })}>
                                                <option value="Intraday">Intraday</option>
                                                <option value="Swing">Swing</option>
                                                <option value="Positional">Positional</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Direction</label>
                                            <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white" value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })}>
                                                <option value="BUY">BUY</option>
                                                <option value="SELL">SELL</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 grid grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Entry Price *</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                                <input type="number" step="0.01" className="w-full pl-7 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-900 font-bold" placeholder="0.00" value={form.entryPrice} onChange={(e) => setForm({ ...form, entryPrice: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-green-600 uppercase">Target *</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 font-bold">₹</span>
                                                <input type="number" step="0.01" className="w-full pl-7 pr-4 py-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 text-green-700 font-bold" placeholder="0.00" value={form.targetPrice} onChange={(e) => setForm({ ...form, targetPrice: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-red-500 uppercase">Stop Loss *</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 font-bold">₹</span>
                                                <input type="number" step="0.01" className="w-full pl-7 pr-4 py-2 rounded-lg border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-red-700 font-bold" placeholder="0.00" value={form.stopLossPrice} onChange={(e) => setForm({ ...form, stopLossPrice: e.target.value })} required />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Notes / Analysis</label>
                                        <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 min-h-[100px] resize-y" placeholder="Trading rationale, chart analysis, etc." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                                    </div>

                                    {!editingSignal && (
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Attachment</label>
                                            <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 flex items-center justify-center gap-3 relative hover:bg-gray-100 transition-colors">
                                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                                                <Upload size={20} className="text-gray-400" />
                                                <span className="text-sm text-gray-600 font-medium">
                                                    {selectedFile ? selectedFile.name : "Click to upload chart image"}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <input
                                            type="checkbox"
                                            id="visible"
                                            className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                                            checked={form.isVisibleToCustomers}
                                            onChange={(e) => setForm({ ...form, isVisibleToCustomers: e.target.checked })}
                                        />
                                        <label htmlFor="visible" className="text-sm font-medium text-gray-700 select-none">Immediately visible to customers</label>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button type="button" className="flex-1 px-4 py-3 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all" onClick={() => { setShowCreate(false); setEditingSignal(null); }}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="flex-1 px-4 py-3 rounded-xl font-bold bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20" disabled={saving}>
                                            {saving ? 'Saving...' : (editingSignal ? 'Update Signal' : 'Create Signal')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Close Trade Modal */}
                    {showClose && (
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-800">Close Trade</h3>
                                <button onClick={() => setShowClose(null)} className="text-gray-400 hover:text-gray-600">×</button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Exit Price *</label>
                                    <input type="number" step="0.01" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 font-bold text-lg" placeholder="0.00" value={closeForm.exitPrice} onChange={(e) => setCloseForm({ ...closeForm, exitPrice: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Outcome</label>
                                    <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white" value={closeForm.status} onChange={(e) => setCloseForm({ ...closeForm, status: e.target.value })}>
                                        <option value="TARGET_HIT">Target Hit ✅</option>
                                        <option value="STOP_LOSS">Stop Loss ❌</option>
                                        <option value="CLOSED_MANUAL">Closed Manually</option>
                                    </select>
                                </div>
                                <button
                                    className="w-full mt-2 px-4 py-3 rounded-xl font-bold bg-gray-900 text-white hover:bg-black transition-all"
                                    onClick={() => handleClose(showClose)}
                                    disabled={saving || !closeForm.exitPrice}
                                >
                                    {saving ? 'Closing...' : 'Close Trade'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
