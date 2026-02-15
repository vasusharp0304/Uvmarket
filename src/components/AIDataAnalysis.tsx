'use client';

import { useMemo } from 'react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Brain, Sparkles, TrendingUp, Target, ShieldCheck, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Signal {
    id: string;
    symbol: string;
    direction: string;
    status: string;
    returnPercent: number | null;
    signalType: string;
    entryDateTime: string;
}

interface AIDataAnalysisProps {
    signals: Signal[];
    title?: string;
}

export default function AIDataAnalysis({ signals, title = "AI Data Analysis" }: AIDataAnalysisProps) {
    const analysis = useMemo(() => {
        const closed = signals.filter(s => s.status !== 'ACTIVE' && s.status !== 'PENDING');
        const winners = closed.filter(s => s.returnPercent && s.returnPercent > 0);
        const losers = closed.filter(s => s.returnPercent && s.returnPercent < 0);

        // Win/Loss distribution
        const winLossData = [
            { name: 'Winners', value: winners.length, color: '#22c55e' },
            { name: 'Losers', value: losers.length, color: '#ef4444' },
            { name: 'Breakeven', value: closed.length - winners.length - losers.length, color: '#94a3b8' },
        ];

        // BUY vs SELL performance
        const buys = closed.filter(s => s.direction === 'BUY');
        const sells = closed.filter(s => s.direction === 'SELL');
        const buyWinRate = buys.length > 0 ? Math.round((buys.filter(s => s.returnPercent && s.returnPercent > 0).length / buys.length) * 100) : 0;
        const sellWinRate = sells.length > 0 ? Math.round((sells.filter(s => s.returnPercent && s.returnPercent > 0).length / sells.length) * 100) : 0;
        const buyAvgReturn = buys.length > 0 ? buys.reduce((sum, s) => sum + (s.returnPercent || 0), 0) / buys.length : 0;
        const sellAvgReturn = sells.length > 0 ? sells.reduce((sum, s) => sum + (s.returnPercent || 0), 0) / sells.length : 0;

        const directionData = [
            { name: 'BUY', winRate: buyWinRate, avgReturn: parseFloat(buyAvgReturn.toFixed(2)), count: buys.length },
            { name: 'SELL', winRate: sellWinRate, avgReturn: parseFloat(sellAvgReturn.toFixed(2)), count: sells.length },
        ];

        // INTRADAY vs POSITIONAL
        const intraday = closed.filter(s => s.signalType === 'INTRADAY');
        const positional = closed.filter(s => s.signalType === 'POSITIONAL');
        const intradayWinRate = intraday.length > 0 ? Math.round((intraday.filter(s => s.returnPercent && s.returnPercent > 0).length / intraday.length) * 100) : 0;
        const positionalWinRate = positional.length > 0 ? Math.round((positional.filter(s => s.returnPercent && s.returnPercent > 0).length / positional.length) * 100) : 0;

        const typeData = [
            { name: 'Intraday', winRate: intradayWinRate, count: intraday.length },
            { name: 'Positional', winRate: positionalWinRate, count: positional.length },
        ];

        // Monthly performance trend
        const monthlyMap: Record<string, { wins: number; total: number; totalReturn: number }> = {};
        closed.forEach(s => {
            const date = new Date(s.entryDateTime);
            const key = `${date.toLocaleString('en', { month: 'short' })} ${date.getFullYear()}`;
            if (!monthlyMap[key]) monthlyMap[key] = { wins: 0, total: 0, totalReturn: 0 };
            monthlyMap[key].total++;
            monthlyMap[key].totalReturn += s.returnPercent || 0;
            if (s.returnPercent && s.returnPercent > 0) monthlyMap[key].wins++;
        });
        const monthlyTrend = Object.entries(monthlyMap).map(([name, data]) => ({
            name,
            winRate: data.total > 0 ? Math.round((data.wins / data.total) * 100) : 0,
            avgReturn: data.total > 0 ? parseFloat((data.totalReturn / data.total).toFixed(2)) : 0,
        }));

        // AI Insights
        const totalWinRate = closed.length > 0 ? Math.round((winners.length / closed.length) * 100) : 0;
        const avgReturn = closed.length > 0 ? closed.reduce((sum, s) => sum + (s.returnPercent || 0), 0) / closed.length : 0;
        const bestTrade = closed.reduce((best, s) => (s.returnPercent || 0) > (best.returnPercent || 0) ? s : best, closed[0] || { symbol: 'N/A', returnPercent: 0 });
        const worstTrade = closed.reduce((worst, s) => (s.returnPercent || 0) < (worst.returnPercent || 0) ? s : worst, closed[0] || { symbol: 'N/A', returnPercent: 0 });

        return { winLossData, directionData, typeData, monthlyTrend, totalWinRate, avgReturn, bestTrade, worstTrade, closed };
    }, [signals]);

    if (signals.length === 0) {
        return (
            <div className="bg-white/80 backdrop-blur-sm p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                <Brain size={40} className="text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-500">No data available for AI analysis</h3>
                <p className="text-sm text-gray-400 mt-1">Signals data will appear here once available.</p>
            </div>
        );
    }

    const COLORS = ['#22c55e', '#ef4444', '#94a3b8'];

    return (
        <div className="space-y-6 mt-8">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/20">
                    <Brain size={22} className="text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">{title}</h2>
                    <p className="text-sm text-gray-500">AI-powered insights from {analysis.closed.length} closed signals</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 bg-violet-50 text-violet-700 px-3 py-1.5 rounded-full text-xs font-bold">
                    <Sparkles size={12} />
                    AI Powered
                </div>
            </div>

            {/* AI Insight Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-green-50 rounded-lg"><Target size={16} className="text-green-600" /></div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Win Rate</span>
                    </div>
                    <div className="text-3xl font-extrabold text-gray-800">{analysis.totalWinRate}%</div>
                    <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all" style={{ width: `${analysis.totalWinRate}%` }} />
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg"><TrendingUp size={16} className="text-blue-600" /></div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Return</span>
                    </div>
                    <div className={`text-3xl font-extrabold flex items-center gap-1 ${analysis.avgReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {analysis.avgReturn >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                        {analysis.avgReturn.toFixed(2)}%
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-emerald-50 rounded-lg"><Zap size={16} className="text-emerald-600" /></div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Best Trade</span>
                    </div>
                    <div className="text-lg font-extrabold text-gray-800">{analysis.bestTrade?.symbol || 'N/A'}</div>
                    <div className="text-sm font-bold text-green-600 mt-1">+{(analysis.bestTrade?.returnPercent || 0).toFixed(2)}%</div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-red-50 rounded-lg"><ShieldCheck size={16} className="text-red-600" /></div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Worst Trade</span>
                    </div>
                    <div className="text-lg font-extrabold text-gray-800">{analysis.worstTrade?.symbol || 'N/A'}</div>
                    <div className="text-sm font-bold text-red-600 mt-1">{(analysis.worstTrade?.returnPercent || 0).toFixed(2)}%</div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Win/Loss Pie Chart */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        Win / Loss Distribution
                    </h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analysis.winLossData}
                                    cx="50%" cy="50%"
                                    innerRadius={60} outerRadius={90}
                                    paddingAngle={4}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {analysis.winLossData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Direction Performance */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        BUY vs SELL Performance
                    </h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analysis.directionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontWeight: 700, fontSize: 13 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="winRate" name="Win Rate %" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={50} />
                                <Bar dataKey="avgReturn" name="Avg Return %" fill="#8b5cf6" radius={[8, 8, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Monthly Trend */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Monthly Win Rate Trend
                    </h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analysis.monthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorWinRate" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="winRate" name="Win Rate %" stroke="#22c55e" strokeWidth={3} fill="url(#colorWinRate)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Intraday vs Positional comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysis.typeData.map((type) => (
                    <div key={type.name} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
                        <div>
                            <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">{type.name}</div>
                            <div className="text-3xl font-extrabold text-gray-800">{type.winRate}%</div>
                            <div className="text-xs text-gray-500 mt-1">{type.count} signals</div>
                        </div>
                        <div className="w-24 h-24 relative">
                            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                                <circle
                                    cx="18" cy="18" r="14" fill="none"
                                    stroke={type.name === 'Intraday' ? '#8b5cf6' : '#3b82f6'}
                                    strokeWidth="4"
                                    strokeDasharray={`${type.winRate * 0.88} 88`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-bold text-gray-700">{type.winRate}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
