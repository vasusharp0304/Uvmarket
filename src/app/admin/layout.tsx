'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/Loading';
import {
    LayoutDashboard, TrendingUp, Users, CreditCard, Package, Settings,
    FileText, Shield, Activity, ChevronRight, HelpCircle
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push('/login');
            return;
        }
        if (session.user?.role !== 'ADMIN') {
            router.push('/dashboard');
        }
    }, [session, status, router]);

    if (status === 'loading') return <LoadingSpinner />;
    if (!session || session.user?.role !== 'ADMIN') return null;

    const links = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true, color: 'from-purple-500 to-indigo-600', bgActive: 'bg-purple-50', textActive: 'text-purple-700' },
        { href: '/admin/signals', label: 'Signals', icon: TrendingUp, color: 'from-green-500 to-emerald-600', bgActive: 'bg-green-50', textActive: 'text-green-700' },
        { href: '/admin/customers', label: 'Customers', icon: Users, color: 'from-blue-500 to-cyan-600', bgActive: 'bg-blue-50', textActive: 'text-blue-700' },
        { href: '/admin/payments', label: 'Payments', icon: CreditCard, color: 'from-amber-500 to-orange-600', bgActive: 'bg-amber-50', textActive: 'text-amber-700' },
        { href: '/admin/plans', label: 'Plans', icon: Package, color: 'from-pink-500 to-rose-600', bgActive: 'bg-pink-50', textActive: 'text-pink-700' },
        { href: '/admin/invoices', label: 'Invoices', icon: FileText, color: 'from-teal-500 to-cyan-600', bgActive: 'bg-teal-50', textActive: 'text-teal-700' },
        { href: '/admin/settings', label: 'Settings', icon: Settings, color: 'from-gray-600 to-gray-800', bgActive: 'bg-gray-100', textActive: 'text-gray-700' },
        { href: '/admin/profile', label: 'Profile', icon: Shield, color: 'from-red-500 to-purple-600', bgActive: 'bg-red-50', textActive: 'text-red-700' },
    ];

    return (
        <div style={{ display: 'flex', width: '100%', minHeight: 'calc(100vh - 64px)' }}>
            {/* Sidebar */}
            <div className="hidden md:flex flex-col" style={{
                width: '280px',
                minWidth: '280px',
                maxWidth: '280px',
                minHeight: 'calc(100vh - 64px)',
                background: 'linear-gradient(180deg, #ffffff 0%, #faf8ff 50%, #f5f3ff 100%)',
                borderRight: '1px solid #e5e7eb',
                flexShrink: 0,
            }}>
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 flex-shrink-0">
                            <Shield size={24} className="text-white" />
                        </div>
                        <div>
                            <span className="font-extrabold text-lg text-gray-800 block leading-tight">Admin Panel</span>
                            <span className="text-xs text-red-500 font-bold uppercase tracking-widest">Control Center</span>
                        </div>
                    </div>
                    {session?.user?.name && (
                        <div className="mt-4 p-3 bg-gradient-to-r from-red-50 to-purple-50 rounded-xl border border-red-100/50">
                            <p className="text-xs text-gray-500 font-medium">Logged in as</p>
                            <p className="text-sm font-bold text-gray-800 truncate">{session.user.name}</p>
                        </div>
                    )}
                </div>

                {/* Section Label */}
                <div className="px-6 pt-6 pb-2">
                    <span className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">Management</span>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                    {links.map((link) => {
                        const isActive = link.exact
                            ? pathname === link.href
                            : pathname.startsWith(link.href) && link.href !== '/admin';
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`group relative flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-semibold transition-all duration-200 ${isActive
                                    ? `${link.bgActive} ${link.textActive} shadow-sm border border-gray-200/50`
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                {isActive && (
                                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-8 bg-gradient-to-b ${link.color} rounded-r-full`} />
                                )}
                                <div className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${isActive
                                    ? `bg-gradient-to-br ${link.color} text-white shadow-md`
                                    : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                                    }`}>
                                    <Icon size={20} />
                                </div>
                                <span className="text-[15px]">{link.label}</span>
                                {isActive && (
                                    <ChevronRight size={16} className="ml-auto opacity-50" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom */}
                <div className="p-4 space-y-3 mt-auto">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-xl -mr-6 -mt-6" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity size={16} className="text-red-300" />
                                <span className="text-sm font-bold">System Status</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs text-white/60 font-medium">All services operational</span>
                            </div>
                        </div>
                    </div>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all text-sm font-medium">
                        <HelpCircle size={18} />
                        Help & Support
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, minWidth: 0, overflow: 'auto', background: 'linear-gradient(135deg, #f8f6ff 0%, #f0f1ff 50%, #f5f0ff 100%)' }}>
                <div className="p-6 lg:p-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
