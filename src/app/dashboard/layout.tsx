'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/Loading';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push('/login');
            return;
        }
        if (session.user?.role === 'ADMIN') {
            router.push('/admin');
            return;
        }
        // Use setTimeout to avoid setState in render
        const timer = setTimeout(() => setReady(true), 0);
        return () => clearTimeout(timer);
    }, [session, status, router]);

    if (status === 'loading' || !ready) return <LoadingSpinner />;

    return (
        <div className="flex min-h-[calc(100vh-64px)] w-full bg-slate-50">
            <DashboardSidebar />
            <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-8 relative">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
