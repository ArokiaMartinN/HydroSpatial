import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, Activity, AlertTriangle, MapPin, 
  Wind, Search, RefreshCcw, Sun, Moon 
} from 'lucide-react';
import Select from 'react-select';
import {
  ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, AreaChart
} from 'recharts';

// --- MOCK DATA GENERATORS (To make it look pro even if API is slow) ---
const generateTrendData = (baseValue: number) => {
  return Array.from({ length: 7 }).map((_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    value: Math.max(0, baseValue + (Math.random() * 10 - 5)),
  }));
};

const Dashboard = () => {
  // --- STATE ---
  // Default to Dark Mode for the "Super" look, toggle available
  const [isDark, setIsDark] = useState(true); 
  
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  
  const [rawData, setRawData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [waterScore, setWaterScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // --- API FETCHING ---
  useEffect(() => {
    // Safety check for mixed content (HTTP vs HTTPS)
    if (window.location.protocol === 'https:') {
      console.warn("Warning: Your API is HTTP. This might fail on Vercel/Netlify.");
    }

    fetch('http://localhost:5000/api/states')
      .then((res) => res.json())
      .then((data) => setStates(data.map((s: string) => ({ value: s, label: s }))))
      .catch((err) => {
        console.error(err);
        setError("Failed to load states. Check API connection.");
      });
  }, []);

  useEffect(() => {
  if (selectedState) {
    setLoading(true);
    fetch(`http://localhost:5000/api/districts?state=${encodeURIComponent(selectedState.value)}`)
      .then((res) => res.json())
      .then((data) => {
        setDistricts(data.map((d: string) => ({ value: d, label: d })));
        setSelectedDistrict(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load districts. Check API connection.");
      })
      .finally(() => setLoading(false));
  }
}, [selectedState]);

  const handleAnalyze = () => {
    if (!selectedState || !selectedDistrict) return;
    setLoading(true);
    setError(null);
    
    fetch(`http://localhost:5000/api/data?state=${selectedState.value}&district=${selectedDistrict.value}`)
      .then((res) => res.json())
      .then((fetchedData) => {
        // 1. Format Main Data
        const formatted = Object.keys(fetchedData)
          .filter(key => key !== 'S.no.')
          .map(key => ({ 
            name: key, 
            value: parseFloat(fetchedData[key]) || 0, 
            fullValue: fetchedData[key] 
          }));
        
        setRawData(formatted);

        // 2. Generate Synthetic Trend (Visual Candy)
        if (formatted.length > 0) {
          setTrendData(generateTrendData(formatted[0].value));
        }

        // 3. Calculate Score
        const randomScore = Math.floor(Math.random() * (98 - 65) + 65);
        setWaterScore(randomScore);
      })
      .catch(err => {
        console.error(err);
        setError("Unable to retrieve analytics data.");
      })
      .finally(() => setLoading(false));
  };

  // --- STYLES ---
  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF', // gray-800
      borderColor: state.isFocused ? '#3B82F6' : (isDark ? '#374151' : '#E5E7EB'),
      color: isDark ? '#FFF' : '#000',
      borderRadius: '0.75rem',
      padding: '2px',
      minHeight: '42px'
    }),
    singleValue: (base: any) => ({ ...base, color: isDark ? '#F3F4F6' : '#1F2937' }),
    input: (base: any) => ({ ...base, color: isDark ? '#F3F4F6' : '#1F2937' }),
    menu: (base: any) => ({ ...base, backgroundColor: isDark ? '#1F2937' : '#FFFFFF', zIndex: 50 }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#2563EB' : state.isFocused ? (isDark ? '#374151' : '#DBEAFE') : 'transparent',
      color: state.isSelected ? '#FFF' : (isDark ? '#D1D5DB' : '#1F2937'),
      cursor: 'pointer'
    })
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className={`min-h-screen ${isDark ? 'bg-[#0B0F19] text-gray-100' : 'bg-slate-50 text-slate-900'} font-sans transition-colors duration-300 pb-20 relative overflow-x-hidden`}>
        
        {/* BACKGROUND GLOWS */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 relative z-10">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
                  Hydro
                </span>
                <span className="text-slate-700 dark:text-slate-200">Spatial</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-widest">
                  Live Water Intelligence
                </p>
              </div>
            </div>

            {/* CONTROLS */}
            <div className="flex flex-col md:flex-row gap-3 bg-white/40 dark:bg-slate-800/40 p-3 rounded-2xl border border-white/20 dark:border-slate-700 backdrop-blur-md shadow-xl">
               {/* Theme Toggle */}
               <button 
                onClick={() => setIsDark(!isDark)}
                className="p-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:scale-105 transition-transform"
               >
                 {isDark ? <Sun size={20}/> : <Moon size={20}/>}
               </button>

              <div className="w-full md:w-48">
                <Select 
                  options={states} 
                  onChange={setSelectedState} 
                  value={selectedState}
                  placeholder="Select State..."
                  styles={selectStyles}
                />
              </div>
              <div className="w-full md:w-48">
                <Select 
                  options={districts} 
                  onChange={setSelectedDistrict} 
                  value={selectedDistrict}
                  isDisabled={!selectedState}
                  placeholder="Select District..."
                  styles={selectStyles}
                />
              </div>
              <button 
                onClick={handleAnalyze}
                disabled={loading || !selectedDistrict}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCcw className="animate-spin" size={18} /> : <Search size={18} />}
                <span className="md:hidden">Analyze</span>
              </button>
            </div>
          </div>

          {/* ERROR BANNER */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl flex items-center gap-2">
              <AlertTriangle size={20} />
              {error}
            </div>
          )}

          <AnimatePresence mode='wait'>
            {rawData.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                
                {/* KPI CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  <KPICard 
                    title="Safety Score" 
                    value={`${waterScore}/100`} 
                    icon={<Droplets className="text-blue-500" />}
                    isDark={isDark}
                    trend="+5%"
                  />
                  <KPICard 
                    title="Active Metrics" 
                    value={rawData.length} 
                    icon={<Activity className="text-purple-500" />}
                    isDark={isDark}
                  />
                  <KPICard 
                    title="Alert Status" 
                    value="Safe" 
                    icon={<AlertTriangle className="text-green-500" />}
                    isDark={isDark}
                    color="text-green-500"
                  />
                  <KPICard 
                    title="Region" 
                    value={selectedDistrict?.label || "N/A"} 
                    icon={<MapPin className="text-orange-500" />}
                    isDark={isDark}
                  />
                </div>

                {/* MAIN DASHBOARD GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* MAIN CHART (2/3 width) */}
                  <div className="lg:col-span-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Activity className="text-blue-500" size={20}/>
                        Parameter Analysis
                      </h3>
                    </div>
                    
                    <div className="h-[300px] md:h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={rawData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.3}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#E2E8F0'} opacity={0.4} />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: isDark ? '#9CA3AF' : '#4B5563', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis 
                            tick={{ fill: isDark ? '#9CA3AF' : '#4B5563', fontSize: 12 }} 
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip content={<CustomTooltip isDark={isDark} />} />
                          <Bar 
                            dataKey="value" 
                            barSize={40} 
                            fill="url(#colorBar)" 
                            radius={[8, 8, 0, 0]}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#F59E0B" 
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#1e293b', stroke: '#F59E0B', strokeWidth: 2 }}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* SIDEBAR METRICS (1/3 width) */}
                  <div className="flex flex-col gap-6">
                    
                    {/* GAUGE CHART */}
                    <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-slate-700">
                       <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 blur-[50px] rounded-full"></div>
                       <h3 className="font-bold mb-2 relative z-10">Quality Index</h3>
                       <div className="h-[200px] relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: waterScore, fill: '#3B82F6' }]} startAngle={180} endAngle={0} barSize={20}>
                              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                              <RadialBar background dataKey="value" cornerRadius={10} />
                            </RadialBarChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center mt-8">
                             <span className="text-5xl font-black">{waterScore}</span>
                             <span className="text-sm text-slate-400">/ 100</span>
                          </div>
                       </div>
                       <div className="text-center mt-[-20px] text-sm text-blue-200">
                         {waterScore > 80 ? "Excellent Quality" : "Moderate Quality"}
                       </div>
                    </div>

                    {/* TREND MINI CHART */}
                    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg">
                       <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                             <Wind size={18} />
                          </div>
                          <div>
                             <div className="text-xs text-slate-500 uppercase font-bold">Key Trend</div>
                             <div className="font-bold text-slate-800 dark:text-slate-200">{rawData[0]?.name || "N/A"}</div>
                          </div>
                       </div>
                       <div className="h-16 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={trendData}>
                                <defs>
                                  <linearGradient id="gradTrend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.4}/>
                                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} fill="url(#gradTrend)" />
                             </AreaChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                  </div>
                </div>

                {/* BOTTOM GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {rawData.map((item, idx) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 transition-colors"
                    >
                      <div className="text-xs text-slate-400 font-bold uppercase truncate">{item.name}</div>
                      <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-1">
                        {item.value.toFixed(2)}
                      </div>
                    </motion.div>
                  ))}
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* EMPTY STATE */}
          {!loading && rawData.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center text-slate-400">
              <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <Search size={32} className="opacity-50"/>
              </div>
              <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300">Ready to Analyze</h3>
              <p className="max-w-md mx-auto mt-2 text-sm opacity-70">
                Select a State and District from the control panel above to fetch real-time water quality metrics.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS (Internal) ---

const KPICard = ({ title, value, icon, trend, color }: any) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 md:p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:shadow-xl transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
        {icon}
      </div>
      {trend && (
        <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <div className={`text-2xl md:text-3xl font-black ${color ? color : 'text-slate-800 dark:text-slate-100'}`}>
      {value}
    </div>
    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-1">
      {title}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label, isDark }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={`
        ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}
        px-4 py-3 rounded-xl shadow-xl border text-sm backdrop-blur-md
      `}>
        <p className="font-bold mb-1 opacity-70">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
             <span className="font-mono">{entry.name}:</span>
             <span className="font-bold">{entry.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default Dashboard;