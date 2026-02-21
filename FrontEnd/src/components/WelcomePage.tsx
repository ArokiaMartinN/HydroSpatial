import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, BarChart3, Globe, Droplets } from "lucide-react";
import { motion } from "framer-motion";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans"
      style={{ background: 'var(--bg-main)' }}>

      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
        <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)' }} />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl"
        style={{
          borderBottom: '1px solid var(--border-main)',
          background: 'rgba(255,255,255,0.8)',
          boxShadow: '0 1px 20px rgba(99,102,241,0.06)',
        }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: 'var(--gradient-main)', boxShadow: 'var(--shadow-violet)' }}>
              <Droplets size={16} color="white" />
            </div>
            <span className="font-bold"
              style={{ color: 'var(--text-main)', fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', letterSpacing: 'var(--tracking-snug)' }}>
              HydroSpatial
            </span>
          </div>
          <div className="flex items-center gap-6" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--text-secondary)' }}>
            <a href="#" className="hover:opacity-70 transition-opacity">Solutions</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Data</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Enterprise</a>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-tech-primary px-5 py-2 text-sm"
            >
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="pt-36 pb-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide"
            style={{
              background: 'var(--primary-light)',
              border: '1px solid var(--border-main)',
              color: 'var(--primary)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Operational
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-display"
            style={{ color: 'var(--text-main)', fontSize: 'clamp(3rem, 8vw, 5rem)', lineHeight: 'var(--leading-tight)' }}
          >
            Intelligence for <br />
            <span className="gradient-text">Water Security.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', lineHeight: 'var(--leading-loose)', fontWeight: '400' }}
          >
            The enterprise standard for hydrological monitoring and risk assessment.
            Deployed across 400+ districts for real-time predictive analysis.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-tech-primary px-8 py-3.5 text-base flex items-center gap-2 group"
            >
              Launch Platform
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              className="btn-tech-ghost px-8 py-3.5 text-base"
            >
              Read Documentation
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex items-center justify-center gap-8 pt-6"
          >
            {[
              { value: '400+', label: 'Districts' },
              { value: '2M+', label: 'Data Points' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-numeric gradient-text" style={{ fontSize: 'var(--text-2xl)' }}>{stat.value}</div>
                <div className="text-label mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Globe}
            title="Global Mapping"
            desc="High-resolution satellite integration with ground-truth sensor grids."
            delay={0}
          />
          <FeatureCard
            icon={BarChart3}
            title="Predictive Models"
            desc="AI-driven forecasting for rainfall, recharge, and extraction rates."
            delay={0.1}
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Compliance Audit"
            desc="Automated reporting for regulatory bodies and safety inspections."
            delay={0.2}
          />
        </div>
      </div>

    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay + 0.5, duration: 0.5 }}
    className="p-8 rounded-2xl border transition-all group cursor-default"
    style={{
      background: 'var(--gradient-card)',
      border: '1px solid var(--border-main)',
      boxShadow: 'var(--shadow-sm)',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
      (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-main)';
      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
    }}
  >
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform"
      style={{ background: 'var(--gradient-main)', boxShadow: 'var(--shadow-violet)' }}>
      <Icon size={26} color="white" strokeWidth={1.8} />
    </div>
    <h3 className="text-subheading mb-3" style={{ color: 'var(--text-main)', fontSize: 'var(--text-lg)' }}>
      {title}
    </h3>
    <p className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>
      {desc}
    </p>
  </motion.div>
);

export default WelcomePage;