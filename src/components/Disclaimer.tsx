import { AlertTriangle, Shield, BookOpen, Scale } from 'lucide-react';

export default function Disclaimer() {
    return (
        <div className="relative overflow-hidden rounded-2xl shadow-lg"
            style={{
                background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 40%, #fff7ed 100%)',
            }}
        >
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #92400e 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />
            {/* Top accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />

            <div className="p-8 lg:p-10 max-w-6xl mx-auto relative">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg shadow-amber-500/20 flex-shrink-0">
                        <AlertTriangle size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-extrabold text-amber-900 tracking-tight uppercase">
                            Important Risk Disclosure & Disclaimer
                        </h3>
                        <p className="text-sm text-amber-700/70 mt-1 font-medium">
                            Please read this carefully before proceeding
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 border border-amber-200/50">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen size={16} className="text-amber-600" />
                            <span className="text-sm font-bold text-amber-800">Educational Only</span>
                        </div>
                        <p className="text-sm text-amber-800/70 leading-relaxed">
                            All content, signals, and analysis provided by UV Market School are strictly for <strong>educational and informational purposes</strong>. We are not SEBI registered advisors.
                        </p>
                    </div>

                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 border border-amber-200/50">
                        <div className="flex items-center gap-2 mb-3">
                            <Shield size={16} className="text-orange-600" />
                            <span className="text-sm font-bold text-amber-800">Not Financial Advice</span>
                        </div>
                        <p className="text-sm text-amber-800/70 leading-relaxed">
                            Nothing on this platform constitutes financial, investment, or trading advice. <strong>Consult a qualified financial advisor</strong> before making any investment decisions.
                        </p>
                    </div>

                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 border border-amber-200/50">
                        <div className="flex items-center gap-2 mb-3">
                            <Scale size={16} className="text-red-600" />
                            <span className="text-sm font-bold text-amber-800">High Risk Warning</span>
                        </div>
                        <p className="text-sm text-amber-800/70 leading-relaxed">
                            Trading involves <strong>substantial risk of loss</strong>. Past performance does not indicate future results. Investments are subject to market risks.
                        </p>
                    </div>
                </div>

                {/* Bottom notice */}
                <div className="mt-6 pt-5 border-t border-amber-300/30">
                    <p className="text-xs text-amber-700/50 text-center leading-relaxed max-w-3xl mx-auto">
                        UV Market School and its owners, employees, or contributors shall not be held liable for any losses or damages resulting from the use of information provided on this platform. You are solely responsible for your own investment decisions.
                    </p>
                </div>
            </div>
        </div>
    );
}
