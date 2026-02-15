'use client';

import { Signal } from '@/types/dashboard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function CustomerPerformanceChart({ signals }: { signals: Signal[] }) {
    // Calculate cumulative PnL
    const data: { name: string; date: string; value: number }[] = [];
    let cumulative = 0;

    // Sort chronologically
    const sorted = [...signals].sort((a, b) => new Date(a.entryDateTime).getTime() - new Date(b.entryDateTime).getTime());

    // Group roughly by trade index for smoothness
    sorted.forEach((s, i) => {
        if (s.returnPercent !== null) {
            cumulative += s.returnPercent;
            data.push({
                name: `T${i + 1}`,
                date: new Date(s.entryDateTime).toLocaleDateString(),
                value: Math.round(cumulative * 100) / 100
            });
        }
    });

    if (data.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp className="text-green-600" size={20} />
                    Service Performance Growth
                </h3>
                <span className="text-xs text-gray-400 font-medium">Cumulative Return %</span>
            </div>
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" hide />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                            formatter={(value: unknown) => [`${value as number}%`, 'Total Return']}
                            labelFormatter={(label) => ''}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#16a34a"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorPnL)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
