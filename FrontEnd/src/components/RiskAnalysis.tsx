import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ChevronRight, AlertTriangle, Droplet, 
  Wind, Activity, ArrowRight, LayoutGrid, BarChart3,
  Waves, ThermometerSun, BrainCircuit, RefreshCw
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';

// --- TYPES (Must match Backend JSON) ---
interface DistrictMetrics {
  stage: number;
  rainfall: number;
  recharge: number;
  extraction_irrigation: number;
  extraction_domestic: number;
}

interface District {
  id: string;
  name: string;
  status: string; // 'Critical', 'Safe' etc
  risk: 'High' | 'Medium' | 'Low';
  metrics: DistrictMetrics;
}

interface StateData {
  name: string;
  risk: 'High' | 'Medium' | 'Low';
  avg_extraction: number;
  districts: District[];
}

// --- COMPONENTS ---

const RiskBadge = ({ risk }: { risk: string }) => {
  const styles = {
    High: 'bg-red-500/10 text-red-400 border-red-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[risk as keyof typeof styles] || styles.Low}`}>
      {risk}
    </span>
  );
};

const MetricCard = ({ label, value, unit, icon: Icon, color, subtext }: any) => (
  <div className="bg-[#1A1D24]/40 backdrop-blur-sm border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-white/10 transition-all hover:bg-[#1A1D24]/60">
    <div>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
      <div className="text-2xl font-mono font-bold text-white tracking-tight">
        {value} <span className="text-sm text-slate-600 font-sans font-normal">{unit}</span>
      </div>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
    <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`}>
      <Icon size={20} />
    </div>
  </div>
);

// --- MAIN DASHBOARD ---

const RiskAnalysis = () => {
  const [data, setData] = useState<StateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeState, setActiveState] = useState<StateData | null>(null);
  const [activeDistrict, setActiveDistrict] = useState<District | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    fetch('http://127.0.0.1:5000/api/risk-hierarchy')
      .then(res => {
        if (!res.ok) throw new Error("Server Error");
        return res.json();
      })
      .then(fetchedData => {
        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
            const sorted = fetchedData.sort((a: any, b: any) => b.avg_extraction - a.avg_extraction);
            setData(sorted);
        } else {
            setError("No data found. Please check backend CSV files.");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to connect to Backend.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter states
  const filteredStates = useMemo(() => {
    return data.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [data, searchTerm]);

  const generateInsight = async (district: District) => {
    setInsightLoading(true);
    setAiInsight(null);
    try {
      const contextData = `
        District: ${district.name}
        Groundwater Stage: ${district.metrics.stage}%
        Annual Rainfall: ${district.metrics.rainfall} mm
        Total Recharge: ${district.metrics.recharge}
        Irrigation Use: ${district.metrics.extraction_irrigation}
        Domestic Use: ${district.metrics.extraction_domestic}
      `;
      
      const res = await fetch('http://127.0.0.1:5000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            context: contextData,
            query: "Evaluate sustainability and suggest 2 mitigations." 
        })
      });
      const json = await res.json();
      setAiInsight(json.answer);
    } catch (e) {
      setAiInsight("AI Service unavailable.");
    } finally {
      setInsightLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen w-full bg-[#090a0c] flex items-center justify-center text-blue-500">
      <div className="flex flex-col items-center gap-4">
        <Activity className="animate-spin" size={32} />
        <span className="text-sm font-mono uppercase tracking-widest text-slate-500">Loading Hydro-Spatial Data...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="h-screen w-full bg-[#090a0c] flex flex-col items-center justify-center text-slate-400 gap-4">
        <AlertTriangle size={48} className="text-red-500" />
        <h3 className="text-xl font-bold text-white">Connection Error</h3>
        <p className="max-w-md text-center">{error}</p>
        <button onClick={fetchData} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2">
            <RefreshCw size={16} /> Retry
        </button>
    </div>
  );

  return (
    <div className="h-[calc(100vh-4rem)] w-full bg-[#090a0c] text-slate-300 font-sans overflow-hidden flex flex-col">
      
      {/* HEADER */}
      <header className="h-16 border-b border-white/5 bg-[#0e1014] flex items-center px-6 justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30 text-blue-400">
            <Waves size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">Hydro<span className="text-blue-500">Logic</span> Pro</h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">Risk Analysis Module</p>
          </div>
        </div>
        
        <div className="relative w-80 hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search States..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#090a0c] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700 text-slate-300"
          />
        </div>
      </header>

      {/* COLUMNS LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* COL 1: STATES */}
        <div className="w-80 border-r border-white/5 bg-[#0e1014] flex flex-col shrink-0">
          <div className="p-4 border-b border-white/5 bg-[#0e1014] sticky top-0 z-10">
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Region</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredStates.map(state => (
              <button
                key={state.name}
                onClick={() => { setActiveState(state); setActiveDistrict(null); setAiInsight(null); }}
                className={`w-full flex items-center justify-between p-3.5 rounded-lg text-left transition-all border ${
                  activeState?.name === state.name 
                    ? 'bg-blue-600/10 border-blue-500/50 text-white shadow-[0_0_15px_rgba(37,99,235,0.15)]' 
                    : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400'
                }`}
              >
                <div>
                  <div className="font-medium text-sm">{state.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${state.avg_extraction > 90 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(state.avg_extraction, 100)}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-600">{state.avg_extraction.toFixed(0)}% Util</span>
                  </div>
                </div>
                {activeState?.name === state.name ? <ChevronRight size={14} className="text-blue-500" /> : <RiskBadge risk={state.risk} />}
              </button>
            ))}
          </div>
        </div>

        {/* COL 2: DISTRICTS */}
        <AnimatePresence mode="wait">
          {activeState ? (
            <motion.div 
              key={activeState.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="w-96 border-r border-white/5 bg-[#0b0d10] flex flex-col shrink-0"
            >
              <div className="p-4 border-b border-white/5 bg-[#0b0d10] sticky top-0 z-10 flex justify-between items-center">
                <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Districts in {activeState.name}</h2>
                <span className="text-[10px] text-slate-600">{activeState.districts.length} Zones</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {activeState.districts.map((district) => (
                  <button
                    key={district.id}
                    onClick={() => setActiveDistrict(district)}
                    className={`w-full p-4 rounded-xl text-left transition-all border group relative overflow-hidden ${
                      activeDistrict?.id === district.id
                        ? 'bg-[#14161c] border-blue-500/40 shadow-lg'
                        : 'bg-[#14161c]/40 border-white/5 hover:border-white/10 hover:bg-[#14161c]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        district.status === 'Critical' ? 'bg-red-500/20 text-red-400' : 
                        district.status === 'Semi-Critical' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {district.status}
                      </span>
                      {activeDistrict?.id === district.id && <ArrowRight size={14} className="text-blue-400" />}
                    </div>
                    
                    <div className="font-bold text-base text-white mb-3 relative z-10">{district.name}</div>
                    
                    <div className="flex items-center gap-4 text-[10px] text-slate-500 relative z-10">
                      <div className="flex items-center gap-1.5">
                        <Activity size={10} />
                        <span>{district.metrics.stage.toFixed(0)}% Ext</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Droplet size={10} />
                        <span>{district.metrics.rainfall.toFixed(0)} mm</span>
                      </div>
                    </div>

                    {activeDistrict?.id === district.id && (
                      <motion.div layoutId="activeLine" className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="w-96 border-r border-white/5 bg-[#0b0d10] flex items-center justify-center text-slate-700 text-sm">
              Select a state to view districts
            </div>
          )}
        </AnimatePresence>

        {/* COL 3: ANALYTICS PANEL */}
        <div className="flex-1 bg-[#090a0c] p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeDistrict ? (
              <motion.div
                key={activeDistrict.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="max-w-6xl mx-auto space-y-8"
              >
                {/* HEADER */}
                <div className="flex items-end justify-between border-b border-white/10 pb-6">
                  <div>
                    <div className="flex items-center space-x-2 text-blue-500 text-xs font-bold tracking-widest mb-2 uppercase">
                      <span>{activeState?.name}</span>
                      <ChevronRight size={12} />
                      <span className="text-slate-400">{activeDistrict.name}</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white">{activeDistrict.name}</h1>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">Risk Factor</div>
                      <div className={`text-xl font-bold ${
                        activeDistrict.risk === 'High' ? 'text-red-400' : 
                        activeDistrict.risk === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>{activeDistrict.risk}</div>
                    </div>
                    <div className={`p-3 rounded-xl border ${
                        activeDistrict.risk === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                        activeDistrict.risk === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    }`}>
                      <AlertTriangle size={24} />
                    </div>
                  </div>
                </div>

                {/* KPI GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard 
                    label="Extraction Stage" 
                    value={activeDistrict.metrics.stage.toFixed(1)} 
                    unit="%" 
                    icon={Activity} 
                    color={activeDistrict.metrics.stage > 90 ? 'bg-red-500' : 'bg-blue-500'} 
                    subtext={activeDistrict.metrics.stage > 100 ? "Over-Exploited" : "Sustainable Limit"}
                  />
                  <MetricCard 
                    label="Annual Recharge" 
                    value={(activeDistrict.metrics.recharge / 1000).toFixed(1)} 
                    unit="k Ham" 
                    icon={Droplet} 
                    color="bg-emerald-500" 
                  />
                  <MetricCard 
                    label="Rainfall" 
                    value={activeDistrict.metrics.rainfall || "N/A"} 
                    unit="mm" 
                    icon={Wind} 
                    color="bg-cyan-500" 
                  />
                  <MetricCard 
                    label="Irrigation Usage" 
                    value={(activeDistrict.metrics.extraction_irrigation / 1000).toFixed(1)} 
                    unit="k Ham" 
                    icon={ThermometerSun} 
                    color="bg-amber-500" 
                  />
                </div>

                {/* CHARTS ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* BAR CHART */}
                  <div className="lg:col-span-2 bg-[#14161c] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-white text-sm font-bold mb-6 flex items-center gap-2">
                      <BarChart3 size={16} className="text-blue-500" />
                      Supply vs. Demand Analysis
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: 'Total Recharge', value: activeDistrict.metrics.recharge },
                            { name: 'Irrigation Ext.', value: activeDistrict.metrics.extraction_irrigation },
                            { name: 'Domestic Ext.', value: activeDistrict.metrics.extraction_domestic },
                          ]}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          barSize={40}
                        >
                          <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#475569" fontSize={10} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} tickLine={false} axisLine={false} />
                          <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                            itemStyle={{ color: '#fff', fontSize: '12px' }}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {
                              [0, 1, 2].map((index) => (
                                <Cell key={`cell-${index}`} fill={['#10B981', '#F59E0B', '#3B82F6'][index]} />
                              ))
                            }
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* PIE CHART */}
                  <div className="bg-[#14161c] border border-white/5 rounded-2xl p-6 flex flex-col">
                    <h3 className="text-white text-sm font-bold mb-6">Extraction Split</h3>
                    <div className="flex-1 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Irrigation', value: activeDistrict.metrics.extraction_irrigation, fill: '#F59E0B' },
                                        { name: 'Domestic', value: activeDistrict.metrics.extraction_domestic, fill: '#3B82F6' },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-2xl font-bold text-white">
                                {((activeDistrict.metrics.extraction_irrigation / (activeDistrict.metrics.extraction_irrigation + activeDistrict.metrics.extraction_domestic)) * 100).toFixed(0)}%
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Irrigation</span>
                        </div>
                    </div>
                  </div>
                </div>

                {/* AI INSIGHT SECTION */}
                <div className="bg-gradient-to-r from-blue-900/10 to-purple-900/10 border border-blue-500/10 rounded-2xl p-1">
                    <div className="bg-[#0e1014] rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <BrainCircuit size={18} className="text-purple-500" />
                                AI Strategic Assessment
                            </h3>
                            <button 
                                onClick={() => generateInsight(activeDistrict)}
                                disabled={insightLoading}
                                className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-slate-300 transition-colors disabled:opacity-50"
                            >
                                {insightLoading ? 'Analyzing...' : 'Refresh Analysis'}
                            </button>
                        </div>
                        
                        <div className="min-h-[100px] text-sm text-slate-400 leading-relaxed font-light">
                            {insightLoading ? (
                                <div className="space-y-2 animate-pulse">
                                    <div className="h-2 bg-white/5 rounded w-3/4"></div>
                                    <div className="h-2 bg-white/5 rounded w-full"></div>
                                    <div className="h-2 bg-white/5 rounded w-5/6"></div>
                                </div>
                            ) : (
                                aiInsight ? (
                                    <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: aiInsight }} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-24 text-slate-600">
                                        <p>Click "Refresh Analysis" to generate an AI report for {activeDistrict.name}.</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

              </motion.div>
            ) : (
              /* EMPTY STATE */
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                <LayoutGrid size={64} className="mb-6 text-slate-500" />
                <h3 className="text-xl font-bold text-white">Select a District</h3>
                <p className="text-slate-500 max-w-sm mt-2 text-sm">Choose a region from the menu on the left to view real-time hydro-spatial risk analytics.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default RiskAnalysis;