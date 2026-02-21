import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Activity, Wind, Info, ChevronRight,
  Shield, AlertOctagon, CheckCircle2, Sparkles, Map as MapIcon,
  ArrowLeft, Droplets, Layers, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { RiskHierarchy, StateData, District } from '../types';

const DEMO_DATA: RiskHierarchy = [
  {
    name: "Maharashtra", risk: "High", avg_extraction: 78,
    districts: [
      { id: 'm1', name: 'Pune', status: 'Safe', risk: 'Low', metrics: { stage: 55, rainfall: 700, recharge: 120, extraction_irrigation: 40, extraction_domestic: 20 } },
      { id: 'm2', name: 'Latur', status: 'Critical', risk: 'High', metrics: { stage: 92, rainfall: 400, recharge: 80, extraction_irrigation: 85, extraction_domestic: 10 } },
      { id: 'm3', name: 'Nashik', status: 'Semi-Critical', risk: 'Medium', metrics: { stage: 68, rainfall: 550, recharge: 100, extraction_irrigation: 60, extraction_domestic: 15 } },
    ]
  },
  {
    name: "Karnataka", risk: "Medium", avg_extraction: 65,
    districts: [
      { id: 'k1', name: 'Bangalore Urban', status: 'Over-Exploited', risk: 'High', metrics: { stage: 120, rainfall: 850, recharge: 200, extraction_irrigation: 10, extraction_domestic: 90 } },
      { id: 'k2', name: 'Mysore', status: 'Safe', risk: 'Low', metrics: { stage: 45, rainfall: 900, recharge: 150, extraction_irrigation: 50, extraction_domestic: 20 } },
    ]
  },
  {
    name: "Punjab", risk: "High", avg_extraction: 160,
    districts: [
      { id: 'p1', name: 'Ludhiana', status: 'Critical', risk: 'High', metrics: { stage: 165, rainfall: 400, recharge: 50, extraction_irrigation: 95, extraction_domestic: 5 } },
    ]
  },
  {
    name: "Rajasthan", risk: "High", avg_extraction: 140,
    districts: [
      { id: 'r1', name: 'Jaipur', status: 'Critical', risk: 'High', metrics: { stage: 140, rainfall: 300, recharge: 40, extraction_irrigation: 80, extraction_domestic: 30 } }
    ]
  }
];

