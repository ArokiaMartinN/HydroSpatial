import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Map, MapPin, BarChart2, Droplet, ShieldAlert, ShieldCheck, Shield, CloudDrizzle, Thermometer, TrendingUp, Users, AlertTriangle, ChevronsLeft, ChevronsRight, PieChart, Dot } from 'lucide-react';
import { ResponsiveContainer, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

// --- DATA & INTERFACES (UNCHANGED) ---
const waterUsageData = [
  { name: 'Agriculture', usage: 410, fill: '#6366f1' },
  { name: 'Industrial', usage: 150, fill: '#818cf8' },
  { name: 'Domestic', usage: 90, fill: '#a5b4fc' },
  { name: 'Energy', usage: 50, fill: '#c7d2fe' },
];
interface DistrictPart { name: string; risk: 'High' | 'Medium' | 'Low'; details: string; }
interface District { name: string; risk: 'High' | 'Medium' | 'Low'; parts: DistrictPart[]; annualRainfall?: number | string; groundwaterStage?: number | string; }
interface IndianState { name: string; risk: 'High' | 'Medium' | 'Low'; districts: District[]; }
const indianStates: IndianState[] = [
    {
    name: 'Tamil Nadu', risk: 'High', districts: [
      { name: 'Chennai', risk: 'High', annualRainfall: 1400.4, groundwaterStage: 94.94, parts: [{ name: 'North Chennai', risk: 'High', details: 'Severe water scarcity and industrial pollution.' }, { name: 'Central Chennai', risk: 'High', details: 'Dense population and aging infrastructure.' },]},
      { name: 'Coimbatore', risk: 'Medium', annualRainfall: 713.4, groundwaterStage: 80.93, parts: [{ name: 'Coimbatore City', risk: 'Medium', details: 'Growing industrial and domestic water demand.' },]},
    ]
  },
  {
    name: 'Maharashtra', risk: 'High', districts: [
      { name: 'Mumbai', risk: 'High', annualRainfall: "N/A", groundwaterStage: "N/A", parts: [{ name: 'Island City', risk: 'High', details: 'Extremely high population density.' },]},
      { name: 'Pune', risk: 'Medium', annualRainfall: 721.5, groundwaterStage: 61.38, parts: [{ name: 'Pune Metro Region', risk: 'High', details: 'IT and industrial boom leading to water stress.' },]},
      { name: 'Aurangabad', risk: 'High', annualRainfall: 692.4, groundwaterStage: 75.33, parts: [{ name: 'Aurangabad City', risk: 'High', details: 'Located in rain shadow region, chronic shortages.'},]},
    ]
  },
  {
    name: 'Karnataka', risk: 'Medium', districts: [
      { name: 'Bangalore Urban', risk: 'High', annualRainfall: 979.8, groundwaterStage: 138.83, parts: [{ name: 'East Bangalore (IT Hub)', risk: 'High', details: 'Severe groundwater depletion.' },]},
      { name: 'Mysore', risk: 'Low', annualRainfall: 804.5, groundwaterStage: 73.95, parts: [{ name: 'Mysore City', risk: 'Low', details: 'Well-managed water resources from Kaveri river.' },]},
      { name: 'Dakshina Kannada', risk: 'Low', annualRainfall: 3933.4, groundwaterStage: 16.96, parts: [{ name: 'Mangalore', risk: 'Low', details: 'High rainfall and abundant water.'},]},
    ]
  },
  {
    name: 'Rajasthan', risk: 'High', districts: [
      { name: 'Jaipur', risk: 'High', annualRainfall: 556.7, groundwaterStage: 136.93, parts: [{ name: 'Walled City', risk: 'High', details: 'Aging pipelines and high population density.'},]},
      { name: 'Jodhpur', risk: 'High', annualRainfall: 360.7, groundwaterStage: 147.21, parts: [{ name: 'Jodhpur City', risk: 'High', details: 'Chronic water shortages in arid zone.'},]},
      { name: 'Udaipur', risk: 'Medium', annualRainfall: 668.5, groundwaterStage: 58.55, parts: [{ name: 'Udaipur City', risk: 'Medium', details: 'Lake system dependent on monsoon.'},]},
    ]
  },
];

// --- STYLING & UI HELPERS ---
const getRiskStyles = (risk: 'High' | 'Medium' | 'Low') => {
  switch (risk) {
    case 'High': return { bg: 'bg-red-500', text: 'text-red-100', border: 'border-red-500', icon: 'text-red-500' };
    case 'Medium': return { bg: 'bg-yellow-500', text: 'text-yellow-100', border: 'border-yellow-500', icon: 'text-yellow-500' };
    default: return { bg: 'bg-green-500', text: 'text-green-100', border: 'border-green-500', icon: 'text-green-500' };
  }
};

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-5 rounded-lg border border-gray-200">
    <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
  </div>
);

