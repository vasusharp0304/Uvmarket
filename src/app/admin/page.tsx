'use client';

import { useEffect, useState, useCallback } from 'react';
import { LoadingSpinner } from '@/components/Loading';
import AdminCharts from '@/components/admin/AdminCharts';
import AIDataAnalysis from '@/components/AIDataAnalysis';
import { Users, CreditCard, TrendingUp, Target, Percent, Activity, Sparkles, ArrowUpRight, BarChart3 } from 'lucide-react';

interface ChartData {
    revenue: { name: string; value: number }[];
    performance: { name: string; value: number }[];
}

interface AdminStats {
    totalCustomers: number;
    activeSubscriptions: number;
    totalSignals: number;
    totalClosed: number;
    winners: number;
    winRate: number;
    avgReturn: number;
    totalRevenue: number;
    totalPayments: number;
    charts?: ChartData;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [signals, setSignals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        try {
            const [statsRes, signalsRes] = await Promise.all([
                fetch('/api/admin/stats'),
                fetch('/api/signals?status=closed&limit=500'),
            ]);
            const [statsData, signalsData] = await Promise.all([
                statsRes.json(),
                signalsRes.json(),
            ]);
            setStats(statsData);
            setSignals(signalsData.signals || []);
        } catch (err) {
            console.error('Error fetching admin stats:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-30 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />

            {/* Header - Bigger */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20">
                            <BarChart3 size={22} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Admin Dashboard</h1>
                            <p className="text-gray-500 text-sm mt-1">Overview of your signals and business performance</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm">
                        <Activity size={14} className="text-green-500 animate-pulse" />
                        Live
                    </div>
                    <div className="text-sm text-gray-400 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm">
                        Last updated: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>

            {/* Top Stats Row - Bigger */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Customers */}
                <div className="group bg-white/80 backdrop-blur-sm p-7 rounded-2xl shadow-sm border border-gray-100/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-bl-full" />
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl text-blue-600 shadow-sm">
                            <Users size={22} />
                        </div>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Customers</span>
                    </div>
                    <div className="text-4xl font-extrabold text-gray-800 tracking-tight">{stats?.totalCustomers || 0}</div>
                    <div className="text-xs text-green-600 mt-3 font-semibold flex items-center gap-1.5">
                        <span className="bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                            <ArrowUpRight size={10} />
                            {stats?.activeSubscriptions || 0} Active
                        </span>
                    </div>
                </div>

                {/* Revenue */}
                <div className="group bg-white/80 backdrop-blur-sm p-7 rounded-2xl shadow-sm border border-gray-100/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-100/50 to-transparent rounded-bl-full" />
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl text-purple-600 shadow-sm">
                            <CreditCard size={22} />
                        </div>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Revenue</span>
                    </div>
                    <div className="text-4xl font-extrabold text-gray-800 tracking-tight">
                        ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-gray-400 mt-3 font-medium">
                        Total payments: {stats?.totalPayments || 0}
                    </div>
                </div>

                {/* Signals */}
                <div className="group bg-white/80 backdrop-blur-sm p-7 rounded-2xl shadow-sm border border-gray-100/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100/50 to-transparent rounded-bl-full" />
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl text-amber-600 shadow-sm">
                            <Target size={22} />
                        </div>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Signals</span>
                    </div>
                    <div className="text-4xl font-extrabold text-gray-800 tracking-tight">{stats?.totalSignals || 0}</div>
                    <div className="text-xs text-gray-400 mt-3 font-medium">
                        {stats?.totalClosed || 0} Closed
                    </div>
                </div>

                {/* Win Rate */}
                <div className="group bg-white/80 backdrop-blur-sm p-7 rounded-2xl shadow-sm border border-gray-100/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-100/50 to-transparent rounded-bl-full" />
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl text-green-600 shadow-sm">
                            <TrendingUp size={22} />
                        </div>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Win Rate</span>
                    </div>
                    <div className={`text-4xl font-extrabold tracking-tight ${(stats?.winRate || 0) >= 50 ? 'text-green-600' : 'text-red-500'}`}>
                        {stats?.winRate || 0}%
                    </div>
                    <div className="text-xs text-gray-400 mt-3 font-medium flex items-center gap-1.5">
                        <Sparkles size={10} className="text-amber-500" />
                        {stats?.winners || 0} Winning Trades
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            {stats?.charts && <AdminCharts data={stats.charts} />}

            {/* Secondary Stats Row - Bigger */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100/80 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Avg Return</div>
                        <div className={`text-2xl font-extrabold mt-2 ${(stats?.avgReturn || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {stats?.avgReturn || 0}%
                        </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-full text-gray-400">
                        <Percent size={20} />
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100/80 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Active Subs</div>
                        <div className="text-2xl font-extrabold mt-2 text-blue-600">
                            {stats?.activeSubscriptions || 0}
                        </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-full text-blue-400">
                        <Users size={20} />
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100/80 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Winners</div>
                        <div className="text-2xl font-extrabold mt-2 text-green-600">
                            {stats?.winners || 0}
                        </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-full text-green-400">
                        <TrendingUp size={20} />
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100/80 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Closed</div>
                        <div className="text-2xl font-extrabold mt-2 text-gray-800">
                            {stats?.totalClosed || 0}
                        </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-full text-gray-400">
                        <Target size={20} />
                    </div>
                </div>
            </div>

            {/* AI Data Analysis Section */}
            <AIDataAnalysis signals={signals} title="AI Data Analysis" />
        </div>
    );
}
