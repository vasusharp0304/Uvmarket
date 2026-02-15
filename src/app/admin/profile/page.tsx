'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Camera, Mail, Phone, Shield, User, Lock, Key, Activity } from 'lucide-react';
import { LoadingSpinner } from '@/components/Loading';

interface UserProfile {
    name: string;
    email: string;
    phone: string | null;
    photoUrl: string | null;
    role: string;
    createdAt: string;
}

export default function AdminProfilePage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            const data = await res.json();
            if (data.user) setProfile(data.user);
        } catch (err) {
            console.error('Failed to load profile', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert('File too large. Maximum 2MB.');
            return;
        }

        setUploading(true);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = reader.result as string;

                const res = await fetch('/api/user/profile', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ photoUrl: base64 })
                });

                if (res.ok) {
                    const data = await res.json();
                    setProfile(prev => prev ? ({ ...prev, photoUrl: base64 }) : null);
                    await update({ photoUrl: base64 });
                }
            };
        } catch (err) {
            console.error(err);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <Shield className="text-red-600" size={32} />
                    Admin Profile
                </h1>
                <p className="text-gray-500 mt-1">Manage your administrator account details</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden relative">
                {/* Header / Banner - Admin Style (Red/Purple) */}
                <div className="h-40 bg-gradient-to-r from-red-600 to-purple-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 opacity-30 transform -rotate-12 scale-150"></div>
                    <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <div className="px-8 pb-8">
                    <div className="relative -mt-20 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-end gap-6">
                            <div className="relative group">
                                <div className="w-40 h-40 rounded-full border-[6px] border-white bg-gray-50 shadow-xl overflow-hidden flex items-center justify-center relative z-10">
                                    {profile?.photoUrl ? (
                                        <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={64} className="text-gray-300" />
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                                            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-2 right-2 p-3 bg-white text-gray-700 rounded-full shadow-lg cursor-pointer hover:bg-red-50 hover:text-red-600 transition-all border border-gray-100 z-20 group-hover:scale-110">
                                    <Camera size={20} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                                </label>
                            </div>

                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
                                <p className="text-gray-500 font-medium flex items-center gap-2">
                                    <Mail size={14} /> {profile?.email}
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm border bg-red-50 text-red-700 border-red-100 flex items-center gap-2">
                                <Shield size={16} className="text-red-600 fill-current" />
                                Administrator
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-lg font-bold text-gray-800 pb-2 border-b border-gray-100">
                                <User size={20} className="text-red-600" />
                                Personal Details
                            </div>

                            <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 hover:border-red-100 transition-colors">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Full Name</label>
                                <div className="font-semibold text-gray-800 text-lg">{profile?.name || 'N/A'}</div>
                            </div>

                            <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 hover:border-red-100 transition-colors">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Email Address</label>
                                <div className="font-medium text-gray-700 flex items-center gap-2">
                                    <Mail size={16} className="text-gray-400" /> {profile?.email || 'N/A'}
                                </div>
                            </div>

                            <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 hover:border-red-100 transition-colors">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Phone Number</label>
                                <div className="font-medium text-gray-700 flex items-center gap-2">
                                    <Phone size={16} className="text-gray-400" /> {profile?.phone || 'Not provided'}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-lg font-bold text-gray-800 pb-2 border-b border-gray-100">
                                <Lock size={20} className="text-red-600" />
                                System Access
                            </div>

                            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 border border-red-100">
                                <label className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1 block">Access Level</label>
                                <div className="flex items-center gap-2">
                                    <Shield size={20} className="text-red-600" />
                                    <span className="font-bold text-red-900 uppercase text-lg">Full Admin Access</span>
                                </div>
                                <p className="text-xs text-red-700 mt-2 opacity-80">
                                    You have permission to manage signals, customers, payments, and system settings.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Account Created</label>
                                <div className="font-medium text-gray-700">
                                    {profile?.createdAt
                                        ? new Date(profile.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })
                                        : 'N/A'}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Security Status</label>
                                    <div className="font-medium text-green-600 flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        Active
                                    </div>
                                </div>
                                <Activity className="text-gray-300" size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
