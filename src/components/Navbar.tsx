'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import NotificationBell from '@/components/NotificationBell';
import { History, LayoutDashboard, LogOut, Menu, X, Calculator, Gift, Package, TrendingUp, BarChart3 } from 'lucide-react';

export default function Navbar() {
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const isAdmin = session?.user?.role === 'ADMIN';

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [mobileOpen, mounted]);

    if (!mounted) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                        <div className="relative w-8 h-8">
                            <Image src="/logo.svg" alt="Logo" fill className="object-contain" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            UV Market School
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {session ? (
                            <>
                                <div className="flex items-center gap-1">
                                    {isAdmin ? (
                                        <>
                                            <NavLink href="/admin" icon={LayoutDashboard} label="Admin" />
                                            <NavLink href="/admin/customers" label="Customers" />
                                            <NavLink href="/admin/signals" label="Signals" />
                                        </>
                                    ) : (
                                        <>
                                            <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                                            <NavLink href="/history" icon={BarChart3} label="History" />
                                            <NavLink href="/calculator" icon={Calculator} label="Calculator" />
                                        </>
                                    )}
                                </div>
                                <div className="h-6 w-px bg-slate-200 mx-2" />
                                <div className="flex items-center gap-4">
                                    <NotificationBell />
                                    <div className="flex items-center gap-3">
                                        <div className="text-right hidden lg:block">
                                            <p className="text-sm font-semibold text-slate-800">{session.user?.name}</p>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                                                {isAdmin ? 'Administrator' : 'Trader'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => signOut({ callbackUrl: '/' })}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Sign Out"
                                        >
                                            <LogOut size={20} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                                    Log in
                                </Link>
                                <Link href="/register" className="btn btn-primary">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 top-16 z-40 bg-white overflow-y-auto md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="p-4 space-y-4">
                        {session ? (
                            <>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl mb-4">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                                        {session.user?.name?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{session.user?.name}</p>
                                        <p className="text-xs text-slate-500">{session.user?.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    {isAdmin ? (
                                        <>
                                            <MobileNavLink href="/admin" icon={LayoutDashboard} label="Admin Dashboard" onClick={() => setMobileOpen(false)} />
                                            <MobileNavLink href="/admin/customers" icon={Package} label="Customers" onClick={() => setMobileOpen(false)} />
                                            <MobileNavLink href="/admin/signals" icon={TrendingUp} label="Signals" onClick={() => setMobileOpen(false)} />
                                        </>
                                    ) : (
                                        <>
                                            <MobileNavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setMobileOpen(false)} />
                                            <MobileNavLink href="/history" icon={History} label="History" onClick={() => setMobileOpen(false)} />
                                            <MobileNavLink href="/calculator" icon={Calculator} label="Calculator" onClick={() => setMobileOpen(false)} />
                                        </>
                                    )}
                                </div>
                                <div className="border-t border-slate-100 pt-4 mt-4">
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="flex items-center gap-3 w-full p-3 text-red-600 bg-red-50 rounded-lg font-medium"
                                    >
                                        <LogOut size={20} />
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-3">
                                <Link href="/login" className="flex items-center justify-center w-full p-3 text-slate-700 font-medium border border-slate-200 rounded-lg" onClick={() => setMobileOpen(false)}>
                                    Log in
                                </Link>
                                <Link href="/register" className="flex items-center justify-center w-full p-3 text-white bg-indigo-600 font-bold rounded-lg shadow-lg shadow-indigo-200" onClick={() => setMobileOpen(false)}>
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

interface NavLinkProps {
    href: string;
    icon?: React.ComponentType<{ size?: number }>;
    label: string;
}

function NavLink({ href, icon: Icon, label }: NavLinkProps) {
    return (
        <Link href={href} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all">
            {Icon && <Icon size={16} />}
            {label}
        </Link>
    );
}

interface MobileNavLinkProps {
    href: string;
    icon: React.ComponentType<{ size?: number }>;
    label: string;
    onClick: () => void;
}

function MobileNavLink({ href, icon: Icon, label, onClick }: MobileNavLinkProps) {
    return (
        <Link href={href} onClick={onClick} className="flex items-center gap-3 w-full p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-indigo-500 shadow-sm">
                <Icon size={18} />
            </div>
            <span className="font-medium">{label}</span>
        </Link>
    );
}
