'use client';

import { Signal } from '@/types/dashboard';
import { ArrowRight, TrendingUp, TrendingDown, Target, Shield, Clock, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

interface SignalCardProps {
    signal: Signal;
    onClick: (signal: Signal) => void;
}

export default function SignalCard({ signal, onClick }: SignalCardProps) {
    const isBuy = signal.direction === 'BUY';

    return (
        <div
            onClick={() => onClick(signal)}
            className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer overflow-hidden"
        >
            {/* Gradient accent top */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${isBuy ? 'bg-gradient-to-r from-green-400 to-emerald-600' : 'bg-gradient-to-r from-red-400 to-rose-600'}`} />

            {/* Decorative corner */}
            <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-50 ${isBuy ? 'bg-gradient-to-bl from-green-50 to-transparent' : 'bg-gradient-to-bl from-red-50 to-transparent'}`} />

            {/* Header */}
            <div className="flex justify-between items-start mb-5">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h3 className="font-extrabold text-xl text-gray-800">{signal.symbol}</h3>
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${signal.signalType === 'INTRADAY' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                            {signal.signalType}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium truncate max-w-[180px] mt-0.5">{signal.companyName}</p>
                </div>
                <div className={`flex flex-col items-end`}>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${isBuy ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {isBuy ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        {signal.direction}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(signal.entryDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {new Date(signal.entryDateTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        <span className="ml-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded flex items-center gap-0.5" title="Chart Attached">
                            <Sparkles size={8} />
                            <span className="text-[9px] font-bold">CHART</span>
                        </span>
                    </span>
                </div>
            </div>

            {/* Price Info Grid */}
            <div className="grid grid-cols-3 gap-3 mb-5 bg-gray-50/80 rounded-xl p-4 border border-gray-100/80">
                <div className="text-center">
                    <div className="text-[10px] text-gray-400 uppercase font-bold mb-1.5">Entry</div>
                    <div className="font-extrabold text-gray-800 text-lg">₹{signal.entryPrice}</div>
                </div>
                <div className="text-center relative">
                    <div className="text-[10px] text-gray-400 uppercase font-bold mb-1.5 flex items-center justify-center gap-1">
                        <Target size={10} className="text-green-500" /> Tgt
                    </div>
                    <div className="font-extrabold text-green-600 text-lg">₹{signal.targetPrice}</div>
                    <ArrowRight className="absolute -right-3 top-1/2 -translate-y-1/2 text-gray-300" size={12} />
                </div>
                <div className="text-center">
                    <div className="text-[10px] text-gray-400 uppercase font-bold mb-1.5 flex items-center justify-center gap-1">
                        <Shield size={10} className="text-red-500" /> SL
                    </div>
                    <div className="font-extrabold text-red-600 text-lg">₹{signal.stopLossPrice}</div>
                </div>
            </div>

            {/* Footer Status */}
            <div className="flex items-center justify-between">
                <div className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${signal.status === 'TARGET_HIT' ? 'bg-green-100 text-green-800' :
                    signal.status === 'STOP_LOSS' ? 'bg-red-100 text-red-800' :
                        signal.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-600'
                    }`}>
                    {signal.status === 'TARGET_HIT' && <CheckCircle size={13} />}
                    {signal.status === 'STOP_LOSS' && <AlertCircle size={13} />}
                    {signal.status === 'ACTIVE' && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                    {signal.status.replace('_', ' ')}
                </div>

                {signal.returnPercent !== null && (
                    <div className={`text-base font-extrabold ${signal.returnPercent > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {signal.returnPercent > 0 ? '+' : ''}{signal.returnPercent.toFixed(2)}%
                    </div>
                )}
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: `inset 0 0 0 1px ${isBuy ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }}
            />
        </div>
    );
}
