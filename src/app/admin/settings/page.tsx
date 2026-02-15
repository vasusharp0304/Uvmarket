'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Loader2, Palette, Building2, FileText } from 'lucide-react';

interface AppSettings {
    appName: string;
    tagline: string;
    logoUrl: string | null;
    primaryColor: string;
    companyName: string;
    companyAddress: string | null;
    companyGST: string | null;
    companyPAN: string | null;
    companyEmail: string | null;
    companyPhone: string | null;
    gstPercent: number;
    termsUrl: string | null;
    privacyUrl: string | null;
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(r => r.json())
            .then(d => { setSettings(d.settings); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        setMessage('');
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (res.ok) setMessage('Settings saved successfully!');
            else setMessage('Failed to save settings');
        } catch {
            setMessage('Network error');
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field: string, value: any) => {
        setSettings(prev => prev ? { ...prev, [field]: value } : prev);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;
    if (!settings) return <div className="p-8 text-center text-red-500">Failed to load settings</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <Settings className="text-purple-600" size={24} />
                        App Settings
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Customize branding, company details, and invoice settings</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg disabled:opacity-60"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {message && (
                <div className={`px-4 py-3 rounded-lg text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message}
                </div>
            )}

            {/* Branding Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Palette size={18} className="text-purple-600" />
                    Branding
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">App Name</label>
                        <input type="text" value={settings.appName} onChange={e => updateField('appName', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Tagline</label>
                        <input type="text" value={settings.tagline} onChange={e => updateField('tagline', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Logo URL</label>
                        <input type="text" value={settings.logoUrl || ''} onChange={e => updateField('logoUrl', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Primary Color</label>
                        <div className="flex items-center gap-3">
                            <input type="color" value={settings.primaryColor} onChange={e => updateField('primaryColor', e.target.value)}
                                className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                            <input type="text" value={settings.primaryColor} onChange={e => updateField('primaryColor', e.target.value)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none font-mono text-sm" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Company Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Building2 size={18} className="text-purple-600" />
                    Company Details (Invoice)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Company Name</label>
                        <input type="text" value={settings.companyName} onChange={e => updateField('companyName', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                        <input type="email" value={settings.companyEmail || ''} onChange={e => updateField('companyEmail', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Phone</label>
                        <input type="text" value={settings.companyPhone || ''} onChange={e => updateField('companyPhone', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">GSTIN</label>
                        <input type="text" value={settings.companyGST || ''} onChange={e => updateField('companyGST', e.target.value)}
                            placeholder="22AAAAA0000A1Z5"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">PAN</label>
                        <input type="text" value={settings.companyPAN || ''} onChange={e => updateField('companyPAN', e.target.value)}
                            placeholder="ABCDE1234F"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">GST %</label>
                        <input type="number" step="0.01" value={settings.gstPercent} onChange={e => updateField('gstPercent', parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Company Address</label>
                        <textarea value={settings.companyAddress || ''} onChange={e => updateField('companyAddress', e.target.value)} rows={2}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none resize-none" />
                    </div>
                </div>
            </div>

            {/* Legal */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-purple-600" />
                    Legal Links
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Terms & Conditions URL</label>
                        <input type="url" value={settings.termsUrl || ''} onChange={e => updateField('termsUrl', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Privacy Policy URL</label>
                        <input type="url" value={settings.privacyUrl || ''} onChange={e => updateField('privacyUrl', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}
