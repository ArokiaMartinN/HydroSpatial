import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronRight, 
  MapPin, 
  AlertTriangle, 
  Droplet, 
  Wind, 
  Activity,
  CheckCircle2,
  ArrowRight,
  LayoutGrid
} from 'lucide-react';

// --- DATA SIMULATION ---
const generateAreas = (districtName: string, riskLevel: string) => [
  { id: 'a1', name: `${districtName} North Ind. Zone`, type: 'Industrial', risk: riskLevel === 'High' ? 'High' : 'Medium', wqi: 45, gw_level: 'Critical' },
  { id: 'a2', name: `${districtName} Rural Belt`, type: 'Agricultural', risk: 'Medium', wqi: 65, gw_level: 'Moderate' },
  { id: 'a3', name: `${districtName} City Center`, type: 'Urban', risk: riskLevel, wqi: 82, gw_level: 'Low' },
  { id: 'a4', name: `${districtName} Eco Reserve`, type: 'Forest', risk: 'Low', wqi: 95, gw_level: 'Stable' },
];

const indianStates = [
  {
    name: 'Andhra Pradesh',
    risk: 'Medium',
    districts: [
      { name: 'Anantapur', risk: 'High' },
      { name: 'Chittoor', risk: 'Medium' },
      { name: 'East Godavari', risk: 'Low' },
    ]
  },
  {
    name: 'Maharashtra',
    risk: 'High',
    districts: [
      { name: 'Mumbai', risk: 'High' },
      { name: 'Pune', risk: 'Medium' },
      { name: 'Nagpur', risk: 'High' },
      { name: 'Nashik', risk: 'Medium' },
    ]
  },
  {
    name: 'Tamil Nadu',
    risk: 'High',
    districts: [
      { name: 'Chennai', risk: 'High' },
      { name: 'Coimbatore', risk: 'Medium' },
      { name: 'Madurai', risk: 'Medium' },
      { name: 'Salem', risk: 'High' },
    ]
  },
  {
    name: 'Karnataka',
    risk: 'Medium',
    districts: [
      { name: 'Bangalore Urban', risk: 'High' },
      { name: 'Mysore', risk: 'Low' },
      { name: 'Hubli', risk: 'Medium' },
    ]
  },
  {
    name: 'Kerala',
    risk: 'Low',
    districts: [
      { name: 'Trivandrum', risk: 'Low' },
      { name: 'Kochi', risk: 'Medium' },
      { name: 'Wayanad', risk: 'Low' },
    ]
  },
  {
    name: 'Gujarat',
    risk: 'Medium',
    districts: [
      { name: 'Ahmedabad', risk: 'High' },
      { name: 'Surat', risk: 'Medium' },
      { name: 'Vadodara', risk: 'Medium' },
    ]
  },
];

// --- COMPONENT HELPERS ---

