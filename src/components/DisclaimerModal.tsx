'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, BookOpen, Scale, TrendingDown, UserCheck } from 'lucide-react';

export default function DisclaimerModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check local storage on mount
        const hasAccepted = localStorage.getItem('disclaimer_accepted');
        if (!hasAccepted) {
            // Use setTimeout to avoid setState in effect warning
            setTimeout(() => {
                setIsOpen(true);
                document.body.style.overflow = 'hidden';
            }, 0);
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleAccept = () => {
        localStorage.setItem('disclaimer_accepted', 'true');
        setIsOpen(false);
        document.body.style.overflow = 'auto';
    };

    if (!mounted || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300"
                style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)' }}
            >

                {/* Header - Bigger */}
                <div className="relative overflow-hidden p-8 border-b border-red-100"
                    style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fff1f2 50%, #fef2f2 100%)' }}
                >
                    {/* Decorative shapes */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-red-200/30 to-transparent rounded-bl-full" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-orange-200/20 to-transparent rounded-tr-full" />

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-4 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl shadow-lg shadow-red-500/25 flex-shrink-0">
                            <AlertTriangle size={28} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-red-800 uppercase tracking-wide">
                                Important Risk Disclosure
                            </h2>
                            <p className="text-sm text-red-600/80 font-medium mt-1">Please read carefully before proceeding</p>
                        </div>
                    </div>
                </div>

                {/* Content - Bigger text */}
                <div className="p-8 overflow-y-auto space-y-6 text-gray-700 leading-relaxed">
                    <p className="font-bold text-lg text-gray-800">
                        By accessing this application, you acknowledge and agree to the following terms:
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        {/* Item 1 */}
                        <div className="flex gap-4 p-5 bg-red-50/50 rounded-2xl border border-red-100/50">
                            <div className="p-2.5 bg-red-100 rounded-xl flex-shrink-0 h-fit">
                                <BookOpen size={18} className="text-red-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-base text-gray-800 mb-1">Educational Purpose Only</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    All content, signals, and analysis provided by UV Market School are strictly for educational and informational purposes. Keep in mind that we are not SEBI registered.
                                </p>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="flex gap-4 p-5 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                            <div className="p-2.5 bg-orange-100 rounded-xl flex-shrink-0 h-fit">
                                <Shield size={18} className="text-orange-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-base text-gray-800 mb-1">Not Financial Advice</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Nothing on this platform constitutes financial, investment, or trading advice. We do not recommend buying or selling any specific securities.
                                </p>
                            </div>
                        </div>

                        {/* Item 3 */}
                        <div className="flex gap-4 p-5 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                            <div className="p-2.5 bg-amber-100 rounded-xl flex-shrink-0 h-fit">
                                <TrendingDown size={18} className="text-amber-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-base text-gray-800 mb-1">High Risk Warning</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Trading in financial markets (Stocks, Options, Futures, Crypto, Forex) involves a substantial risk of loss and is not suitable for every investor. You could lose some or all of your initial investment.
                                </p>
                            </div>
                        </div>

                        {/* Item 4 */}
                        <div className="flex gap-4 p-5 bg-gray-50/80 rounded-2xl border border-gray-100">
                            <div className="p-2.5 bg-gray-100 rounded-xl flex-shrink-0 h-fit">
                                <Scale size={18} className="text-gray-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-base text-gray-800 mb-1">No Guarantees</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Past performance is not indicative of future results. There are no guarantees of profit or avoidance of loss.
                                </p>
                            </div>
                        </div>

                        {/* Item 5 */}
                        <div className="flex gap-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                            <div className="p-2.5 bg-blue-100 rounded-xl flex-shrink-0 h-fit">
                                <UserCheck size={18} className="text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-base text-gray-800 mb-1">Independent Decision</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    You are solely responsible for your own investment decisions. We strongly recommend consulting with a qualified financial advisor before making any financial decisions.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-500 leading-relaxed">
                        UV Market School and its owners, employees, or contributors shall not be held liable for any losses or damages resulting from the use of information provided on this platform.
                    </div>
                </div>

                {/* Footer - Bigger */}
                <div className="p-8 border-t border-gray-100 bg-gray-50/80 flex flex-col gap-5">
                    <label className="flex items-center gap-4 cursor-pointer select-none group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-gray-300 shadow-sm checked:bg-red-600 checked:border-red-600 transition-all"
                                checked={accepted}
                                onChange={(e) => setAccepted(e.target.checked)}
                            />
                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity" viewBox="0 0 14 14" fill="none">
                                <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-base font-semibold text-gray-700 group-hover:text-gray-900">
                            I have read, understood, and accept the Risk Disclosure.
                        </span>
                    </label>

                    <button
                        onClick={handleAccept}
                        disabled={!accepted}
                        className={`
                            w-full py-4 px-8 rounded-xl font-bold text-lg text-white transition-all transform
                            ${accepted
                                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer'
                                : 'bg-gray-300 cursor-not-allowed'
                            }
                        `}
                    >
                        {accepted ? 'Proceed to Application →' : 'Accept to Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
}
