'use client';

import { useState, useEffect, useCallback } from 'react';
import { Signal } from '@/types/dashboard';
import SignalCard from '@/components/dashboard/SignalCard';
import SignalDetailModal from '@/components/dashboard/SignalDetailModal';
import { LoadingSpinner } from '@/components/Loading';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Calendar, Filter, Download, Search, SlidersHorizontal, X } from 'lucide-react';

export default function HistoryPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [signals, setSignals] = useState<Signal[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Filters
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [direction, setDirection] = useState('all');
    const [signalType, setSignalType] = useState('all');
    const [segment, setSegment] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchSignals = useCallback(async () => {
        try {
            const res = await fetch('/api/signals?status=all&limit=500');
            const data = await res.json();
            setSignals(data.signals || []);
        } catch (err) {
            console.error('Error fetching signals:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (status === 'loading') return;
        if (!session) { router.push('/login'); return; }
        fetchSignals();
    }, [session, status, router, fetchSignals]);

    if (status === 'loading' || loading) return <LoadingSpinner />;

    const filtered = signals.filter(s => {
        if (searchTerm && !s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) && !s.companyName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        if (dateFrom && new Date(s.entryDateTime) < new Date(dateFrom)) return false;
        if (dateTo && new Date(s.entryDateTime) > new Date(dateTo + 'T23:59:59')) return false;
        if (direction !== 'all' && s.direction !== direction) return false;
        if (signalType !== 'all' && s.signalType !== signalType) return false;
        if (segment !== 'all' && s.segment !== segment) return false;
        if (statusFilter !== 'all' && s.status !== statusFilter) return false;
        return true;
    });

    const exportCSV = () => {
        window.open('/api/export?type=signals&format=csv', '_blank');
    };

    const clearFilters = () => {
        setDateFrom('');
        setDateTo('');
        setDirection('all');
        setSignalType('all');
        setSegment('all');
        setStatusFilter('all');
        setSearchTerm('');
    };

    const hasActiveFilters = dateFrom || dateTo || direction !== 'all' || signalType !== 'all' || segment !== 'all' || statusFilter !== 'all';

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Signal History</h1>
                        <p className="text-gray-500 mt-1">Browse all recommendations with advanced filters</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${showFilters ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                                }`}
                        >
                            <SlidersHorizontal size={16} />
                            Filters
                            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                        </button>
                        <button
                            onClick={exportCSV}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white text-gray-600 border border-gray-200 hover:border-green-300 transition-all"
                        >
                            <Download size={16} />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Search by symbol or company name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 animate-in slide-in-from-top-3 duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Filter size={16} className="text-purple-600" /> Advanced Filters
                            </h3>
                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                                    <X size={12} /> Clear All
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">From Date</label>
                                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">To Date</label>
                                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Direction</label>
                                <select value={direction} onChange={e => setDirection(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none">
                                    <option value="all">All</option>
                                    <option value="BUY">BUY</option>
                                    <option value="SELL">SELL</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Type</label>
                                <select value={signalType} onChange={e => setSignalType(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none">
                                    <option value="all">All</option>
                                    <option value="Intraday">Intraday</option>
                                    <option value="Swing">Swing</option>
                                    <option value="Positional">Positional</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Segment</label>
                                <select value={segment} onChange={e => setSegment(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none">
                                    <option value="all">All</option>
                                    <option value="Equity">Equity</option>
                                    <option value="F&O">F&O</option>
                                    <option value="Commodity">Commodity</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Status</label>
                                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none">
                                    <option value="all">All</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="TARGET_HIT">Target Hit</option>
                                    <option value="STOP_LOSS">Stop Loss</option>
                                    <option value="CLOSED_MANUAL">Closed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-bold text-gray-800">{filtered.length}</span> of {signals.length} signals
                    </p>
                </div>

                {/* Signals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map(signal => (
                        <SignalCard key={signal.id} signal={signal} onClick={setSelectedSignal} />
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-gray-300 mt-4">
                        <Calendar size={32} className="mx-auto mb-3 text-gray-300" />
                        <h3 className="text-gray-900 font-medium">No signals match your filters</h3>
                        <p className="text-gray-500 text-sm mt-1">Try adjusting the date range or other filters.</p>
                    </div>
                )}
            </div>

            {selectedSignal && <SignalDetailModal signal={selectedSignal} onClose={() => setSelectedSignal(null)} />}
        </div>
    );
}
