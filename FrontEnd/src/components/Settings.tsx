import React from 'react';
import { Lock, Bell, Database, Key, Mail, Globe, Check, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
    return (
        <div className="max-w-5xl mx-auto p-8 lg:p-12 animate-fade-in">

            {/* Header */}
            <div className="mb-8 pb-6" style={{ borderBottom: '1px solid var(--border-main)' }}>
                <h1 className="text-3xl font-extrabold tracking-tight mb-2"
                    style={{ color: 'var(--text-main)', fontFamily: 'Plus Jakarta Sans' }}>
                    System Configuration
                </h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="grid gap-7">

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl border"
                    style={{ background: 'white', border: '1px solid var(--border-main)', boxShadow: 'var(--shadow-sm)' }}
                >
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-xl"
                            style={{ background: 'var(--gradient-main)', boxShadow: 'var(--shadow-violet)' }}>
                            MK
                        </div>
                        <div className="text-center sm:text-left flex-1">
                            <h2 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>Martin K.</h2>
                            <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                trace.martin.k@hydrospatial.com
                            </p>
                            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                                <span className="badge badge-primary">Administrator</span>
                                <span className="badge badge-violet">Enterprise Tier</span>
                            </div>
                        </div>
                        <button className="btn-tech-ghost px-5 py-2.5 text-sm">
                            Edit Profile
                        </button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Account & Security */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
                            <h3 className="text-[11px] font-bold uppercase tracking-widest pl-1"
                                style={{ color: 'var(--text-tertiary)' }}>
                                Account & Security
                            </h3>
                            <div className="rounded-2xl border overflow-hidden"
                                style={{ background: 'white', border: '1px solid var(--border-main)', boxShadow: 'var(--shadow-xs)' }}>
                                <SettingRow icon={Lock} title="Security Protocol" desc="2FA Authentication active." action="Configure" />
                                <div className="h-px mx-4" style={{ background: 'var(--border-subtle)' }} />
                                <SettingRow icon={Mail} title="Email Preferences" desc="Weekly insights digest." action="Manage" />
                            </div>
                        </motion.div>

                        {/* System */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-3">
                            <h3 className="text-[11px] font-bold uppercase tracking-widest pl-1"
                                style={{ color: 'var(--text-tertiary)' }}>
                                System
                            </h3>
                            <div className="rounded-2xl border overflow-hidden"
                                style={{ background: 'white', border: '1px solid var(--border-main)', boxShadow: 'var(--shadow-xs)' }}>
                                <SettingRow icon={Bell} title="Notifications" desc="Push alerts for Critical status." action="Edit" />
                                <div className="h-px mx-4" style={{ background: 'var(--border-subtle)' }} />
                                <SettingRow icon={Database} title="Data Streams" desc="Sentinel-2, MODIS Connected."
                                    action={<span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100"><Check size={12} /> Connected</span>} />
                                <div className="h-px mx-4" style={{ background: 'var(--border-subtle)' }} />
                                <SettingRow icon={Globe} title="Regional Settings" desc="Timezone: UTC+05:30" action="Change" />
                            </div>
                        </motion.div>

                        {/* API Key */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-2xl p-6 text-white relative overflow-hidden"
                            style={{ background: 'var(--gradient-main)', boxShadow: 'var(--shadow-violet)' }}
                        >
                            <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full opacity-20"
                                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)' }} />
                            <div className="relative z-10 flex items-start gap-4">
                                <div className="p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    <Key size={20} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold mb-1">Developer API Access</h3>
                                    <p className="text-sm opacity-70 mb-4 leading-relaxed">
                                        Your enterprise key has full read/write access to the Neural Engine. Do not share this key.
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 truncate px-3 py-2 rounded-xl text-xs font-mono"
                                            style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>
                                            sk_live_92834...8x92_hydra
                                        </code>
                                        <button className="px-3 py-2 rounded-xl text-xs font-bold transition-all"
                                            style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}>
                                            Roll Key
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>

                    {/* Right Column: Usage */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="rounded-2xl border p-6 h-full"
                        style={{ background: 'white', border: '1px solid var(--border-main)', boxShadow: 'var(--shadow-sm)' }}
                    >
                        <h3 className="font-bold mb-6 flex items-center gap-2"
                            style={{ color: 'var(--text-main)', fontFamily: 'Plus Jakarta Sans' }}>
                            <BarChart2 size={18} style={{ color: 'var(--primary)' }} />
                            Usage Limits
                        </h3>

                        <div className="space-y-6">
                            <UsageBar label="API Calls" current={8543} max={10000} color="#6366f1" />
                            <UsageBar label="Storage (GB)" current={45} max={100} color="#38bdf8" />
                            <UsageBar label="Neural Core Hours" current={120} max={500} color="#8b5cf6" />
                        </div>

                        <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                            <button className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all"
                                style={{ background: 'var(--gradient-soft)', border: '1px solid var(--border-main)', color: 'var(--primary)' }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.background = 'var(--gradient-main)';
                                    (e.currentTarget as HTMLElement).style.color = 'white';
                                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-violet)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.background = 'var(--gradient-soft)';
                                    (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                                }}>
                                Upgrade Plan
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const SettingRow = ({ icon: Icon, title, desc, action }: any) => (
    <div
        className="p-4 flex items-center justify-between transition-all cursor-pointer group"
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>
                <Icon size={17} />
            </div>
            <div>
                <h4 className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>{title}</h4>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
            </div>
        </div>
        <div>
            {typeof action === 'string' ? (
                <button className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseEnter={e => {
                        (e.currentTarget.style.color = 'var(--primary)');
                        (e.currentTarget.style.background = 'var(--primary-light)');
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget.style.color = 'var(--text-tertiary)');
                        (e.currentTarget.style.background = 'transparent');
                    }}>
                    {action}
                </button>
            ) : action}
        </div>
    </div>
);

const UsageBar = ({ label, current, max, color }: { label: string; current: number; max: number; color: string }) => {
    const percent = Math.min((current / max) * 100, 100);
    return (
        <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ color: percent > 90 ? '#e11d48' : 'var(--text-main)', fontWeight: 700 }}>
                    {percent < 100 ? `${current.toLocaleString()} / ${max.toLocaleString()}` : 'Limit Reached'}
                </span>
            </div>
            <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: percent > 90 ? 'linear-gradient(90deg,#f43f5e,#e11d48)' : `linear-gradient(90deg, ${color} 0%, ${color}aa 100%)` }}
                />
            </div>
        </div>
    );
};

export default Settings;
