'use client';

import { Stats } from '@/types/dashboard';
import { Award, Zap, TrendingUp, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatsRow({ stats }: { stats: Stats }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100/80 flex items-center gap-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-bl-full" />
                <div className="p-3.5 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-xl shadow-sm">
                    <Zap size={22} />
                </div>
                <div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Trades</div>
                    <div className="text-3xl font-extrabold text-gray-800 mt-1 tracking-tight">{stats.totalTrades}</div>
                </div>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100/80 flex items-center gap-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-100/40 to-transparent rounded-bl-full" />
                <div className="p-3.5 bg-gradient-to-br from-green-50 to-green-100 text-green-600 rounded-xl shadow-sm">
                    <Award size={22} />
                </div>
                <div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Winners</div>
                    <div className="text-3xl font-extrabold text-gray-800 mt-1 tracking-tight">{stats.winners}</div>
                </div>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100/80 flex items-center gap-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-100/40 to-transparent rounded-bl-full" />
                <div className="p-3.5 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 rounded-xl shadow-sm">
                    <TrendingUp size={22} />
                </div>
                <div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Win Rate</div>
                    <div className="text-3xl font-extrabold text-gray-800 mt-1 tracking-tight">{stats.winRate}%</div>
                </div>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100/80 flex items-center gap-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-100/40 to-transparent rounded-bl-full" />
                <div className="p-3.5 bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 rounded-xl shadow-sm">
                    <Percent size={22} />
                </div>
                <div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Avg Return</div>
                    <div className={`text-3xl font-extrabold mt-1 tracking-tight flex items-center gap-1 ${stats.avgReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.avgReturn >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                        {stats.avgReturn.toFixed(2)}%
                    </div>
                </div>
            </div>
        </div>
    );
}
