'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    LayoutDashboard, History, Calculator,
    TrendingUp, BarChart3, HelpCircle, ChevronRight, ChevronLeft, UsersRound
} from 'lucide-react';
import { useState } from 'react';

export default function DashboardSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isCollapsed, setIsCollapsed] = useState(true);

    const links = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true, color: 'from-purple-500 to-indigo-600', bgActive: 'bg-purple-50', textActive: 'text-purple-700' },
        { href: '/history', label: 'History', icon: History, color: 'from-blue-500 to-cyan-600', bgActive: 'bg-blue-50', textActive: 'text-blue-700' },
        { href: '/calculator', label: 'Calculator', icon: Calculator, color: 'from-green-500 to-emerald-600', bgActive: 'bg-green-50', textActive: 'text-green-700' },
        { href: '/dashboard/profile', label: 'Profile', icon: UsersRound, color: 'from-gray-500 to-slate-600', bgActive: 'bg-gray-50', textActive: 'text-gray-700' },
    ];

    return (
        <aside
            className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 relative z-20 ${isCollapsed ? 'w-20' : 'w-72'
                }`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-6 z-30 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Header */}
            <div className={`h-16 flex items-center border-b border-slate-100 ${isCollapsed ? 'justify-center' : 'px-6'}`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-200 flex-shrink-0">
                        <TrendingUp size={18} className="text-white" />
                    </div>
                    <div className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                        <span className="font-bold text-slate-800 leading-none block">Trading Hub</span>
                        <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Pro Suite</span>
                    </div>
                </div>
            </div>

            {/* User Info */}
            {!isCollapsed && session?.user?.name && (
                <div className="px-6 py-6 animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-500 font-medium">Welcome back,</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{session.user.name}</p>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                {!isCollapsed && (
                    <div className="px-3 mb-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Menu</span>
                    </div>
                )}

                {links.map((link) => {
                    const isActive = link.exact
                        ? pathname === link.href
                        : pathname.startsWith(link.href);
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${isActive
                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? link.label : ''}
                        >
                            <Icon size={20} className={`flex-shrink-0 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} />

                            {!isCollapsed && (
                                <span>{link.label}</span>
                            )}

                            {!isCollapsed && isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
                            )}

                            {/* Active Indicator for Collapsed */}
                            {isCollapsed && isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Section */}
            <div className="p-4 border-t border-slate-100 mt-auto">
                {!isCollapsed ? (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-300">Market Status</span>
                            <div className="flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-[10px] font-bold text-green-400">OPEN</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <HelpCircle size={20} className="text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors" />
                    </div>
                )}
            </div>
        </aside>
    );
}
