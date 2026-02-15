'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { LoadingSpinner } from '@/components/Loading';
import Disclaimer from '@/components/Disclaimer';
import { Signal, Stats } from '@/types/dashboard';
import SignalCard from '@/components/dashboard/SignalCard';
import StatsRow from '@/components/dashboard/StatsRow';
import SignalDetailModal from '@/components/dashboard/SignalDetailModal';
import AIDataAnalysis from '@/components/AIDataAnalysis';
import { Layers, CheckCircle2, Search, Sparkles, TrendingUp, Shield, Zap, ArrowDownToLine } from 'lucide-react';
import CustomerPerformanceChart from '@/components/dashboard/CustomerPerformanceChart';


const TRADING_TIPS = [
    "Always respect your stop loss. The first loss is the best loss.",
    "Trend is your friend until it bends.",
    "Never risk more than 2% of your capital on a single trade.",
    "Plan the trade and trade the plan.",
    "Don't catch a falling knife.",
    "Patience is a trader's best virtue.",
    "Cut your losses short and let your winners run.",
    "The market is always right. Don't fight it.",
    "Buy the rumor, sell the news.",
    "Risk management is key to longevity in trading.",
    "Don't trade with money you can't afford to lose.",
    "Keep your emotions in check. Fear and greed are enemies.",
    "A trading journal is your best teacher.",
    "Focus on the process, not just the profits.",
    "Wait for the trade to come to you, don't chase it."
];