const WaterUsageChart: React.FC = () => (
    <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={waterUsageData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={{stroke: '#e2e8f0'}} />
                <YAxis fontSize={12} tickLine={false} axisLine={{stroke: '#e2e8f0'}} />
                <Tooltip cursor={{fill: 'rgba(238, 242, 255, 0.8)'}} contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}/>
                <Bar dataKey="usage" name="Usage (BCM)" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
        </ResponsiveContainer>
    </div>
);


// --- MAIN PROFESSIONAL DASHBOARD COMPONENT ---
const ProfessionalDashboard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState<IndianState | null>(indianStates[0]);
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(indianStates[0].districts[0]);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');

    const filteredStates = useMemo(() =>
        indianStates.filter(state => state.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm, indianStates]);

    const handleStateSelect = (state: IndianState) => {
        setSelectedState(state);
        setSelectedDistrict(state.districts[0] || null);
        setActiveTab('Overview');
    };
    
    const AnalysisTabs = ['Overview', 'Environmental Data', 'Sub-Regions'];

    return (
        <div className="flex h-screen w-full bg-gray-50 text-gray-800">
            {/* --- COLLAPSIBLE SIDEBAR --- */}
            <motion.div
                animate={{ width: isSidebarCollapsed ? '80px' : '320px' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex-shrink-0 bg-white border-r border-gray-200 flex flex-col"
            >
                <div className={`flex items-center justify-between p-4 border-b border-gray-200 ${isSidebarCollapsed ? 'px-4' : 'px-6'}`}>
                    {!isSidebarCollapsed && <h2 className="font-bold text-lg text-indigo-600 flex items-center gap-2"><Droplet /> Water Watch</h2>}
                    <button onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="p-2 rounded-md hover:bg-gray-100">
                        {isSidebarCollapsed ? <ChevronsRight size={20}/> : <ChevronsLeft size={20}/>}
                    </button>
                </div>

                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder={isSidebarCollapsed ? '' : "Search states..."}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto px-4 space-y-2">
                    {filteredStates.map(state => {
                        const riskStyles = getRiskStyles(state.risk);
                        return (
                            <div
                                key={state.name}
                                onClick={() => handleStateSelect(state)}
                                className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${selectedState?.name === state.name ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-100'}`}
                            >
                                <div className="flex items-center gap-3">
                                   <Dot className={riskStyles.icon} />
                                   {!isSidebarCollapsed && <span className="font-medium text-sm">{state.name}</span>}
                                </div>
                                {!isSidebarCollapsed && <span className={`text-xs font-semibold px-2 py-1 rounded-full ${riskStyles.bg} ${riskStyles.text}`}>{state.risk}</span>}
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-grow flex flex-col">
                <header className="p-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Overall Risk" value="High" icon={AlertTriangle} />
                        <StatCard title="High-Risk States" value="2" icon={TrendingUp} />
                        <StatCard title="Total Districts" value="12" icon={MapPin} />
                        <StatCard title="Avg. GW Stress" value="95.7%" icon={PieChart} />
                     </div>
                </header>

                <main className="flex-grow flex min-h-0 px-6 pb-6">
                    <div className="w-full flex border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                        {/* --- Districts Pane --- */}
                        <div className="w-2/5 border-r border-gray-200 flex flex-col">
                             <div className="p-4 border-b border-gray-200">
                                <h3 className="font-semibold">{selectedState?.name || 'No State Selected'} Districts</h3>
                                <p className="text-sm text-gray-500">{selectedState?.districts.length || 0} districts found</p>
                            </div>
                            <div className="flex-grow overflow-y-auto p-3 space-y-2 bg-gray-50/50">
                                {selectedState?.districts.map(district => (
                                    <div key={district.name} onClick={() => setSelectedDistrict(district)} className={`p-4 bg-white rounded-lg border-2 cursor-pointer transition-all ${selectedDistrict?.name === district.name ? 'border-indigo-500 shadow-md' : 'border-white hover:border-gray-200'}`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold">{district.name}</h4>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getRiskStyles(district.risk).bg} ${getRiskStyles(district.risk).text}`}>{district.risk}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 flex gap-4">
                                            <span>Rain: {district.annualRainfall || 'N/A'} mm</span>
                                            <span>GW Stress: {district.groundwaterStage || 'N/A'}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- Analysis Pane (with Tabs) --- */}
                        <div className="w-3/5 flex flex-col">
                            <AnimatePresence mode="wait">
                            {selectedDistrict ? (
                                <motion.div key={selectedDistrict.name} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col h-full">
                                    <div className="p-4 border-b border-gray-200 flex-shrink-0">
                                        <h3 className="font-semibold text-lg">{selectedDistrict.name} Detailed Analysis</h3>
                                        <div className="mt-2 border-b border-gray-200">
                                            <nav className="-mb-px flex space-x-6">
                                                {AnalysisTabs.map(tab => (
                                                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-1 pb-2 border-b-2 text-sm font-medium transition-colors ${activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                                        {tab}
                                                    </button>
                                                ))}
                                            </nav>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-grow overflow-y-auto p-4">
                                        <AnimatePresence mode="wait">
                                            <motion.div key={activeTab} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }}>
                                                {activeTab === 'Overview' && (
                                                    <div className="space-y-4">
                                                        <h4 className="font-semibold">Water Usage by Sector</h4>
                                                        <WaterUsageChart />
                                                    </div>
                                                )}
                                                {activeTab === 'Environmental Data' && (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="p-4 bg-gray-100 rounded-lg">
                                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-600"><CloudDrizzle size={16}/> Annual Rainfall</div>
                                                            <p className="text-2xl font-bold mt-1">{selectedDistrict.annualRainfall || 'N/A'} mm</p>
                                                        </div>
                                                        <div className="p-4 bg-gray-100 rounded-lg">
                                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-600"><Thermometer size={16}/> Groundwater Stress</div>
                                                            <p className="text-2xl font-bold mt-1">{selectedDistrict.groundwaterStage || 'N/A'}% <span className="text-sm font-normal">Extraction</span></p>
                                                        </div>
                                                    </div>
                                                )}
                                                {activeTab === 'Sub-Regions' && (
                                                    <div className="space-y-3">
                                                         {selectedDistrict.parts.map(part => {
                                                            const styles = getRiskStyles(part.risk);
                                                            return(
                                                                <div key={part.name} className="p-3 bg-white rounded-lg border border-gray-200 flex gap-3 items-start">
                                                                    <ShieldAlert size={20} className={styles.icon}/>
                                                                    <div>
                                                                        <h5 className="font-semibold">{part.name} - <span className={styles.icon}>{part.risk} Risk</span></h5>
                                                                        <p className="text-sm text-gray-600">{part.details}</p>
                                                                    </div>
                                                                </div>
                                                            )
                                                         })}
                                                    </div>
                                                )}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>

                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-8">
                                    <BarChart2 size={48} className="mb-4 text-gray-400"/>
                                    <h3 className="text-lg font-semibold text-gray-700">Select a District</h3>
                                    <p className="text-sm">Choose a district from the list to see its detailed analysis.</p>
                                </div>
                            )}
                            </AnimatePresence>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfessionalDashboard;