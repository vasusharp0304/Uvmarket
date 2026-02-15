'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/Loading';
import { Gift, Copy, Check, Users, Award, Share2 } from 'lucide-react';

interface ReferralData {
    referralCode: string;
    referralLink: string;
    totalReferrals: number;
    completedReferrals: number;
    referrals: {
        id: string;
        status: string;
        createdAt: string;
        referred: {
            name: string;
            email: string;
            createdAt: string;
        };
    }[];
}

export default function ReferralPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [data, setData] = useState<ReferralData | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (status === 'loading') return;
        if (!session) { router.push('/login'); return; }
        fetch('/api/referral')
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, [session, status, router]);

    if (status === 'loading' || loading) return <LoadingSpinner />;
    if (!data) return <div className="p-8 text-center text-red-500">Failed to load referral data</div>;

    const copyLink = () => {
        const fullLink = `${window.location.origin}${data.referralLink}`;
        navigator.clipboard.writeText(fullLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLink = () => {
        const fullLink = `${window.location.origin}${data.referralLink}`;
        if (navigator.share) {
            navigator.share({
                title: 'Join UV Market School',
                text: 'Get professional trading signals! Join using my referral link:',
                url: fullLink,
            });
        } else {
            copyLink();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-8">
                    <Gift className="text-purple-600" size={28} />
                    Referral Program
                </h1>

                {/* Referral Card */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                    <h2 className="text-xl font-bold mb-2 relative z-10">Invite Friends & Earn Rewards</h2>
                    <p className="text-purple-100 text-sm mb-6 relative z-10">
                        Share your unique referral link. When they subscribe, you both benefit!
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between gap-3 relative z-10">
                        <div className="flex-1 min-w-0">
                            <div className="text-xs text-purple-200 mb-1">Your Referral Code</div>
                            <div className="text-lg font-bold font-mono tracking-wider">{data.referralCode}</div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={copyLink}
                                className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors" title="Copy Link">
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                            <button onClick={shareLink}
                                className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors" title="Share">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <Users className="mx-auto text-blue-500 mb-2" size={24} />
                        <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Referrals</div>
                        <div className="text-2xl font-bold text-gray-800">{data.totalReferrals}</div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <Award className="mx-auto text-green-500 mb-2" size={24} />
                        <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Completed</div>
                        <div className="text-2xl font-bold text-gray-800">{data.completedReferrals}</div>
                    </div>
                </div>

                {/* Referral List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800">Your Referrals</h3>
                    </div>
                    {data.referrals.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                            {data.referrals.map(r => (
                                <div key={r.id} className="p-4 flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-800">{r.referred.name}</div>
                                        <div className="text-xs text-gray-400">{r.referred.email}</div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                r.status === 'rewarded' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>{r.status}</span>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {new Date(r.createdAt).toLocaleDateString('en-IN')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-gray-400">
                            <Gift size={32} className="mx-auto mb-2 text-gray-300" />
                            <p>No referrals yet. Share your link to get started!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
