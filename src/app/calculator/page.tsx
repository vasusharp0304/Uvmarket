'use client';

import { useState, useEffect, useMemo } from 'react';
import { Signal } from '@/types/dashboard';
import { Calculator, TrendingUp, IndianRupee, BarChart3, PiggyBank, Calendar, Filter, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/Loading';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function ProfitCalculatorPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [closedSignals, setClosedSignals] = useState<Signal[]>([]);
    const [loading, setLoading] = useState(true);
    const [capital, setCapital] = useState(100000);
    const [perTradePercent, setPerTradePercent] = useState(10);

    // Filter states
    const [dateFilterType, setDateFilterType] = useState<'all' | 'custom' | 'month'>('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

    useEffect(() => {
        if (status === 'loading') return;
        if (!session) { router.push('/login'); return; }
        fetchData();
    }, [session, status, router]);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/signals?status=closed&limit=1000');
            const data = await res.json();
            setClosedSignals(data.signals || []);
        } catch { } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredSignals = useMemo(() => {
        return closedSignals.filter(s => {
            const date = new Date(s.entryDateTime);

            if (dateFilterType === 'custom') {
                if (startDate && date < new Date(startDate)) return false;
                if (endDate && date > new Date(endDate)) return false;
            } else if (dateFilterType === 'month') {
                if (date.getMonth() !== parseInt(selectedMonth)) return false;
                if (date.getFullYear() !== parseInt(selectedYear)) return false;
            }

            return true;
        }).sort((a, b) => new Date(a.entryDateTime).getTime() - new Date(b.entryDateTime).getTime());
    }, [closedSignals, dateFilterType, startDate, endDate, selectedMonth, selectedYear]);

    // Calculation Logic
    const { tradeLog, totalPnL, totalReturnPct, winners, losers, finalCapital } = useMemo(() => {
        let runningCapital = capital;
        const log = [];

        for (const s of filteredSignals) {
            if (s.returnPercent !== null) {
                const invested = (runningCapital * perTradePercent) / 100;
                const pnl = (invested * s.returnPercent) / 100;
                runningCapital += pnl;

                log.push({
                    symbol: s.symbol,
                    returnPct: s.returnPercent,
                    pnl: Math.round(pnl),
                    cumCapital: Math.round(runningCapital),
                    date: new Date(s.entryDateTime).toLocaleDateString('en-IN'),
                    rawDate: s.entryDateTime
                });
            }
        }

        return {
            tradeLog: log,
            totalPnL: runningCapital - capital,
            totalReturnPct: capital > 0 ? ((runningCapital - capital) / capital) * 100 : 0,
            winners: log.filter(t => t.pnl > 0).length,
            losers: log.filter(t => t.pnl <= 0).length,
            finalCapital: runningCapital
        };
    }, [filteredSignals, capital, perTradePercent]);

    const perTradeCapital = (capital * perTradePercent) / 100;

    if (status === 'loading' || loading) return <LoadingSpinner />;

    // Generate years for dropdown (e.g., current year back to 2020)
    const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <Calculator className="text-purple-600" size={28} />
                            Profit Calculator
                        </h1>
                        <p className="text-gray-500 mt-1">Analyze hypothetical returns based on closed signals</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Input & Filters Section */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Capital Input */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <PiggyBank size={20} className="text-gray-400" /> Portfolio Config
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-2">Starting Capital (₹)</label>
                                    <input
                                        type="number"
                                        value={capital}
                                        onChange={e => setCapital(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-lg font-semibold focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                                    />
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {[50000, 100000, 500000].map(v => (
                                            <button key={v} onClick={() => setCapital(v)}
                                                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${capital === v ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                                ₹{(v / 1000)}K
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-2">Per Trade Allocation (%)</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min={1} max={100} value={perTradePercent}
                                            onChange={e => setPerTradePercent(parseInt(e.target.value))}
                                            className="flex-1 accent-purple-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <span className="font-bold text-purple-600 w-12 text-right">{perTradePercent}%</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 text-right">
                                        Allocation: <span className="font-semibold text-gray-700">₹{Math.round(perTradeCapital).toLocaleString('en-IN')}</span> per trade
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                    <Filter size={20} className="text-gray-400" /> Filters
                                </h2>
                                {dateFilterType !== 'all' && (
                                    <button
                                        onClick={() => setDateFilterType('all')}
                                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                                    >
                                        <X size={12} /> Clear
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-2 p-1 bg-gray-100/80 rounded-lg">
                                    {['all', 'month', 'custom'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setDateFilterType(type as any)}
                                            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${dateFilterType === type
                                                ? 'bg-white text-purple-700 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            {type === 'all' ? 'All Time' : type === 'month' ? 'Monthly' : 'Custom'}
                                        </button>
                                    ))}
                                </div>

                                {dateFilterType === 'month' && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <select
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(e.target.value)}
                                            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-purple-500 outline-none"
                                        >
                                            {months.map((m, i) => (
                                                <option key={i} value={i}>{m}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(e.target.value)}
                                            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-purple-500 outline-none"
                                        >
                                            {years.map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {dateFilterType === 'custom' && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">From</label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-purple-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">To</label>
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-purple-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chart & Stats Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                                <PiggyBank className="mx-auto text-blue-500 mb-2 opacity-80" size={24} />
                                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Trades</div>
                                <div className="text-lg font-bold text-gray-800">{filteredSignals.length}</div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                                <IndianRupee className="mx-auto text-green-500 mb-2 opacity-80" size={24} />
                                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Final Cap</div>
                                <div className="text-lg font-bold text-green-700">₹{finalCapital.toLocaleString('en-IN')}</div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                                <TrendingUp className="mx-auto text-purple-500 mb-2 opacity-80" size={24} />
                                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Net PnL</div>
                                <div className={`text-lg font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {totalPnL >= 0 ? '+' : ''}₹{Math.round(totalPnL).toLocaleString('en-IN')}
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                                <BarChart3 className="mx-auto text-amber-500 mb-2 opacity-80" size={24} />
                                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Win Rate</div>
                                <div className="text-lg font-bold text-gray-800">
                                    {filteredSignals.length > 0 ? ((winners / filteredSignals.length) * 100).toFixed(1) : 0}%
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <TrendingUp size={20} className="text-purple-600" /> Equity Curve
                            </h3>
                            <div className="h-[300px] w-full">
                                {tradeLog.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={tradeLog}>
                                            <defs>
                                                <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 12, fill: '#9ca3af' }}
                                                axisLine={false}
                                                tickLine={false}
                                                minTickGap={30}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12, fill: '#9ca3af' }}
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={(value) => `₹${value / 1000}k`}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                formatter={(value: any) => [`₹${(value || 0).toLocaleString('en-IN')}`, 'Capital']}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="cumCapital"
                                                stroke="#8b5cf6"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorCapital)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                        <BarChart3 size={48} className="mb-2 opacity-20" />
                                        <p>No data to visualize</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Trade Log Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-bold text-gray-800">Trade Breakdown</h3>
                                <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                                    {winners} W / {losers} L
                                </div>
                            </div>
                            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Symbol</th>
                                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Return</th>
                                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">PnL</th>
                                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {tradeLog.map((t, i) => (
                                            <tr key={i} className="hover:bg-purple-50/30 transition-colors">
                                                <td className="px-4 py-3 text-gray-600 text-xs">{t.date}</td>
                                                <td className="px-4 py-3 font-semibold text-gray-800">{t.symbol}</td>
                                                <td className={`px-4 py-3 text-right font-medium ${t.returnPct > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {t.returnPct > 0 ? '+' : ''}{t.returnPct.toFixed(2)}%
                                                </td>
                                                <td className={`px-4 py-3 text-right font-medium ${t.pnl > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {t.pnl > 0 ? '+' : ''}₹{t.pnl.toLocaleString('en-IN')}
                                                </td>
                                                <td className="px-4 py-3 text-right text-gray-700 font-mono text-xs">₹{t.cumCapital.toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {tradeLog.length === 0 && (
                                    <div className="py-12 text-center text-gray-400">
                                        <p>No trades found for selected period.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center text-xs text-gray-400 max-w-2xl mx-auto">
                    Note: Performance calculated based on historical signals assuming {perTradePercent}% capital allocation per trade.
                    Past performance is not indicative of future results.
                </div>
            </div>
        </div>
    );
}