export default function CustomerDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeSignals, setActiveSignals] = useState<Signal[]>([]);
    const [closedSignals, setClosedSignals] = useState<Signal[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'closed'>('active');
    const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentTip, setCurrentTip] = useState(TRADING_TIPS[0]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');


    const fetchData = useCallback(async () => {
        try {
            const [activeRes, closedRes, statsRes] = await Promise.all([
                fetch('/api/signals?status=active&limit=100'),
                fetch('/api/signals?status=closed&limit=100'),
                fetch('/api/stats'),
            ]);

            const [activeData, closedData, statsData] = await Promise.all([
                activeRes.json(),
                closedRes.json(),
                statsRes.json(),
            ]);

            setActiveSignals(activeData.signals || []);
            setClosedSignals(closedData.signals || []);
            setStats(statsData);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push('/login');
            return;
        }
        if (session.user?.role === 'ADMIN') {
            router.push('/admin');
            return;
        }
        if (session.user?.subscriptionStatus !== 'active') {
            router.push('/pricing');
            return;
        }
        fetchData();

        // Randomize tip on load
        const randomTip = TRADING_TIPS[Math.floor(Math.random() * TRADING_TIPS.length)];
        setCurrentTip(randomTip);
    }, [session, status, router, fetchData]);

    if (status === 'loading' || loading) return <LoadingSpinner />;

    if (!session || session.user?.subscriptionStatus !== 'active') return null;

    const displayedSignals = activeTab === 'active' ? activeSignals : closedSignals;
    const filteredSignals = displayedSignals.filter(s => {
        const matchesSearch = s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.companyName.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (startDate) {
            const signalDate = new Date(s.entryDateTime).toISOString().split('T')[0];
            if (signalDate < startDate) return false;
        }

        if (endDate) {
            const signalDate = new Date(s.entryDateTime).toISOString().split('T')[0];
            if (signalDate > endDate) return false;
        }

        return true;
    });

    const expiryDate = session.user?.subscriptionExpiresAt
        ? new Date(session.user.subscriptionExpiresAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : 'N/A';

    return (
        <div className="relative pb-10" style={{ overflow: 'hidden' }}>
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none" style={{ zIndex: 0, background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none" style={{ zIndex: 0, background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)' }} />

            {/* Floating decorative dots */}
            <div className="absolute top-40 right-20 w-2 h-2 rounded-full bg-purple-400/20 animate-pulse" style={{ zIndex: 0 }} />
            <div className="absolute top-60 right-40 w-3 h-3 rounded-full bg-indigo-400/15 animate-pulse" style={{ zIndex: 0, animationDelay: '1s' }} />
            <div className="absolute bottom-40 right-60 w-2 h-2 rounded-full bg-blue-400/20 animate-pulse" style={{ zIndex: 0, animationDelay: '2s' }} />

            <div className="px-6 lg:px-10 py-8 w-full">
                {/* Header Section - Bigger */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20">
                                <Sparkles size={20} className="text-white" />
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight">
                                Welcome back, {session.user?.name?.split(' ')[0]}! 👋
                            </h1>
                        </div>
                        <p className="text-gray-500 text-base mt-2 flex items-center gap-2 ml-[52px]">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                            Subscription active until <span className="font-semibold text-gray-700">{expiryDate}</span>
                        </p>
                    </div>
                    {/* Search Bar */}
                    <div className="relative group w-full lg:w-auto">
                        <input
                            type="text"
                            placeholder="Search signals..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full lg:w-[300px] pl-12 pr-5 py-3.5 rounded-2xl border border-gray-200/80 bg-white/90 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all outline-none text-base"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                    </div>
                </div>

                {/* Main Stats Row - Bigger */}
                {stats && <StatsRow stats={stats} />}

                {/* AI Data Analysis - Moved Here for Visibility */}
                <div className="mt-8 mb-8">
                    <AIDataAnalysis signals={closedSignals} title="AI Market Analysis" />
                </div>

                {/* Content Grid - Full Width */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-2">
                    {/* Left Column: Signals Feed */}
                    <div className="xl:col-span-8 space-y-6">

                        {/* Tabs - Bigger */}
                        <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-sm border border-gray-100/80 w-fit">
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === 'active'
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Layers size={16} />
                                Active Signals
                                <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${activeTab === 'active' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                    {activeSignals.length}
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveTab('closed')}
                                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === 'closed'
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <CheckCircle2 size={16} />
                                Closed History
                                <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${activeTab === 'closed' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                    {closedSignals.length}
                                </span>
                            </button>
                        </div>

                        {/* Filters - Bigger */}
                        <div className="flex gap-5 items-center flex-wrap bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100/80">
                            <div className="flex items-center gap-2.5">
                                <label className="text-sm text-gray-500 font-semibold">From:</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white"
                                />
                            </div>
                            <div className="flex items-center gap-2.5">
                                <label className="text-sm text-gray-500 font-semibold">To:</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white"
                                />
                            </div>
                            {(startDate || endDate) && (
                                <button
                                    onClick={() => { setStartDate(''); setEndDate(''); }}
                                    className="text-sm text-red-500 hover:text-red-700 font-semibold underline underline-offset-2"
                                >
                                    Clear Filters
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    const headers = ['Symbol', 'Company', 'Type', 'Direction', 'Entry Price', 'Target', 'Stop Loss', 'Exit Price', 'Return %', 'Status', 'Entry Date', 'Exit Date'];
                                    const csvContent = [
                                        headers.join(','),
                                        ...filteredSignals.map(s => [
                                            s.symbol,
                                            `"${s.companyName}"`,
                                            s.signalType,
                                            s.direction,
                                            s.entryPrice,
                                            s.targetPrice,
                                            s.stopLossPrice,
                                            s.exitPrice || '',
                                            s.returnPercent || '',
                                            s.status,
                                            new Date(s.entryDateTime).toLocaleDateString('en-IN'),
                                            s.exitDateTime ? new Date(s.exitDateTime).toLocaleDateString('en-IN') : ''
                                        ].join(','))
                                    ].join('\n');

                                    const blob = new Blob([csvContent], { type: 'text/csv' });
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `signals_export_${new Date().toISOString().split('T')[0]}.csv`;
                                    a.click();
                                }}
                                className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
                            >
                                <ArrowDownToLine size={14} />
                                Export CSV
                            </button>
                        </div>

                        {/* Signals Grid - Bigger cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-5 duration-500">
                            {filteredSignals.length > 0 ? (
                                filteredSignals.map((signal) => (
                                    <SignalCard
                                        key={signal.id}
                                        signal={signal}
                                        onClick={setSelectedSignal}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full py-16 text-center bg-white/80 backdrop-blur-sm rounded-2xl border border-dashed border-gray-300">
                                    <div className="inline-flex p-5 bg-gray-50 rounded-full text-gray-400 mb-4">
                                        <Search size={28} />
                                    </div>
                                    <h3 className="text-gray-900 font-bold text-lg">No signals found</h3>
                                    <p className="text-gray-500 mt-2">Try adjusting your search or check back later.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Widgets */}
                    <div className="xl:col-span-4 space-y-6">
                        <div className="sticky top-24">
                            <CustomerPerformanceChart signals={closedSignals} />

                            {/* Pro Trading Tip - Enhanced */}
                            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 rounded-2xl p-7 text-white shadow-xl relative overflow-hidden mt-6">
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                                <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-24 h-24 bg-purple-500/10 rounded-full blur-xl" />
                                {/* Grid pattern overlay */}
                                <div className="absolute inset-0 opacity-5" style={{
                                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                                    backgroundSize: '20px 20px'
                                }} />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-white/10 rounded-lg">
                                            <Zap size={14} className="text-amber-400" />
                                        </div>
                                        <h3 className="font-bold text-lg">Pro Trading Tip</h3>
                                    </div>
                                    <p className="text-indigo-100/90 text-base leading-relaxed min-h-[70px]">
                                        &ldquo;{currentTip}&rdquo;
                                    </p>
                                    <div className="mt-5 pt-4 border-t border-white/10 text-xs text-indigo-300/60 flex items-center gap-2">
                                        <Sparkles size={10} />
                                        Daily Wisdom
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats Widget */}
                            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100/80 mt-6">
                                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                    <Shield size={14} className="text-purple-500" />
                                    Risk Management
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Max risk per trade</span>
                                        <span className="text-xs font-bold text-gray-700">2%</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full w-[30%] bg-gradient-to-r from-green-400 to-green-500 rounded-full" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Portfolio exposure</span>
                                        <span className="text-xs font-bold text-amber-600">Moderate</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full w-[55%] bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-xs text-gray-400">
                                    Need help? <a href="#" className="text-purple-600 hover:underline font-medium">Contact Support</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Disclaimer Footer */}
                <div className="mt-16 border-t border-gray-200/60 pt-8">
                    <Disclaimer />
                </div>
            </div>

            {/* Modal */}
            {selectedSignal && (
                <SignalDetailModal
                    signal={selectedSignal}
                    onClose={() => setSelectedSignal(null)}
                />
            )}
        </div>
    );
}
