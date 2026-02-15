'use client';

import { Signal } from '@/types/dashboard';
import { X, Target, Shield, Clock, TrendingUp, TrendingDown, ArrowRight, Download } from 'lucide-react';
import { StatusBadge, DirectionBadge } from '@/components/Badges';

interface Props {
    signal: Signal;
    onClose: () => void;
}

export default function SignalDetailModal({ signal, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-start shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-bold text-gray-800">{signal.symbol}</h2>
                            <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs font-bold uppercase">
                                {signal.segment}
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium">{signal.companyName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Key Stats Row */}
                    <div className="flex items-center gap-4 justify-between bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2">
                            {signal.direction === 'BUY'
                                ? <TrendingUp className="text-green-600" />
                                : <TrendingDown className="text-red-600" />
                            }
                            <span className={`font-bold text-lg ${signal.direction === 'BUY' ? 'text-green-700' : 'text-red-700'}`}>
                                {signal.direction}
                            </span>
                        </div>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-gray-400 uppercase font-semibold">Type</span>
                            <span className="font-medium text-gray-700">{signal.signalType}</span>
                        </div>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-400 uppercase font-semibold">Status</span>
                            <StatusBadge status={signal.status} />
                        </div>
                    </div>

                    {/* Price Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-blue-50/30 rounded-xl border border-blue-100">
                            <div className="text-xs text-blue-400 uppercase font-bold mb-1">Entry</div>
                            <div className="text-lg font-bold text-gray-800">₹{signal.entryPrice}</div>
                        </div>
                        <div className="text-center p-3 bg-green-50/30 rounded-xl border border-green-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-1">
                                <Target size={12} className="text-green-400/50" />
                            </div>
                            <div className="text-xs text-green-500 uppercase font-bold mb-1">Target</div>
                            <div className="text-lg font-bold text-green-700">₹{signal.targetPrice}</div>
                        </div>
                        <div className="text-center p-3 bg-red-50/30 rounded-xl border border-red-100">
                            <div className="text-xs text-red-400 uppercase font-bold mb-1">Stop Loss</div>
                            <div className="text-lg font-bold text-red-700">₹{signal.stopLossPrice}</div>
                        </div>
                    </div>

                    {/* Outcome (if closed) */}
                    {signal.exitPrice && (
                        <div className={`p-4 rounded-xl border flex justify-between items-center ${signal.returnPercent && signal.returnPercent > 0
                            ? 'bg-green-50 border-green-100'
                            : 'bg-red-50 border-red-100'
                            }`}>
                            <div>
                                <span className="text-xs uppercase font-bold text-gray-500 block mb-1">Exit Price</span>
                                <span className="text-lg font-bold text-gray-800">₹{signal.exitPrice}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs uppercase font-bold text-gray-500 block mb-1">Return</span>
                                <span className={`text-2xl font-bold ${signal.returnPercent && signal.returnPercent > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {signal.returnPercent && signal.returnPercent > 0 ? '+' : ''}
                                    {signal.returnPercent?.toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {signal.notes && (
                        <div>
                            <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                                Analysis & Notes
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                                {signal.notes}
                            </p>
                        </div>
                    )}

                    {/* Screenshots / Attachments */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                            Chart & Analysis
                        </h4>
                        <div className="grid gap-4">
                            {signal.screenshots && signal.screenshots.length > 0 ? (
                                signal.screenshots.map(shot => (
                                    <div key={shot.id} className="relative group rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                        <img
                                            src={shot.imageUrl}
                                            alt="Signal Chart"
                                            className="w-full h-auto object-contain max-h-[300px]"
                                        />
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a
                                                href={shot.imageUrl}
                                                download={`signal-${signal.symbol}.png`}
                                                className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm hover:shadow-md text-gray-700 hover:text-purple-600 transition-all inline-flex items-center justify-center"
                                                title="Download Chart"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Download size={18} />
                                            </a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="relative group rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                    <img
                                        src="/sample-chart.svg"
                                        alt="Sample Chart"
                                        className="w-full h-auto object-contain max-h-[300px]"
                                    />
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            href="/sample-chart.svg"
                                            download={`signal-${signal.symbol}-sample.svg`}
                                            className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm hover:shadow-md text-gray-700 hover:text-purple-600 transition-all inline-flex items-center justify-center"
                                            title="Download Chart"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Download size={18} />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Date */}
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                            <Clock size={12} />
                            Issued: {new Date(signal.entryDateTime).toLocaleString('en-IN')}
                        </div>
                        {signal.exitDateTime && (
                            <div>Closed: {new Date(signal.exitDateTime).toLocaleString('en-IN')}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
