'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                // Handle both string errors and error objects safely
                const errorMessage = typeof result.error === 'string'
                    ? result.error
                    : typeof result.error === 'object' && result.error !== null && 'message' in result.error
                    ? (result.error as { message: string }).message || 'Login failed. Please try again.'
                    : 'Login failed. Please try again.';
                setError(errorMessage);
            } else {
                // Fetch session to determine redirect
                const res = await fetch('/api/auth/session');
                const session = await res.json();
                if (session?.user?.role === 'ADMIN') {
                    router.push('/admin');
                } else {
                    router.push('/dashboard');
                }
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-card">
                <h1 className="form-title">Welcome Back</h1>
                <p className="form-subtitle">Login to access your trading signals</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: '8px' }}>
                        <Link href="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-link">
                    Don&apos;t have an account?{' '}
                    <Link href="/register">Register here</Link>
                </div>
            </div>
        </div>
    );
}