const RiskTag = ({ risk }: { risk: string }) => {
  const colors = {
    High: 'bg-red-500 text-white shadow-red-500/40',
    Medium: 'bg-amber-500 text-white shadow-amber-500/40',
    Low: 'bg-emerald-500 text-white shadow-emerald-500/40',
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide shadow-md ${colors[risk as keyof typeof colors]}`}>
      {risk}
    </span>
  );
};

// --- MAIN COMPONENT ---

const MillerColumnsDashboard = () => {
  const [activeState, setActiveState] = useState<any>(null);
  const [activeDistrict, setActiveDistrict] = useState<any>(null);
  const [activeArea, setActiveArea] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleStateSelect = (state: any) => {
    setActiveState(state);
    setActiveDistrict(null);
    setActiveArea(null);
  };

  const handleDistrictSelect = (district: any) => {
    setActiveDistrict(district);
    setActiveArea(null);
  };

  const filteredStates = useMemo(() => {
    return indianStates.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const currentAreas = useMemo(() => {
    if (!activeDistrict) return [];
    return generateAreas(activeDistrict.name, activeDistrict.risk);
  }, [activeDistrict]);

  return (
    // 100vh minus header height (approx) to ensure fit on mobile
    <div className="h-[calc(100vh-4rem)] w-full bg-[#0F1115] text-slate-300 font-sans overflow-hidden flex flex-col">
      
      {/* --- HEADER --- */}
      <header className="h-16 border-b border-white/10 bg-[#161920] flex items-center px-4 md:px-6 justify-between shrink-0 z-20 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
            <LayoutGrid size={20} className="text-white" />
          </div>
          <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">
            Hydro<span className="text-blue-500">Logic</span> Pro
          </h1>
        </div>
        
        {/* Mobile Swipe Hint */}
        <div className="md:hidden text-xs text-blue-400 animate-pulse flex items-center font-semibold">
            Swipe ➔
        </div>
        
        {/* Desktop Search */}
        <div className="relative w-96 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Global Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0F1115] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Desktop Legend */}
        <div className="hidden md:flex items-center space-x-4 text-xs font-medium">
          <div className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>Critical</div>
          <div className="flex items-center"><span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>Warning</div>
          <div className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>Stable</div>
        </div>
      </header>

      {/* --- MILLER COLUMNS LAYOUT (Swipeable on Mobile) --- */}
      {/* 'snap-x snap-mandatory' enables the swipe behavior */}
      <div className="flex-1 flex overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory">
        
        {/* COLUMN 1: STATES */}
        {/* min-w-full on mobile, w-80 on desktop */}
        <div className="w-full min-w-full md:w-80 md:min-w-[320px] border-r border-white/5 bg-[#161920] flex flex-col snap-center shrink-0">
          <div className="p-4 border-b border-white/5 sticky top-0 bg-[#161920] z-10">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Step 1</h3>
            <h2 className="text-lg font-semibold text-white">Select State</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 pb-20">
            {filteredStates.map(state => (
              <motion.button
                key={state.name}
                onClick={() => handleStateSelect(state)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                  activeState?.name === state.name 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="font-medium">{state.name}</span>
                {activeState?.name === state.name ? <ChevronRight size={16} /> : <RiskTag risk={state.risk} />}
              </motion.button>
            ))}
          </div>
        </div>

        {/* COLUMN 2: DISTRICTS */}
        <AnimatePresence mode="popLayout">
          {activeState && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full min-w-full md:w-80 md:min-w-[320px] border-r border-white/5 bg-[#12141a] flex flex-col snap-center shrink-0"
            >
              <div className="p-4 border-b border-white/5 sticky top-0 bg-[#12141a] z-10">
                <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Step 2</h3>
                <h2 className="text-lg font-semibold text-white">Select District</h2>
                <p className="text-xs text-slate-500 mt-1">In {activeState.name}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1 pb-20">
                {activeState.districts.map((district: any) => (
                  <motion.button
                    key={district.name}
                    onClick={() => handleDistrictSelect(district)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                      activeDistrict?.name === district.name 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                        : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-medium">{district.name}</span>
                    {activeDistrict?.name === district.name ? <ChevronRight size={16} /> : <RiskTag risk={district.risk} />}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COLUMN 3: AREAS */}
        <AnimatePresence mode="popLayout">
          {activeDistrict && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full min-w-full md:w-80 md:min-w-[320px] border-r border-white/5 bg-[#0F1115] flex flex-col snap-center shrink-0"
            >
              <div className="p-4 border-b border-white/5 sticky top-0 bg-[#0F1115] z-10">
                <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Step 3</h3>
                <h2 className="text-lg font-semibold text-white">Select Area</h2>
                <p className="text-xs text-slate-500 mt-1">Zones in {activeDistrict.name}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1 pb-20">
                {currentAreas.map((area) => (
                  <motion.button
                    key={area.id}
                    onClick={() => setActiveArea(area)}
                    className={`w-full p-4 rounded-xl text-left transition-all border mb-2 ${
                      activeArea?.id === area.id
                        ? 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-500 text-white shadow-xl'
                        : 'bg-[#1A1D24] border-white/5 text-slate-400 hover:border-white/20 hover:bg-[#20242C]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono opacity-70">{area.type}</span>
                      {activeArea?.id === area.id && <CheckCircle2 size={16} className="text-white" />}
                    </div>
                    <div className="font-bold text-lg leading-tight mb-1">{area.name}</div>
                    <div className="flex items-center space-x-2 text-xs mt-3">
                        <span className={`w-2 h-2 rounded-full ${area.risk === 'High' ? 'bg-red-400' : area.risk === 'Medium' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                        <span>Risk Level: {area.risk}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COLUMN 4: RESULT DASHBOARD */}
        <AnimatePresence mode="popLayout">
          {activeArea ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full min-w-full md:flex-1 md:min-w-[500px] bg-[#0F1115] p-4 md:p-8 overflow-y-auto snap-center shrink-0 pb-20"
            >
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-wrap items-center space-x-2 text-blue-500 mb-6 text-sm font-medium">
                  <span>{activeState.name}</span>
                  <ArrowRight size={14} />
                  <span>{activeDistrict.name}</span>
                  <ArrowRight size={14} />
                  <span className="text-white">{activeArea.name}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{activeArea.name}</h1>
                        <p className="text-slate-400">Detailed hydro-spatial report generated just now.</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full border text-center self-start ${
                        activeArea.risk === 'High' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 
                        activeArea.risk === 'Medium' ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 
                        'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                    }`}>
                        <span className="flex items-center font-bold tracking-wide text-sm">
                            {activeArea.risk === 'High' && <AlertTriangle size={16} className="mr-2" />}
                            {activeArea.risk} RISK
                        </span>
                    </div>
                </div>

                {/* GRID METRICS - Stack on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                    {/* Water Quality Card */}
                    <div className="bg-[#161920] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Droplet size={80} />
                        </div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Water Quality Index</p>
                        <div className="text-4xl font-mono font-bold text-white">{activeArea.wqi}<span className="text-lg text-slate-600">/100</span></div>
                        <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[82%]" />
                        </div>
                    </div>

                    {/* Groundwater Level Card */}
                    <div className="bg-[#161920] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity size={80} />
                        </div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Groundwater Level</p>
                        <div className="text-2xl font-bold text-white mt-2">{activeArea.gw_level}</div>
                        <p className="text-xs text-red-400 mt-2 flex items-center">
                            <ArrowRight size={12} className="rotate-45 mr-1" /> Dropping 2% annually
                        </p>
                    </div>

                    {/* Rainfall Card */}
                    <div className="bg-[#161920] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Wind size={80} />
                        </div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Rainfall Deficit</p>
                        <div className="text-4xl font-mono font-bold text-white">12<span className="text-lg text-slate-600">%</span></div>
                        <p className="text-xs text-emerald-400 mt-2">Better than last year</p>
                    </div>
                </div>

                {/* RECOMMENDATIONS */}
                <div className="bg-[#161920] rounded-2xl border border-white/5 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">AI Recommendations</h3>
                    <ul className="space-y-3">
                        {[
                            "Implement rainwater harvesting in the northern sector.",
                            "Restrict industrial groundwater extraction during summer months.",
                            "Deploy real-time IoT sensors for daily monitoring."
                        ].map((rec, i) => (
                            <li key={i} className="flex items-start text-slate-400 text-sm">
                                <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-bold mr-3 shrink-0">{i+1}</span>
                                {rec}
                            </li>
                        ))}
                    </ul>
                </div>

              </div>
            </motion.div>
          ) : (
            /* EMPTY STATE FOR RESULT PANE - Hidden on mobile until selected */
            <div className="hidden md:flex flex-1 min-w-[500px] bg-[#0C0E12] flex-col items-center justify-center text-slate-600 p-12 text-center border-l border-white/5">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
                    <MapPin size={48} opacity={0.5} />
                </div>
                <h2 className="text-2xl font-bold text-slate-500 mb-2">Awaiting Selection</h2>
                <p className="max-w-sm">Please select an Area from the previous column to generate a detailed risk analysis report.</p>
            </div>
          )}
        </AnimatePresence>

      </div>
      
      {/* CSS to hide scrollbar but keep functionality */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MillerColumnsDashboard;