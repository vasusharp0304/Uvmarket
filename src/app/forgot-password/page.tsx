'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Check, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) setSent(true);
            else setError(data.error || 'Something went wrong');
        } catch {
            setError('Network error. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {!sent ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="inline-flex p-3 bg-purple-50 rounded-2xl mb-4">
                                    <Mail className="text-purple-600" size={28} />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-800">Forgot Password?</h1>
                                <p className="text-gray-500 mt-2 text-sm">
                                    Enter your email and we'll send you a reset link.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 border border-red-100">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="inline-flex p-4 bg-green-50 rounded-full mb-4">
                                <Check className="text-green-600" size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Check Your Email</h2>
                            <p className="text-gray-500 text-sm">
                                If an account exists with <strong>{email}</strong>, we've sent a password reset link.
                            </p>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link href="/login" className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center justify-center gap-1">
                            <ArrowLeft size={14} />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
