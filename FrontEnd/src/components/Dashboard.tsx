import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  Activity, 
  BarChartHorizontal, 
  Droplets, 
  Eye, 
  Moon, 
  Sun,
  TrendingDown, 
  TrendingUp,
  Sliders,
  AreaChart as AreaChartIcon
} from 'lucide-react';
import Select, { StylesConfig } from 'react-select';
import {
  BarChart, Bar, RadialBarChart, RadialBar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, TooltipProps, AreaChart, Area, CartesianGrid
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';


// --- TYPE DEFINITIONS ---
type Theme = 'light' | 'dark';

// --- THEME & STYLE CONFIGURATION ---
const THEME_COLORS = {
  light: {
    bg: 'bg-gray-100',
    contentBg: 'bg-white',
    textPrimary: 'text-gray-800',
    textSecondary: 'text-gray-500',
    border: 'border-gray-200',
    chartStroke: '#6b7280',
    brand: '#2563eb', // blue-600
    brandFaded: '#dbeafe', // blue-100
    gradientFrom: '#3b82f6',
    gradientTo: '#60a5fa',
  },
  dark: {
    bg: 'bg-gray-900',
    contentBg: 'bg-gray-800',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-400',
    border: 'border-gray-700',
    chartStroke: '#9ca3af',
    brand: '#60a5fa', // blue-400
    brandFaded: 'bg-blue-500/20',
    gradientFrom: '#60a5fa',
    gradientTo: '#93c5fd',
  }
};

const getSuperSelectStyles = (theme: Theme): StylesConfig => ({
  control: (provided) => ({
    ...provided,
    backgroundColor: theme === 'light' ? '#f3f4f6' : '#1f2937',
    borderColor: theme === 'light' ? '#d1d5db' : '#4b5563',
    borderRadius: '0.5rem',
    boxShadow: 'none',
    '&:hover': { borderColor: THEME_COLORS[theme].brand },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: theme === 'light' ? 'white' : '#1f2937',
    border: `1px solid ${theme === 'light' ? '#e5e7eb' : '#4b5563'}`,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? THEME_COLORS[theme].brand : state.isFocused ? (theme === 'light' ? '#eff6ff' : '#374151') : 'transparent',
    color: state.isSelected ? 'white' : THEME_COLORS[theme].textPrimary,
  }),
  singleValue: (provided) => ({ ...provided, color: THEME_COLORS[theme].textPrimary }),
  placeholder: (provided) => ({ ...provided, color: THEME_COLORS[theme].textSecondary }),
});

// --- SUPERCHARGED SUB-COMPONENTS ---

const SuperStatCard = ({ title, value, change, icon, onClick, isHighlighted, theme }: { title: string, value: string, change: number, icon: React.ReactNode, onClick: () => void, isHighlighted: boolean, theme: Theme }) => {
  const tc = THEME_COLORS[theme];
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.05, boxShadow: `0px 0px 12px ${tc.brand}50` }}
      className={`${tc.contentBg} p-5 rounded-xl border ${isHighlighted ? `border-blue-500` : tc.border} transition-all duration-300 cursor-pointer`}
    >
      <div className={`flex items-center justify-between mb-2 ${tc.textSecondary}`}>
        <p className="text-sm">{title}</p>
        {icon}
      </div>
      <p className={`text-3xl font-bold ${tc.textPrimary} mb-2`}>{value}</p>
      <div className="flex items-center text-sm">
        <span className={`flex items-center mr-2 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change >= 0 ? <TrendingUp size={16} className="mr-1"/> : <TrendingDown size={16} className="mr-1"/>}
          {Math.abs(change)}%
        </span>
        <span className={tc.textSecondary}>vs last month</span>
      </div>
    </motion.div>
  );
}

const SuperChartCard = ({ title, children, isHighlighted, theme }: { title: string, children: React.ReactNode, isHighlighted: boolean, theme: Theme }) => {
  const tc = THEME_COLORS[theme];
  return (
    <motion.div layout className={`${tc.contentBg} p-6 rounded-xl border ${isHighlighted ? `border-blue-500` : tc.border} transition-all duration-300`}>
      <h4 className={`text-xl font-semibold ${tc.textPrimary} mb-4`}>{title}</h4>
      <div style={{ width: '100%', height: 350 }}>{children}</div>
    </motion.div>
  );
}

const SuperCustomTooltip = ({ active, payload, label, theme }: TooltipProps<ValueType, NameType> & { theme: Theme }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`p-4 rounded-lg border shadow-xl backdrop-blur-sm ${theme === 'light' ? 'bg-white/80 border-gray-200' : 'bg-gray-900/80 border-gray-600'}`}>
        <p className={`text-base font-bold mb-2 ${THEME_COLORS[theme].textPrimary}`}>{label || payload[0].payload.name}</p>
        {payload.map((pld, index) => (
          <div key={index} className="text-sm" style={{ color: pld.color || THEME_COLORS[theme].brand }}>
            {`${pld.name}: ${pld.value}`}
          </div>
        ))}
      </div>
    );
  }
  return null;
};


// --- THE ULTIMATE SUPER DASHBOARD COMPONENT ---
const Dashboard = () => {
  // --- STATE MANAGEMENT ---
  const [theme, setTheme] = useState<Theme>('dark');
  const [data, setData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [highlightedMetric, setHighlightedMetric] = useState<string | null>(null);
  const controls = useAnimation();

  // --- THEME TOGGLE LOGIC ---
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // --- DATA FETCHING & MOCKING ---
  useEffect(() => {
    // Mock fetch for states
    setStates(["Andhra Pradesh", "Maharashtra", "Tamil Nadu", "Rajasthan"].map(s => ({ value: s, label: s })));
  }, []);

  useEffect(() => {
    if (selectedState) {
      setLoading(true);
      setTimeout(() => {
        const mockDistricts = { "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"], "Maharashtra": ["Mumbai", "Pune", "Nagpur"], "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur"], "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"] };
        setDistricts(mockDistricts[selectedState.value]?.map(d => ({ value: d, label: d })) || []);
        setLoading(false);
      }, 500);
    }
  }, [selectedState]);

  const fetchData = () => {
    if (!selectedState || !selectedDistrict) {
      setError('Please select both a state and a district.');
      return;
    }
    setLoading(true);
    setError(null);
    setHighlightedMetric(null);
    
    // Animate out old data
    controls.start({ opacity: 0, y: 20 }).then(() => {
      // Mock data generation
      setTimeout(() => {
        const newData = {
          'Rechargeable GW Resource': parseFloat((Math.random() * 20 + 5).toFixed(2)),
          'GW Abstraction for Irrigation': parseFloat((Math.random() * 15 + 3).toFixed(2)),
          'GW Abstraction for Industrial Use': parseFloat((Math.random() * 5 + 1).toFixed(2)),
          'Total GW Abstraction': parseFloat((Math.random() * 25 + 10).toFixed(2)),
          'Stage of GW Abstraction': parseFloat((Math.random() * 80 + 20).toFixed(2)),
        };
        const newHistoricalData = Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
          level: parseFloat((Math.random() * 10 + 60 - i * 2).toFixed(2)), // Simulates a trend
        }));
        setData(newData);
        setHistoricalData(newHistoricalData);
        setLoading(false);
        // Animate in new data
        controls.start({ opacity: 1, y: 0 });
      }, 1000);
    });
  };

  const tc = THEME_COLORS[theme];
  const barChartData = data ? [ { name: 'Rechargeable', value: data['Rechargeable GW Resource'] }, { name: 'Irrigation Use', value: data['GW Abstraction for Irrigation'] }, { name: 'Industrial Use', value: data['GW Abstraction for Industrial Use'] }, { name: 'Total Use', value: data['Total GW Abstraction'] }] : [];
  const radialChartData = data ? [{ name: 'Stage', value: data['Stage of GW Abstraction'] }] : [];
  
  return (
    <div className={`min-h-screen ${tc.bg} ${tc.textPrimary} font-sans flex transition-colors duration-500`}>
      {/* --- SIDEBAR --- */}
      <aside className={`w-64 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-6 flex-shrink-0 hidden lg:flex flex-col justify-between transition-colors duration-500`}>
        <div>
          <div className="flex items-center mb-10">
            <Droplets className="text-blue-500" size={32} />
            <h1 className={`text-2xl font-bold ${tc.textPrimary} ml-3`}>HydroDash</h1>
          </div>
          <nav className="space-y-2">
            <a href="#" className={`flex items-center px-4 py-3 rounded-lg ${theme === 'light' ? 'text-white bg-blue-600' : 'text-white bg-blue-500/30'}`}><BarChartHorizontal size={20} className="mr-3"/>Dashboard</a>
            <a href="#" className={`flex items-center px-4 py-3 rounded-lg ${tc.textSecondary} hover:${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}><Sliders size={20} className="mr-3"/>Filters</a>
            <a href="#" className={`flex items-center px-4 py-3 rounded-lg ${tc.textSecondary} hover:${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}><AreaChartIcon size={20} className="mr-3"/>Reports</a>
          </nav>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* --- HEADER --- */}
        <header className="flex items-center justify-between mb-8">
            <div>
                <h2 className={`text-3xl font-bold ${tc.textPrimary}`}>Analytics Dashboard</h2>
                <p className={tc.textSecondary}>Real-time water resource overview.</p>
            </div>
            <div className="flex items-center space-x-4">
                <motion.button onClick={toggleTheme} whileTap={{ scale: 0.9 }} className={`p-2 rounded-full ${tc.textSecondary} hover:${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div key={theme} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
                      {theme === 'light' ? <Moon/> : <Sun/>}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
                <div className={`w-10 h-10 ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-yellow-400 text-gray-800'} rounded-full flex items-center justify-center font-bold`}>U</div>
            </div>
        </header>

        {/* --- CONTROL PANEL --- */}
        <div className={`p-4 ${theme === 'light' ? 'bg-white/70' : 'bg-gray-800/50'} backdrop-blur-sm rounded-xl border ${tc.border} mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
            <Select className="lg:col-span-2" options={states} value={selectedState} onChange={(opt) => { setSelectedState(opt); setSelectedDistrict(null); setData(null); }} styles={getSuperSelectStyles(theme)} placeholder="1. Select State..." />
            <Select className="lg:col-span-2" options={districts} value={selectedDistrict} onChange={setSelectedDistrict} styles={getSuperSelectStyles(theme)} placeholder="2. Select District..." isDisabled={!selectedState || loading} />
            <motion.button onClick={fetchData} disabled={!selectedDistrict || loading} whileTap={{ scale: 0.95 }} className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed">
              {loading ? 'Analyzing...' : 'Analyze'}
            </motion.button>
          </div>
        </div>
        
        {/* --- DATA DISPLAY AREA --- */}
        <AnimatePresence>
          {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-red-500">{error}</motion.p>}
        </AnimatePresence>
        <motion.div animate={controls}>
          {data && (
            <motion.div key={selectedDistrict?.value} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.07 }}>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <SuperStatCard theme={theme} title="Rechargeable Resource" value={`${data['Rechargeable GW Resource']} BCM`} change={5.2} icon={<Droplets/>} onClick={() => setHighlightedMetric('Resource')} isHighlighted={highlightedMetric === 'Resource'}/>
                <SuperStatCard theme={theme} title="Total Abstraction" value={`${data['Total GW Abstraction']} BCM`} change={-1.8} icon={<Activity/>} onClick={() => setHighlightedMetric('Abstraction')} isHighlighted={highlightedMetric === 'Abstraction'}/>
                <SuperStatCard theme={theme} title="Stage of Abstraction" value={`${data['Stage of GW Abstraction']}%`} change={2.5} icon={<Eye/>} onClick={() => setHighlightedMetric('Stage')} isHighlighted={highlightedMetric === 'Stage'}/>
                <SuperStatCard theme={theme} title="Historical Trend" value={'View Chart'} change={-3.1} icon={<AreaChartIcon/>} onClick={() => setHighlightedMetric('Historical')} isHighlighted={highlightedMetric === 'Historical'}/>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                  <SuperChartCard theme={theme} title="Groundwater Usage Comparison (BCM)" isHighlighted={highlightedMetric === 'Resource' || highlightedMetric === 'Abstraction'}>
                     <ResponsiveContainer><BarChart data={barChartData} layout="vertical"><defs><linearGradient id="superGradient" x1="0" y1="0" x2="1" y2="0"><stop offset="5%" stopColor={tc.gradientFrom} /><stop offset="95%" stopColor={tc.gradientTo} /></linearGradient></defs><XAxis type="number" stroke={tc.chartStroke} /><YAxis type="category" dataKey="name" stroke={tc.chartStroke} width={100} /><Tooltip content={<SuperCustomTooltip theme={theme} />} cursor={{ fill: `${tc.brand}20` }} /><Bar dataKey="value" name="Billion Cubic Meters" fill="url(#superGradient)" radius={[0, 10, 10, 0]} animationDuration={1000} /></BarChart></ResponsiveContainer>
                  </SuperChartCard>
                </div>
                <div className="lg:col-span-2">
                  <SuperChartCard theme={theme} title="Stage of Abstraction" isHighlighted={highlightedMetric === 'Stage'}>
                    <ResponsiveContainer><RadialBarChart innerRadius="65%" data={radialChartData} startAngle={180} endAngle={0}><RadialBar background dataKey="value" cornerRadius={15} fill={tc.brand} animationDuration={1500} /><Legend iconSize={0} content={() => <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${tc.textPrimary} text-4xl font-bold`}>{`${data['Stage of GW Abstraction']}%`}</span>}/><Tooltip content={<SuperCustomTooltip theme={theme}/>} /></RadialBarChart></ResponsiveContainer>
                  </SuperChartCard>
                </div>
                <div className="lg:col-span-5">
                   <SuperChartCard theme={theme} title="Historical Water Levels (Last 12 Months)" isHighlighted={highlightedMetric === 'Historical'}>
                      <ResponsiveContainer><AreaChart data={historicalData}><defs><linearGradient id="historicalGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={tc.brand} stopOpacity={0.8}/><stop offset="95%" stopColor={tc.brand} stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke={tc.border} strokeDasharray="3 3" /><XAxis dataKey="month" stroke={tc.chartStroke} /><YAxis stroke={tc.chartStroke} /><Tooltip content={<SuperCustomTooltip theme={theme} />} /><Area type="monotone" dataKey="level" name="Water Level (m)" stroke={tc.brand} fill="url(#historicalGradient)" strokeWidth={2} animationDuration={1000} /></AreaChart></ResponsiveContainer>
                   </SuperChartCard>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;