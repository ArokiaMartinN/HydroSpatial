import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Menu, X, LayoutDashboard, BrainCircuit,
    ShieldAlert, FileText, Droplets
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [expanded, setExpanded] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
        { icon: BrainCircuit, label: "AI Research", path: "/ai-assistant" },
        { icon: ShieldAlert, label: "Risk Monitor", path: "/risk-analysis" },
    ];

    return (
        <div className="flex h-screen w-full overflow-hidden font-sans" style={{ background: 'var(--bg-main)' }}>

            {/* ── SIDEBAR ── */}
            <motion.nav
                initial={{ width: 80 }}
                animate={{ width: expanded ? 280 : 80 }}
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="h-full flex flex-col shrink-0 z-50 relative"
                style={{
                    background: 'linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%)',
                    borderRight: '1px solid var(--border-main)',
                    boxShadow: '2px 0 20px rgba(99,102,241,0.06)',
                }}
            >
                {/* Brand Header */}
                <div className="h-20 flex items-center justify-center relative w-full"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="p-2.5 rounded-xl transition-all"
                        style={{
                            color: 'var(--text-tertiary)',
                            ...(expanded ? { position: 'absolute', right: '16px' } : {}),
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                        {expanded ? <X size={20} /> : <Menu size={22} />}
                    </button>

                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute left-5 flex items-center gap-3"
                            >
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                                    style={{ background: 'var(--gradient-main)', boxShadow: 'var(--shadow-violet)' }}>
                                    <Droplets size={18} color="white" />
                                </div>
                                <span className="font-bold text-lg"
                                    style={{ color: 'var(--text-main)', fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-snug)' }}>
                                    HydroSpatial
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-3 space-y-1 py-6">
                    {menuItems.map(item => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className="w-full flex items-center px-3 py-3 rounded-xl transition-all group relative"
                                style={{
                                    background: isActive ? 'var(--gradient-soft)' : 'transparent',
                                    border: isActive ? '1px solid var(--border-main)' : '1px solid transparent',
                                    color: isActive ? 'var(--primary)' : 'var(--text-tertiary)',
                                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: isActive ? '600' : '500',
                                    letterSpacing: '0.005em',
                                }}
                                onMouseEnter={e => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'var(--bg-hover)';
                                        e.currentTarget.style.color = 'var(--primary)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'var(--text-tertiary)';
                                    }
                                }}
                            >
                                {/* Active left indicator */}
                                {!expanded && isActive && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-l-full"
                                        style={{ background: 'var(--gradient-main)' }} />
                                )}

                                <div className="flex justify-center shrink-0 w-6">
                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                </div>

                                <AnimatePresence mode="wait">
                                    {expanded && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -5 }}
                                            transition={{ duration: 0.18 }}
                                            className="ml-3 whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                        onClick={() => navigate('/terms')}
                        className="w-full flex items-center px-3 py-3 rounded-xl transition-all mb-1 gap-3 group"
                        style={{ color: 'var(--text-tertiary)' }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'var(--bg-hover)';
                            e.currentTarget.style.color = 'var(--primary)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-tertiary)';
                        }}
                    >
                        <div className="flex justify-center shrink-0 w-6">
                            <FileText size={18} />
                        </div>
                        <AnimatePresence>
                            {expanded && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[0.9rem] font-medium"
                                >
                                    Terms & Conditions
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* User card */}
                    <div className={`mt-2 flex items-center p-2.5 rounded-xl border transition-all ${expanded ? 'gap-3' : 'justify-center'
                        }`}
                        style={{
                            background: expanded ? 'rgba(255,255,255,0.9)' : 'transparent',
                            border: expanded ? '1px solid var(--border-main)' : '1px solid transparent',
                            boxShadow: expanded ? 'var(--shadow-sm)' : 'none',
                        }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shrink-0 text-xs shadow-md"
                            style={{ background: 'var(--gradient-main)', boxShadow: 'var(--shadow-violet)' }}>
                            MK
                        </div>
                        <AnimatePresence>
                            {expanded && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="flex-1 overflow-hidden"
                                >
                                    <div className="font-semibold truncate" style={{ color: 'var(--text-main)', fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', letterSpacing: '-0.01em' }}>
                                        Martin K.
                                    </div>
                                    <div className="text-caption truncate">
                                        Enterprise Admin
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.nav>

            {/* ── MAIN ── */}
            <main className="flex-1 overflow-hidden relative">
                <div className="h-full overflow-y-auto overflow-x-hidden scroll-smooth">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default Layout;
