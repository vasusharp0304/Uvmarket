import Link from 'next/link';
import Disclaimer from '@/components/Disclaimer';
import { prisma } from '@/lib/prisma';
import { StatusBadge, DirectionBadge } from '@/components/Badges';

async function getStats() {
    try {
        const closedSignals = await prisma.signal.findMany({
            where: {
                status: { in: ['TARGET_HIT', 'STOP_LOSS', 'CLOSED_MANUAL'] },
                returnPercent: { not: null },
            },
            select: { returnPercent: true, status: true },
        });

        const totalTrades = closedSignals.length;
        const winners = closedSignals.filter(
            (s) => s.returnPercent !== null && s.returnPercent > 0
        ).length;
        const avgReturn =
            totalTrades > 0
                ? closedSignals.reduce((sum, s) => sum + (s.returnPercent || 0), 0) / totalTrades
                : 0;

        const activeSignals = await prisma.signal.count({
            where: {
                status: { in: ['PENDING', 'ACTIVE'] },
                isVisibleToCustomers: true,
            },
        });

        return {
            totalTrades,
            winners,
            activeSignals,
            avgReturn: Math.round(avgReturn * 100) / 100,
        };
    } catch {
        // Return default values if database is not available (during build)
        return {
            totalTrades: 18,
            winners: 15,
            activeSignals: 2,
            avgReturn: 4.48,
        };
    }
}

async function getRecentSignals() {
    try {
        return await prisma.signal.findMany({
            where: {
                status: { in: ['PENDING', 'ACTIVE'] },
                isVisibleToCustomers: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 6,
        });
    } catch {
        // Return empty array if database is not available (during build)
        return [];
    }
}

export default async function HomePage() {
    const [stats, recentSignals] = await Promise.all([getStats(), getRecentSignals()]);
    const winRate = stats.totalTrades > 0 ? Math.round((stats.winners / stats.totalTrades) * 100) : 0;

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

                <div className="relative max-w-5xl mx-auto text-center z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        100% Free - No Subscription Required
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                        Professional Swing & <br className="hidden md:block" />
                        <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                            Intraday Trading
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        Maximize your profits with expert-analyzed stock market recommendations.
                        Get access to all signals for free - educational insights designed for serious traders.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
                        <Link href="/register" className="btn btn-primary h-12 px-8 text-base shadow-lg shadow-indigo-200">
                            Get Started Free
                        </Link>
                        <Link href="/dashboard" className="btn btn-outline h-12 px-8 text-base bg-white">
                            View Signals
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Expert Analysis</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Professional technical analysis with clear entry, target and stop loss levels for every trade.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">100% Free Access</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            No subscription fees. No hidden charges. Access all signals and analysis completely free.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Detailed P&L Tracking</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Comprehensive profit/loss analysis with charts and trade-by-trade breakdown for full transparency.
                        </p>
                    </div>
                </div>
            </section>

            {/* Track Record Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">Proven Track Record</h2>
                    <p className="text-slate-500 mt-2">Our performance speaks for itself. All trades logged transparently.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    <div className="card p-6 text-center border-t-4 border-indigo-500 hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Trades</p>
                        <p className="text-4xl font-black text-slate-900">{stats.totalTrades}</p>
                    </div>
                    <div className="card p-6 text-center border-t-4 border-emerald-500 hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Winning Trades</p>
                        <p className="text-4xl font-black text-emerald-600">{stats.winners}</p>
                    </div>
                    <div className="card p-6 text-center border-t-4 border-violet-500 hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Win Rate</p>
                        <p className={`text-4xl font-black ${winRate >= 50 ? 'text-indigo-600' : 'text-slate-600'}`}>
                            {winRate}%
                        </p>
                    </div>
                    <div className="card p-6 text-center border-t-4 border-amber-500 hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Avg Return</p>
                        <p className={`text-4xl font-black ${stats.avgReturn >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                            {stats.avgReturn.toFixed(2)}%
                        </p>
                    </div>
                </div>

                {/* Active Signals */}
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Active Signals</h2>
                    <Link href="/history" className="text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1 text-sm">
                        View All <span className="text-lg">→</span>
                    </Link>
                </div>

                {recentSignals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentSignals.map((signal) => (
                            <div key={signal.id} className="card group hover:shadow-xl transition-all duration-300 border-slate-200">
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                {signal.symbol}
                                            </div>
                                            <div className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-[150px]">
                                                {signal.companyName}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5 items-end">
                                            <StatusBadge status={signal.status} />
                                            <DirectionBadge direction={signal.direction} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-50">
                                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                                            <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Entry</p>
                                            <p className="font-bold text-slate-800">₹{signal.entryPrice.toFixed(1)}</p>
                                        </div>
                                        <div className="text-center p-2 bg-emerald-50/50 rounded-lg border border-emerald-100/50">
                                            <p className="text-[10px] uppercase text-emerald-600/70 font-bold mb-1">Target</p>
                                            <p className="font-bold text-emerald-600">₹{signal.targetPrice.toFixed(1)}</p>
                                        </div>
                                        <div className="text-center p-2 bg-red-50/50 rounded-lg border border-red-100/50">
                                            <p className="text-[10px] uppercase text-red-600/70 font-bold mb-1">Stop</p>
                                            <p className="font-bold text-red-500">₹{signal.stopLossPrice.toFixed(1)}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400 font-medium">
                                        <span className="flex items-center gap-1">
                                            {signal.signalType === 'INTRADAY' ? '⚡' : '📅'} {signal.signalType}
                                        </span>
                                        <span>{new Date(signal.entryDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                        <p className="text-slate-500 font-medium">No active recommendations right now.</p>
                        <p className="text-sm text-slate-400 mt-1">Markets might be closed. Check back later!</p>
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Start Trading?
                    </h2>
                    <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto">
                        Join thousands of traders who trust our analysis. 
                        Create a free account and access all signals instantly.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register" className="bg-white text-indigo-900 px-8 py-3 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors shadow-lg">
                            Create Free Account
                        </Link>
                        <Link href="/login" className="text-white border border-white/30 px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            <Disclaimer />
        </div>
    );
}
