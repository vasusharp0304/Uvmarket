'use client';

import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { Activity, DollarSign, TrendingUp, Sparkles } from 'lucide-react';

interface ChartData {
    revenue: { name: string; value: number }[];
    performance: { name: string; value: number }[];
}

export default function AdminCharts({ data }: { data: ChartData }) {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">
            {/* Revenue Chart */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100/80 relative overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100/30 to-transparent rounded-bl-full pointer-events-none" />

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2.5">
                            <div className="p-2 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm">
                                <DollarSign className="w-5 h-5 text-purple-600" />
                            </div>
                            Revenue Growth
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 ml-[42px]">Monthly revenue for last 6 months</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-4 py-1.5 rounded-full text-xs font-bold text-purple-700 flex items-center gap-1">
                        <Sparkles size={10} />
                        +12.5% vs last mo
                    </div>
                </div>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.revenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 13 }}
                                tickFormatter={(value) => `₹${value / 1000}k`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '12px 16px' }}
                                itemStyle={{ color: '#6d28d9', fontWeight: 700 }}
                                formatter={(value: unknown) => [`₹${(value as number).toLocaleString()}`, 'Revenue']}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#7c3aed"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100/80 relative overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-100/30 to-transparent rounded-bl-full pointer-events-none" />

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2.5">
                            <div className="p-2 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm">
                                <Activity className="w-5 h-5 text-green-600" />
                            </div>
                            Performance (PnL)
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 ml-[42px]">Cumulative return % per month</p>
                    </div>
                </div>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.performance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 13 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '12px 16px' }}
                                formatter={(value: unknown) => [`${value as number}%`, 'Return']}
                            />
                            <ReferenceLine y={0} stroke="#e2e8f0" />
                            <Bar
                                dataKey="value"
                                fill="#22c55e"
                                radius={[6, 6, 0, 0]}
                                barSize={45}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
