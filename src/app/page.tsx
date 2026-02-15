import Link from 'next/link';
import Disclaimer from '@/components/Disclaimer';
import { prisma } from '@/lib/prisma';
import { StatusBadge, DirectionBadge } from '@/components/Badges';

async function getStats() {
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

  return {
    totalTrades,
    winners,
    avgReturn: Math.round(avgReturn * 100) / 100,
  };
}

async function getRecentSignals() {
  return prisma.signal.findMany({
    where: {
      status: { in: ['PENDING', 'ACTIVE'] },
      isVisibleToCustomers: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
}

export default async function HomePage() {
  const [stats, recentSignals] = await Promise.all([getStats(), getRecentSignals()]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            Live Market Signals
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Professional Swing & <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Intraday Trading
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Maximize your profits with expert-analyzed stock market recommendations.
            Educational insights designed for serious traders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
            <Link href="/register" className="btn btn-primary h-12 px-8 text-base shadow-lg shadow-indigo-200">
              Get Started Now
            </Link>
            <Link href="/pricing" className="btn btn-outline h-12 px-8 text-base bg-white">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Track Record Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Proven Track Record</h2>
          <p className="text-slate-500 mt-2">Our performance speaks for itself.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="card p-6 text-center border-t-4 border-indigo-500 hover:-translate-y-1 transition-transform">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Trades</p>
            <p className="text-4xl font-black text-slate-900">{stats.totalTrades}</p>
          </div>
          <div className="card p-6 text-center border-t-4 border-emerald-500 hover:-translate-y-1 transition-transform">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Winning Trades</p>
            <p className="text-4xl font-black text-emerald-600">{stats.winners}</p>
          </div>
          <div className="card p-6 text-center border-t-4 border-violet-500 hover:-translate-y-1 transition-transform">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Avg Return</p>
            <p className={`text-4xl font-black ${stats.avgReturn >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
              {stats.avgReturn.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Recent Recommendations */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Recent Signals</h2>
          <Link href="/history" className="text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1 text-sm">
            View All <span className="text-lg">→</span>
          </Link>
        </div>

        {recentSignals.length > 0 ? (
          <div className="grid-responsive">
            {recentSignals.map((signal) => (
              <div key={signal.id} className="card group hover:shadow-xl transition-all duration-300 border-slate-200">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {signal.symbol}
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-[120px]">
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
                      <p className="font-bold text-emerald-600 animate-pulse">₹{signal.targetPrice.toFixed(1)}</p>
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

      <Disclaimer />
    </div>
  );
}
