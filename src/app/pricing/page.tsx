'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Script from 'next/script';
import Disclaimer from '@/components/Disclaimer';
import { Check, Crown, Zap, Shield, TrendingUp } from 'lucide-react';

const PLANS = [
    {
        id: 'monthly',
        name: 'Starter',
        price: '999',
        period: '/month',
        features: [
            'Access to all trading signals',
            'Real-time notifications',
            'Full history tracking',
            'Entry & Exit levels',
        ],
        featured: false,
        icon: Zap,
        color: 'from-blue-500 to-cyan-500',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        button: 'hover:bg-blue-600 bg-blue-500'
    },
    {
        id: 'quarterly',
        name: 'Pro Trader',
        price: '2,499',
        period: '/3 months',
        features: [
            'Everything in Starter',
            'Save ₹498 vs monthly',
            'Priority support',
            'Detailed market analysis',
            'Exclusive webinars'
        ],
        featured: true,
        icon: TrendingUp,
        color: 'from-purple-500 to-indigo-600',
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        button: 'hover:bg-indigo-700 bg-indigo-600'
    },
    {
        id: 'yearly',
        name: 'Elite',
        price: '8,999',
        period: '/year',
        features: [
            'All Pro features',
            'Save ₹2,989 vs monthly',
            '1-on-1 Mentorship Session',
            'Institutional Insights',
            'Private Community Access'
        ],
        featured: false,
        icon: Crown,
        color: 'from-amber-400 to-orange-500',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        button: 'hover:bg-amber-600 bg-amber-500'
    },
];

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PricingPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handlePayment = async (planId: string) => {
        if (!session) {
            router.push('/login');
            return;
        }

        setLoading(planId);
        setError('');

        try {
            // Create order
            const res = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to create order');
                setLoading(null);
                return;
            }

            // Open Razorpay Checkout
            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: 'UV Market School',
                description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Subscription`,
                order_id: data.orderId,
                handler: async function (response: any) {
                    // Verify payment
                    const verifyRes = await fetch('/api/payment/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });

                    if (verifyRes.ok) {
                        await update({ subscriptionStatus: 'active' });
                        router.push('/dashboard');
                        router.refresh();
                    } else {
                        setError('Payment verification failed. Contact support.');
                    }
                },
                prefill: {
                    name: session.user?.name,
                    email: session.user?.email,
                },
                theme: {
                    color: '#7c3aed',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', function () {
                setError('Payment failed. Please try again.');
            });
            razorpay.open();
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            <div className="min-h-screen bg-slate-50 pb-20">
                {/* Hero Section */}
                <div className="relative bg-white overflow-hidden pb-16 pt-12 lg:pt-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <div className="mx-auto max-w-3xl">
                            <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4">
                                Premium Access
                            </span>
                            <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl md:text-6xl mb-6">
                                Master the Market with <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                    Professional Signals
                                </span>
                            </h1>
                            <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto">
                                Join thousands of successful traders who trust our precision analytics and real-time alerts. Stop guessing, start profiting.
                            </p>
                        </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden opacity-30 pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                    {error && (
                        <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-center font-medium max-w-2xl mx-auto shadow-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                        {PLANS.map((plan) => {
                            const Icon = plan.icon;
                            return (
                                <div
                                    key={plan.id}
                                    className={`relative flex flex-col rounded-2xl bg-white transition-all duration-300 ${plan.featured
                                            ? 'shadow-xl ring-2 ring-indigo-600 to-indigo-600 scale-105 z-10'
                                            : 'shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1'
                                        }`}
                                >
                                    {plan.featured && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="p-8 flex-1">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white shadow-lg mb-6`}>
                                            <Icon size={24} />
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                        <p className="flex items-baseline mb-6">
                                            <span className="text-4xl font-extrabold text-slate-900">₹{plan.price}</span>
                                            <span className="ml-1 text-slate-500 font-medium">{plan.period}</span>
                                        </p>

                                        <ul className="space-y-4 mb-8">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start">
                                                    <div className={`flex-shrink-0 w-5 h-5 rounded-full ${plan.bg} flex items-center justify-center mt-0.5 mr-3`}>
                                                        <Check size={12} className={plan.text} />
                                                    </div>
                                                    <span className="text-slate-600 text-sm font-medium">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="p-8 pt-0 mt-auto">
                                        <button
                                            className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${plan.button}`}
                                            onClick={() => handlePayment(plan.id)}
                                            disabled={loading === plan.id}
                                        >
                                            {loading === plan.id ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : (
                                                'Subscribe Now'
                                            )}
                                        </button>
                                        <p className="mt-4 text-xs text-center text-slate-400">
                                            Cancel anytime. Secure payment via Razorpay.
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                        <div>
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                <Shield size={24} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Secure Payments</h3>
                            <p className="text-sm text-slate-500">Bank-grade encryption for all transactions</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                <Zap size={24} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Instant Activation</h3>
                            <p className="text-sm text-slate-500">Start trading immediately after subscription</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                                <Crown size={24} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Premium Support</h3>
                            <p className="text-sm text-slate-500">Dedicated assistance for all subscribers</p>
                        </div>
                    </div>
                </div>

                <div className="mt-16">
                    <Disclaimer />
                </div>
            </div>
        </>
    );
}