const RiskAnalysis = () => {
  const [hierarchy, setHierarchy] = useState<RiskHierarchy>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.getRiskHierarchy();
      if (Array.isArray(data) && data.length > 0) {
        setHierarchy(data);
      } else throw new Error("Empty data");
    } catch (err) {
      setHierarchy(DEMO_DATA);
      setError("Backend unreachable. Showing demo data.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskGradient = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'high': return 'from-rose-500 to-red-600';
      case 'medium': return 'from-amber-400 to-orange-500';
      case 'low': return 'from-emerald-400 to-teal-500';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  const getRiskBadge = (risk: string) => {
    const r = risk?.toLowerCase();
    if (r === 'high') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-xs font-bold"><AlertOctagon size={11} /> High Risk</span>;
    if (r === 'medium') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold"><AlertTriangle size={11} /> Moderate</span>;
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold"><CheckCircle2 size={11} /> Stable</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--border-main)', borderTopColor: 'var(--primary)' }} />
          <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--text-tertiary)' }}>
            Synchronizing with Neural Grid...
          </p>
        </div>
      </div>
    );
  }

  // National Overview
  if (!selectedState) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight"
              style={{ color: 'var(--text-main)', fontFamily: 'Plus Jakarta Sans' }}>
              National Risk Assessment
            </h1>
            <p className="mt-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Real-time hydrological monitoring across <strong>{hierarchy.length}</strong> territories.
            </p>
          </div>
          {error && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
              style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' }}>
              <Info size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {hierarchy.map((state, i) => (
            <motion.div
              key={state.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -5 }}
              onClick={() => { setSelectedState(state); setSelectedDistrict(state.districts[0] || null); }}
              className="group rounded-2xl p-6 border cursor-pointer relative overflow-hidden transition-all"
              style={{
                background: 'white',
                border: '1px solid var(--border-main)',
                boxShadow: 'var(--shadow-sm)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-main)';
              }}
            >
              {/* Risk color bar on left */}
              <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-2xl bg-gradient-to-b ${getRiskGradient(state.risk)}`} />

              <div className="flex justify-between items-start mb-4 pl-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                  style={{ background: 'var(--gradient-main)', boxShadow: 'var(--shadow-violet)' }}>
                  <MapIcon size={18} />
                </div>
                {getRiskBadge(state.risk)}
              </div>

              <h3 className="text-lg font-bold mb-1 pl-2" style={{ color: 'var(--text-main)', fontFamily: 'Plus Jakarta Sans' }}>
                {state.name}
              </h3>
              <p className="text-xs pl-2 mb-5" style={{ color: 'var(--text-tertiary)' }}>
                {state.districts.length} Monitored Zones
              </p>

              <div className="rounded-xl p-3" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Avg. Extraction</span>
                  <span className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>{state.avg_extraction}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${state.avg_extraction > 100 ? 'from-rose-500 to-red-600' : 'from-indigo-500 to-violet-600'}`}
                    style={{ width: `${Math.min(state.avg_extraction, 100)}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // State Detail View
  return (
    <div className="flex h-full animate-fade-in" style={{ background: 'var(--bg-main)' }}>

      {/* District Sidebar */}
      <div className="w-72 flex-shrink-0 flex flex-col z-10"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%)',
          borderRight: '1px solid var(--border-main)',
        }}>
        <div className="p-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setSelectedState(null)}
            className="flex items-center gap-2 text-sm mb-4 transition-all"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
          >
            <ArrowLeft size={15} /> Back to National
          </button>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-main)', fontFamily: 'Plus Jakarta Sans' }}>
            {selectedState.name}
          </h2>
          <div className="mt-2 flex items-center gap-2">
            {getRiskBadge(selectedState.risk)}
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>• {selectedState.districts.length} Districts</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {selectedState.districts.map(district => (
            <button
              key={district.id}
              onClick={() => { setSelectedDistrict(district); setAiInsight(''); }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center justify-between"
              style={selectedDistrict?.id === district.id
                ? { background: 'var(--gradient-main)', color: 'white', boxShadow: 'var(--shadow-violet)', fontWeight: 600 }
                : { color: 'var(--text-secondary)', border: '1px solid transparent' }
              }
              onMouseEnter={e => {
                if (selectedDistrict?.id !== district.id) {
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
                }
              }}
              onMouseLeave={e => {
                if (selectedDistrict?.id !== district.id) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                }
              }}
            >
              <span className="font-medium">{district.name}</span>
              {selectedDistrict?.id === district.id && <ChevronRight size={14} />}
              {selectedDistrict?.id !== district.id && district.risk === 'High' && (
                <div className="w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* District Detail */}
      <div className="flex-1 overflow-y-auto p-8">
        {selectedDistrict ? (
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>
                  District Analysis
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2"
                  style={{ color: 'var(--text-main)', fontFamily: 'Plus Jakarta Sans' }}>
                  {selectedDistrict.name}
                </h1>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${selectedDistrict.status === 'Critical' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                    selectedDistrict.status === 'Safe' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                      'bg-amber-50 border-amber-100 text-amber-700'
                  }`}>
                  Status: {selectedDistrict.status}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchData}
                  className="p-2.5 rounded-xl transition-all"
                  style={{ background: 'white', border: '1px solid var(--border-main)', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-xs)' }}
                >
                  <RefreshCw size={16} />
                </button>
                <button className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: 'white', border: '1px solid var(--border-main)', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-xs)' }}>
                  Export PDF
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard icon={Activity} label="Stage of Extraction" value={selectedDistrict.metrics.stage} unit="%" status={selectedDistrict.metrics.stage > 90 ? 'critical' : selectedDistrict.metrics.stage > 70 ? 'warning' : 'good'} />
              <MetricCard icon={Wind} label="Annual Rainfall" value={selectedDistrict.metrics.rainfall} unit="mm" status={selectedDistrict.metrics.rainfall < 600 ? 'warning' : 'good'} />
              <MetricCard icon={Droplets} label="GW Recharge" value={selectedDistrict.metrics.recharge} unit="mm" status={selectedDistrict.metrics.recharge < 100 ? 'critical' : 'good'} />
            </div>

            {/* AI Section */}
            <div className="rounded-2xl p-8 border relative overflow-hidden"
              style={{ background: 'white', border: '1px solid var(--border-main)', boxShadow: 'var(--shadow-md)' }}>
              {/* Ambient glow */}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                      style={{ background: 'var(--gradient-main)', boxShadow: 'var(--shadow-violet)' }}>
                      <Sparkles size={18} color="white" />
                    </div>
                    <div>
                      <h3 className="font-bold" style={{ color: 'var(--text-main)', fontFamily: 'Plus Jakarta Sans' }}>
                        Neural Risk Assessment
                      </h3>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Powered by HydroMind AI v2.1</p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      setAiLoading(true);
                      try {
                        const res = await api.queryAI(
                          `Hydrological Risk Context for ${selectedDistrict.name}, ${selectedState.name}. Metrics: Stage=${selectedDistrict.metrics.stage}%, Rainfall=${selectedDistrict.metrics.rainfall}mm.`,
                          "Provide a concise technical risk assessment and 2 key mitigation strategies."
                        );
                        setAiInsight(res.answer);
                      } catch (e) {
                        setAiInsight("Unable to connect to Neural Engine. Please verify network connectivity.");
                      } finally {
                        setAiLoading(false);
                      }
                    }}
                    disabled={aiLoading}
                    className="btn-tech-primary px-5 py-2 text-sm flex items-center gap-2 disabled:opacity-60"
                  >
                    {aiLoading ? <span className="animate-pulse">Processing...</span> : 'Run Assessment'}
                  </button>
                </div>

                <div className="min-h-[110px] rounded-xl p-6 border"
                  style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                  {aiInsight ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="prose prose-sm max-w-none leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {aiInsight}
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-6 gap-3"
                      style={{ color: 'var(--text-tertiary)' }}>
                      <Activity size={22} className="opacity-40" />
                      <p className="text-sm font-medium">Initiate analysis to generate predictive insights.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Extraction + Protocol */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="rounded-2xl p-6 border"
                style={{ background: 'white', border: '1px solid var(--border-main)', boxShadow: 'var(--shadow-sm)' }}>
                <h4 className="font-bold mb-6 flex items-center gap-2"
                  style={{ color: 'var(--text-main)', fontFamily: 'Plus Jakarta Sans' }}>
                  <Layers size={16} style={{ color: 'var(--primary)' }} />
                  Extraction Breakdown
                </h4>
                <div className="space-y-5">
                  {[
                    { label: 'Irrigation', val: selectedDistrict.metrics.extraction_irrigation, color: '#6366f1' },
                    { label: 'Domestic & Industrial', val: selectedDistrict.metrics.extraction_domestic, color: '#38bdf8' },
                  ].map(b => (
                    <div key={b.label}>
                      <div className="flex justify-between text-sm mb-2">
                        <span style={{ color: 'var(--text-secondary)' }}>{b.label}</span>
                        <span className="font-bold" style={{ color: b.color }}>{b.val}%</span>
                      </div>
                      <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${b.val}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${b.color} 0%, ${b.color}99 100%)` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conservation Protocol */}
              <div className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{ background: 'var(--gradient-main)', boxShadow: 'var(--shadow-violet)' }}>
                <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full opacity-20"
                  style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)' }} />
                <div className="relative z-10">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <Shield size={16} />
                    Conservation Protocol
                  </h4>
                  <p className="text-sm opacity-80 leading-relaxed mb-6">
                    Based on the current stage of extraction ({selectedDistrict.metrics.stage}%) and status ({selectedDistrict.status}),
                    immediate intervention is recommended for this sector.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Priority', value: 'High' },
                      { label: 'Response', value: 'Tier-1' },
                    ].map(stat => (
                      <div key={stat.label} className="p-3 rounded-xl backdrop-blur-sm"
                        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <div className="text-2xl font-bold mb-1">{stat.value}</div>
                        <div className="text-[10px] opacity-60 uppercase tracking-widest">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3"
            style={{ color: 'var(--text-tertiary)' }}>
            <p className="text-sm">Select a district to view detailed analytics.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, unit, status }: any) => {
  const colorMap: Record<string, { bg: string, text: string, border: string, icon: string }> = {
    critical: { bg: '#fff1f2', text: '#be123c', border: '#fecdd3', icon: '#e11d48' },
    warning: { bg: '#fffbeb', text: '#b45309', border: '#fde68a', icon: '#d97706' },
    good: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', icon: '#22c55e' },
  };
  const c = colorMap[status] || colorMap.good;

  return (
    <div className="p-5 rounded-xl border flex items-start justify-between transition-all"
      style={{ background: 'white', border: '1px solid var(--border-main)', boxShadow: 'var(--shadow-sm)' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>{label}</p>
        <div className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
          {value} <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>{unit}</span>
        </div>
      </div>
      <div className="p-3 rounded-xl border" style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.icon }}>
        <Icon size={18} />
      </div>
    </div>
  );
};

export default RiskAnalysis;