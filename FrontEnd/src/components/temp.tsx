// import React, { useState, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Search, Map, MapPin, BarChartHorizontal, Droplet, ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

// // --- Data Model Interfaces (Unchanged) ---
// interface DistrictPart {
//   name: string;
//   risk: 'High' | 'Medium' | 'Low';
//   details: string;
// }

// interface District {
//   name: string;
//   risk: 'High' | 'Medium' | 'Low';
//   parts: DistrictPart[];
// }

// interface IndianState {
//   name: string;
//   risk: 'High' | 'Medium' | 'Low';
//   districts: District[];
// }

// // --- MASSIVELY EXPANDED DATASET ---
// const indianStates: IndianState[] = [
//   // Original 5 States (Enhanced Details)
//   {
//     name: 'Tamil Nadu', risk: 'High', districts: [
//       { name: 'Chennai', risk: 'High', parts: [
//           { name: 'North Chennai', risk: 'High', details: 'Severe water scarcity, high industrial pollution, and saline intrusion.' },
//           { name: 'Central Chennai', risk: 'High', details: 'Extremely dense population and aging infrastructure straining supply.' },
//           { name: 'South Chennai', risk: 'Medium', details: 'IT corridor growth increasing demand, but newer infrastructure helps mitigate.' },
//       ]},
//       { name: 'Coimbatore', risk: 'Medium', parts: [
//           { name: 'Coimbatore City', risk: 'Medium', details: 'Growing industrial and domestic water demand from textile and IT sectors.' },
//           { name: 'Rural Outskirts', risk: 'Low', details: 'Good water availability from Noyyal river basin and PAP canal system.' },
//       ]},
//       { name: 'Madurai', risk: 'Medium', parts: [
//           { name: 'Madurai Corporation', risk: 'Medium', details: 'Reliant on Vaigai Dam, which faces seasonal shortages.'},
//           { name: 'Thirumangalam', risk: 'High', details: 'Drier region with significant agricultural water stress.'},
//       ]},
//     ]
//   },
//   {
//     name: 'Maharashtra', risk: 'High', districts: [
//       { name: 'Mumbai', risk: 'High', parts: [
//           { name: 'Island City', risk: 'High', details: 'Extremely high population density with limited local freshwater sources.' },
//           { name: 'Western Suburbs', risk: 'High', details: 'Rapid population growth stressing existing water infrastructure.' },
//           { name: 'Eastern Suburbs', risk: 'Medium', details: 'Slightly better water management but facing increasing demand.' },
//       ]},
//       { name: 'Pune', risk: 'Medium', parts: [
//           { name: 'Pune Metropolitan Region', risk: 'High', details: 'IT and industrial boom leading to acute water stress.' },
//           { name: 'Maval & Mulshi Talukas', risk: 'Low', details: 'Source region for dams, ensuring better water security.' },
//       ]},
//       { name: 'Aurangabad', risk: 'High', parts: [
//           { name: 'Aurangabad City', risk: 'High', details: 'Located in the rain shadow region, faces chronic water shortages.'},
//       ]},
//     ]
//   },
//   {
//     name: 'Karnataka', risk: 'Medium', districts: [
//       { name: 'Bangalore Urban', risk: 'High', parts: [
//           { name: 'East Bangalore (IT Hub)', risk: 'High', details: 'Severe groundwater depletion and heavy reliance on water tankers.' },
//           { name: 'West Bangalore', risk: 'Medium', details: 'Older areas with more established but heavily strained infrastructure.' },
//           { name: 'South Bangalore', risk: 'High', details: 'Rapid residential expansion outpacing water supply development.' },
//       ]},
//       { name: 'Mysore', risk: 'Low', parts: [
//           { name: 'Mysore City', risk: 'Low', details: 'Well-managed water resources from the Kaveri river and KRS Dam.' },
//       ]},
//       { name: 'Dakshina Kannada', risk: 'Low', parts: [
//           { name: 'Mangalore', risk: 'Low', details: 'High rainfall and abundant water from Netravati and Gurupura rivers.'},
//       ]},
//     ]
//   },
//   {
//     name: 'Delhi', risk: 'High', districts: [
//       { name: 'New Delhi', risk: 'High', parts: [
//           { name: 'Lutyens\' Delhi', risk: 'Medium', details: 'Better infrastructure and green cover, but very high per capita consumption.'},
//           { name: 'South Delhi', risk: 'High', details: 'High population density and illegal borewells impacting a falling water table.'},
//           { name: 'East Delhi', risk: 'High', details: 'High population density and severe pollution of the Yamuna river affecting supply.'},
//           { name: 'West Delhi', risk: 'High', details: 'Water supply issues compounded by unauthorized colonies and aging pipelines.'},
//       ]}
//     ]
//   },
//   {
//     name: 'Rajasthan', risk: 'High', districts: [
//       { name: 'Jaipur', risk: 'High', parts: [
//           { name: 'Walled City', risk: 'High', details: 'Aging pipelines, high population density, and inefficient water use.'},
//           { name: 'Suburban Areas', risk: 'High', details: 'Rapid expansion exceeding water supply capacity; reliance on tankers is common.'},
//       ]},
//       { name: 'Jodhpur', risk: 'High', parts: [
//           { name: 'Jodhpur City', risk: 'High', details: 'Chronic water shortages in an arid zone, high evaporation rates from sources.'},
//       ]},
//       { name: 'Udaipur', risk: 'Medium', parts: [
//           { name: 'Udaipur City', risk: 'Medium', details: 'Lake system provides a buffer, but is highly dependent on monsoon performance.'},
//       ]},
//     ]
//   },
//   // New States for Expanded Data
//   {
//     name: 'Uttar Pradesh', risk: 'High', districts: [
//         { name: 'Lucknow', risk: 'Medium', parts: [
//             {name: 'Central Lucknow', risk: 'Medium', details: 'Aging infrastructure but decent supply from Gomti river.'},
//             {name: 'Gomti Nagar Extension', risk: 'High', details: 'Rapid development straining groundwater resources.'}
//         ]},
//         { name: 'Varanasi', risk: 'High', parts: [
//             {name: 'Ghat Area', risk: 'High', details: 'Extreme pollution of the Ganges and high demand from tourism.'},
//             {name: 'Urban Areas', risk: 'High', details: 'Inadequate supply and groundwater contamination are major issues.'}
//         ]},
//         { name: 'Noida', risk: 'High', parts: [
//             {name: 'Noida City', risk: 'High', details: 'Massive urban development leading to critical groundwater depletion.'}
//         ]}
//     ]
//   },
//   {
//     name: 'Gujarat', risk: 'Medium', districts: [
//         { name: 'Ahmedabad', risk: 'Medium', parts: [
//             {name: 'Old City', risk: 'Medium', details: 'Stress on old pipelines but benefits from Sabarmati Riverfront project.'},
//             {name: 'West Zone (SG Highway)', risk: 'High', details: 'Commercial and residential boom causing severe water stress.'}
//         ]},
//         { name: 'Surat', risk: 'Low', parts: [
//             {name: 'Surat City', risk: 'Low', details: 'Excellent water management from Tapi river, considered a model city.'}
//         ]},
//         { name: 'Kutch', risk: 'High', parts: [
//             {name: 'Bhuj', risk: 'High', details: 'Arid region with saline groundwater and high dependency on Narmada canal.'}
//         ]}
//     ]
//   },
//   {
//       name: 'West Bengal', risk: 'Medium', districts: [
//           { name: 'Kolkata', risk: 'High', parts: [
//               {name: 'Central Kolkata', risk: 'High', details: 'Aging infrastructure, waterlogging issues, and high population density.'},
//               {name:'East Kolkata Wetlands', risk: 'Low', details: 'Natural water recycling zone, but threatened by encroachment.'}
//           ]},
//           { name: 'Darjeeling', risk: 'Low', parts: [
//               {name: 'Darjeeling Town', risk: 'Low', details: 'Abundant water from Himalayan springs, though infrastructure needs upgrades.'}
//           ]},
//           { name: 'Asansol', risk: 'High', parts: [
//               {name: 'Industrial Zone', risk: 'High', details: 'Heavy industrial use and contamination of local water bodies.'}
//           ]}
//       ]
//   },
//   {
//       name: 'Kerala', risk: 'Low', districts: [
//           { name: 'Kochi', risk: 'Medium', parts: [
//               {name: 'Kochi Corporation', risk: 'Medium', details: 'High rainfall but suffers from saline intrusion and urban pollution.'},
//               {name: 'West Kochi', risk: 'High', details: 'Faces acute drinking water shortages during summer months.'}
//           ]},
//           { name: 'Thiruvananthapuram', risk: 'Low', parts: [
//               {name: 'City Area', risk: 'Low', details: 'Well-managed supply from Peppara and Aruvikkara dams.'}
//           ]},
//           { name: 'Idukki', risk: 'Low', parts: [
//               {name: 'Idukki District', risk: 'Low', details: 'Source of major rivers and dams, water-rich region.'}
//           ]}
//       ]
//   },
//   {
//       name: 'Andhra Pradesh', risk: 'Medium', districts: [
//           { name: 'Visakhapatnam', risk: 'Medium', parts: [
//               {name: 'Industrial Port Area', risk: 'High', details: 'Massive industrial water demand and pollution risks.'},
//               {name: 'Residential Areas', risk: 'Medium', details: 'Dependent on seasonal rivers and reservoirs like Yeleru.'}
//           ]},
//           { name: 'Vijayawada', risk: 'Low', parts: [
//               {name: 'City Area', risk: 'Low', details: 'Located on the banks of the Krishna River with reliable supply from Prakasam Barrage.'}
//           ]},
//           { name: 'Anantapur', risk: 'High', parts: [
//               {name: 'Anantapur District', risk: 'High', details: 'One of the most arid districts in India, extreme groundwater dependency.'}
//           ]}
//       ]
//   }
// ];


// // --- Helper function to get risk-based styling ---
// const getRiskStyles = (risk: 'High' | 'Medium' | 'Low') => {
//   switch (risk) {
//     case 'High': return {
//       bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300',
//       highlight: 'hover:bg-red-100 hover:border-red-500', selected: '!bg-red-100 !border-red-600 shadow-md',
//       bar: 'bg-red-500', darkText: 'text-red-500'
//     };
//     case 'Medium': return {
//       bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300',
//       highlight: 'hover:bg-yellow-100 hover:border-yellow-500', selected: '!bg-yellow-100 !border-yellow-600 shadow-md',
//       bar: 'bg-yellow-500', darkText: 'text-yellow-500'
//     };
//     case 'Low': return {
//       bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300',
//       highlight: 'hover:bg-green-100 hover:border-green-500', selected: '!bg-green-100 !border-green-600 shadow-md',
//       bar: 'bg-green-500', darkText: 'text-green-500'
//     };
//   }
// };

// const RiskTag: React.FC<{ risk: 'High' | 'Medium' | 'Low' }> = ({ risk }) => {
//     const styles = getRiskStyles(risk);
//     return (
//         <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${styles.bg} ${styles.text}`}>
//             {risk} Risk
//         </span>
//     );
// };

// // --- NEW Risk Profile Chart Component ---
// const RiskProfileChart: React.FC<{ items: { risk: 'High' | 'Medium' | 'Low' }[], title: string }> = ({ items, title }) => {
//     const profile = useMemo(() => {
//         const counts = { High: 0, Medium: 0, Low: 0 };
//         items.forEach(item => counts[item.risk]++);
//         const total = items.length;
//         return {
//             high: total > 0 ? (counts.High / total) * 100 : 0,
//             medium: total > 0 ? (counts.Medium / total) * 100 : 0,
//             low: total > 0 ? (counts.Low / total) * 100 : 0,
//             counts
//         };
//     }, [items]);

//     return (
//         <div className="p-4 rounded-lg bg-white border border-gray-200">
//             <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{title}</h3>
//             <div className="w-full flex h-3 rounded-full overflow-hidden mb-3">
//                 <motion.div initial={{width:0}} animate={{width:`${profile.high}%`}} className={getRiskStyles('High').bar} />
//                 <motion.div initial={{width:0}} animate={{width:`${profile.medium}%`}} className={getRiskStyles('Medium').bar} />
//                 <motion.div initial={{width:0}} animate={{width:`${profile.low}%`}} className={getRiskStyles('Low').bar} />
//             </div>
//             <div className="flex justify-between text-sm">
//                 <span className="font-semibold text-red-600">{profile.counts.High} High</span>
//                 <span className="font-semibold text-yellow-600">{profile.counts.Medium} Medium</span>
//                 <span className="font-semibold text-green-600">{profile.counts.Low} Low</span>
//             </div>
//         </div>
//     );
// };

// // --- Main Dashboard Component ---
// const RiskAnalysisDashboard: React.FC = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedState, setSelectedState] = useState<IndianState | null>(null);
//     const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

//     const filteredStates = useMemo(() => 
//         indianStates.filter(state => state.name.toLowerCase().includes(searchTerm.toLowerCase())),
//     [searchTerm]);

//     const handleStateSelect = (state: IndianState) => {
//         setSelectedState(state);
//         setSelectedDistrict(null);
//     };

//     return (
//         <div className="flex flex-col h-screen bg-slate-50 font-sans">
//             <header className="flex-shrink-0 bg-white border-b border-gray-200 z-20">
//                 <div className="max-w-[1920px] mx-auto px-6 py-3 flex items-center gap-4">
//                     <Droplet className="text-blue-600" size={32}/>
//                     <div>
//                         <h1 className="text-xl font-bold text-gray-800">Water Scarcity Risk Dashboard</h1>
//                         <p className="text-sm text-gray-500">A Comprehensive Analysis for Key Indian Regions</p>
//                     </div>
//                 </div>
//             </header>

//             <main className="flex-grow flex min-h-0">
//                 <div className="w-full max-w-[1920px] mx-auto flex">
//                     {/* --- Column 1: States --- */}
//                     <div className="w-full md:w-1/3 lg:w-[28%] xl:w-1/4 flex flex-col border-r border-gray-200 bg-white">
//                         <div className="p-4 border-b border-gray-200 flex-shrink-0">
//                             <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3"><Map size={20}/> States</h2>
//                             <div className="relative">
//                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                                 <input type="text" placeholder="Search states..."
//                                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
//                                     value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
//                                 />
//                             </div>
//                         </div>
//                         <div className="flex-grow overflow-y-auto p-3 space-y-2">
//                             <AnimatePresence>
//                             {filteredStates.map(state => {
//                                 const styles = getRiskStyles(state.risk);
//                                 return (
//                                 <motion.div key={state.name} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -10 }}
//                                     onClick={() => handleStateSelect(state)}
//                                     className={`p-3.5 rounded-lg cursor-pointer border-2 transition-all ${styles.highlight} ${selectedState?.name === state.name ? styles.selected : styles.border + ' border-dashed'}`}>
//                                     <div className="flex justify-between items-center">
//                                         <h3 className="font-bold text-base text-gray-800">{state.name}</h3>
//                                         <RiskTag risk={state.risk} />
//                                     </div>
//                                     <p className="text-xs text-gray-600 mt-1">{state.districts.length} districts analyzed</p>
//                                 </motion.div>
//                                 );
//                             })}
//                             </AnimatePresence>
//                         </div>
//                     </div>

//                     {/* --- Column 2: Districts --- */}
//                     <div className="w-full md:w-1/3 lg:w-[32%] xl:w-[30%] flex flex-col border-r border-gray-200 bg-slate-50">
//                         <AnimatePresence mode="wait">
//                         {selectedState ? (
//                             <motion.div key={selectedState.name} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}} className="flex flex-col h-full">
//                                 <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
//                                     <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3"><MapPin size={20}/> {selectedState.name} Districts</h2>
//                                     <RiskProfileChart items={selectedState.districts} title="District Risk Profile" />
//                                 </div>
//                                 <div className="flex-grow overflow-y-auto p-3 space-y-2">
//                                     {selectedState.districts.map(district => (
//                                         <div key={district.name} onClick={() => setSelectedDistrict(district)}
//                                             className={`p-3 rounded-lg cursor-pointer border transition-all flex justify-between items-center bg-white shadow-sm hover:shadow-md hover:border-blue-400 ${selectedDistrict?.name === district.name ? 'border-blue-500 border-2' : 'border-gray-200'}`}>
//                                             <h4 className="font-semibold text-gray-800">{district.name}</h4>
//                                             <RiskTag risk={district.risk} />
//                                         </div>
//                                     ))}
//                                 </div>
//                             </motion.div>
//                         ) : (
//                              <motion.div key="no-state" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-8">
//                                 <MapPin size={40} className="mb-4 text-gray-400"/>
//                                 <h3 className="text-lg font-semibold text-gray-700">Select a State</h3>
//                                 <p className="text-sm">Choose a state from the list to view its district-level risk analysis.</p>
//                             </motion.div>
//                         )}
//                         </AnimatePresence>
//                     </div>

//                     {/* --- Column 3: Analysis Details --- */}
//                     <div className="w-full md:w-1/3 lg:w-[40%] xl:w-[46%] flex flex-col bg-gray-100">
//                          <AnimatePresence mode="wait">
//                             {selectedDistrict ? (
//                                 <motion.div key={selectedDistrict.name} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}} className="flex flex-col h-full">
//                                     <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
//                                         <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3"><BarChartHorizontal size={20}/> {selectedDistrict.name} Analysis</h2>
//                                         <RiskProfileChart items={selectedDistrict.parts} title="Sub-Regional Risk Profile" />
//                                     </div>
//                                     <div className="flex-grow overflow-y-auto p-4 space-y-3">
//                                         {selectedDistrict.parts.map((part, i) => {
//                                             const styles = getRiskStyles(part.risk);
//                                             const Icon = part.risk === 'High' ? ShieldAlert : part.risk === 'Medium' ? Shield : ShieldCheck;
//                                             return(
//                                             <motion.div key={part.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
//                                               className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex gap-4 items-start">
//                                                 <div className={`p-2 rounded-full ${styles.bg}`}>
//                                                     <Icon size={20} className={styles.text} />
//                                                 </div>
//                                                 <div>
//                                                     <div className="flex items-center justify-between mb-1">
//                                                         <h4 className="font-bold text-gray-800">{part.name}</h4>
//                                                         <RiskTag risk={part.risk} />
//                                                     </div>
//                                                     <p className="text-sm text-gray-600 leading-relaxed">{part.details}</p>
//                                                 </div>
//                                             </motion.div>
//                                         )})}
//                                     </div>
//                                 </motion.div>
//                             ) : (
//                                 <motion.div key="no-district" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-8">
//                                     <BarChartHorizontal size={40} className="mb-4 text-gray-400"/>
//                                     <h3 className="text-lg font-semibold text-gray-700">Select a District</h3>
//                                     <p className="text-sm">Choose a district from the list to see its detailed sub-regional breakdown.</p>
//                                 </motion.div>
//                             )}
//                         </AnimatePresence>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default RiskAnalysisDashboard;












import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Map, MapPin, BarChartHorizontal, Droplet, ShieldAlert, ShieldCheck, Shield, CloudDrizzle, Thermometer } from 'lucide-react';

// --- Data Model Interfaces (Updated) ---
interface DistrictPart {
  name: string;
  risk: 'High' | 'Medium' | 'Low';
  details: string;
}

interface District {
  name: string;
  risk: 'High' | 'Medium' | 'Low';
  parts: DistrictPart[];
  // NEW: Added properties for external data
  annualRainfall?: number | string;
  groundwaterStage?: number | string;
}

interface IndianState {
  name: string;
  risk: 'High' | 'Medium' | 'Low';
  districts: District[];
}

// --- FINAL DATASET with Integrated CSV Data ---
const indianStates: IndianState[] = [
    {
    name: 'Tamil Nadu', risk: 'High', districts: [
      { name: 'Chennai', risk: 'High', annualRainfall: 1400.4, groundwaterStage: 94.94, parts: [
          { name: 'North Chennai', risk: 'High', details: 'Severe water scarcity, high industrial pollution, and saline intrusion.' },
          { name: 'Central Chennai', risk: 'High', details: 'Extremely dense population and aging infrastructure straining supply.' },
          { name: 'South Chennai', risk: 'Medium', details: 'IT corridor growth increasing demand, but newer infrastructure helps mitigate.' },
      ]},
      { name: 'Coimbatore', risk: 'Medium', annualRainfall: 713.4, groundwaterStage: 80.93, parts: [
          { name: 'Coimbatore City', risk: 'Medium', details: 'Growing industrial and domestic water demand from textile and IT sectors.' },
          { name: 'Rural Outskirts', risk: 'Low', details: 'Good water availability from Noyyal river basin and PAP canal system.' },
      ]},
      { name: 'Madurai', risk: 'Medium', annualRainfall: 8, groundwaterStage:90.78, parts: [
          { name: 'Madurai Corporation', risk: 'Medium', details: 'Reliant on Vaigai Dam, which faces seasonal shortages.'},
          { name: 'Thirumangalam', risk: 'High', details: 'Drier region with significant agricultural water stress.'},
      ]},
    ]
  },
  {
    name: 'Maharashtra', risk: 'High', districts: [
      { name: 'Mumbai', risk: 'High', annualRainfall: "N/A", groundwaterStage: "N/A", parts: [
          { name: 'Island City', risk: 'High', details: 'Extremely high population density with limited local freshwater sources.' },
          { name: 'Western Suburbs', risk: 'High', details: 'Rapid population growth stressing existing water infrastructure.' },
      ]},
      { name: 'Pune', risk: 'Medium', annualRainfall: 721.5, groundwaterStage: 61.38, parts: [
          { name: 'Pune Metropolitan Region', risk: 'High', details: 'IT and industrial boom leading to acute water stress.' },
          { name: 'Maval & Mulshi Talukas', risk: 'Low', details: 'Source region for dams, ensuring better water security.' },
      ]},
      { name: 'Aurangabad', risk: 'High', annualRainfall: 692.4, groundwaterStage: 75.33, parts: [
          { name: 'Aurangabad City', risk: 'High', details: 'Located in the rain shadow region, faces chronic water shortages.'},
      ]},
    ]
  },
  {
    name: 'Karnataka', risk: 'Medium', districts: [
      { name: 'Bangalore Urban', risk: 'High', annualRainfall: 979.8, groundwaterStage: 138.83, parts: [
          { name: 'East Bangalore (IT Hub)', risk: 'High', details: 'Severe groundwater depletion and heavy reliance on water tankers.' },
          { name: 'West Bangalore', risk: 'Medium', details: 'Older areas with more established but heavily strained infrastructure.' },
      ]},
      { name: 'Mysore', risk: 'Low', annualRainfall: 804.5, groundwaterStage: 73.95, parts: [
          { name: 'Mysore City', risk: 'Low', details: 'Well-managed water resources from the Kaveri river and KRS Dam.' },
      ]},
      { name: 'Dakshina Kannada', risk: 'Low', annualRainfall: 3933.4, groundwaterStage: 16.96, parts: [
          { name: 'Mangalore', risk: 'Low', details: 'High rainfall and abundant water from Netravati and Gurupura rivers.'},
      ]},
    ]
  },
  {
    name: 'Delhi', risk: 'High', districts: [
      { name: 'New Delhi', risk: 'High', annualRainfall: 792.4, groundwaterStage: 97.74, parts: [
          { name: 'Lutyens\' Delhi', risk: 'Medium', details: 'Better infrastructure and green cover, but very high per capita consumption.'},
          { name: 'South Delhi', risk: 'High', details: 'High population density and illegal borewells impacting a falling water table.'},
      ]}
    ]
  },
  {
    name: 'Rajasthan', risk: 'High', districts: [
      { name: 'Jaipur', risk: 'High', annualRainfall: 556.7, groundwaterStage: 136.93, parts: [
          { name: 'Walled City', risk: 'High', details: 'Aging pipelines, high population density, and inefficient water use.'},
          { name: 'Suburban Areas', risk: 'High', details: 'Rapid expansion exceeding water supply capacity; reliance on tankers is common.'},
      ]},
      { name: 'Jodhpur', risk: 'High', annualRainfall: 360.7, groundwaterStage: 147.21, parts: [
          { name: 'Jodhpur City', risk: 'High', details: 'Chronic water shortages in an arid zone, high evaporation rates from sources.'},
      ]},
      { name: 'Udaipur', risk: 'Medium', annualRainfall: 668.5, groundwaterStage: 58.55, parts: [
          { name: 'Udaipur City', risk: 'Medium', details: 'Lake system provides a buffer, but is highly dependent on monsoon performance.'},
      ]},
    ]
  },
  {
    name: 'Uttar Pradesh', risk: 'High', districts: [
        { name: 'Lucknow', risk: 'Medium', annualRainfall: 959.0, groundwaterStage: 77.26, parts: [
            {name: 'Central Lucknow', risk: 'Medium', details: 'Aging infrastructure but decent supply from Gomti river.'},
            {name: 'Gomti Nagar Extension', risk: 'High', details: 'Rapid development straining groundwater resources.'}
        ]},
        { name: 'Varanasi', risk: 'High', annualRainfall: 1024.5, groundwaterStage: 56.41, parts: [
            {name: 'Ghat Area', risk: 'High', details: 'Extreme pollution of the Ganges and high demand from tourism.'},
            {name: 'Urban Areas', risk: 'High', details: 'Inadequate supply and groundwater contamination are major issues.'}
        ]},
        { name: 'Noida', risk: 'High', annualRainfall: "N/A", groundwaterStage: 128.8, parts: [
            {name: 'Noida City', risk: 'High', details: 'Massive urban development leading to critical groundwater depletion.'}
        ]}
    ]
  },
  {
    name: 'Gujarat', risk: 'Medium', districts: [
        { name: 'Ahmedabad', risk: 'Medium', annualRainfall: 710.1, groundwaterStage: 64.91, parts: [
            {name: 'Old City', risk: 'Medium', details: 'Stress on old pipelines but benefits from Sabarmati Riverfront project.'},
            {name: 'West Zone (SG Highway)', risk: 'High', details: 'Commercial and residential boom causing severe water stress.'}
        ]},
        { name: 'Surat', risk: 'Low', annualRainfall: 1224.2, groundwaterStage: 16.51, parts: [
            {name: 'Surat City', risk: 'Low', details: 'Excellent water management from Tapi river, considered a model city.'}
        ]},
        { name: 'Kutch', risk: 'High', annualRainfall: 456.3, groundwaterStage: 62.85, parts: [
            {name: 'Bhuj', risk: 'High', details: 'Arid region with saline groundwater and high dependency on Narmada canal.'}
        ]}
    ]
  },
  {
      name: 'West Bengal', risk: 'Medium', districts: [
          { name: 'Kolkata', risk: 'High', annualRainfall: 1787.5, groundwaterStage: 34.69, parts: [
              {name: 'Central Kolkata', risk: 'High', details: 'Aging infrastructure, waterlogging issues, and high population density.'},
              {name: 'East Kolkata Wetlands', risk: 'Low', details: 'Natural water recycling zone, but threatened by encroachment.'}
          ]},
          { name: 'Darjeeling', risk: 'Low', annualRainfall: 2793.9, groundwaterStage: "N/A", parts: [
              {name: 'Darjeeling Town', risk: 'Low', details: 'Abundant water from Himalayan springs, though infrastructure needs upgrades.'}
          ]},
          { name: 'Asansol', risk: 'High', annualRainfall: "N/A", groundwaterStage: "N/A", parts: [
              {name: 'Industrial Zone', risk: 'High', details: 'Heavy industrial use and contamination of local water bodies.'}
          ]}
      ]
  },
  {
      name: 'Kerala', risk: 'Low', districts: [
          { name: 'Kochi', risk: 'Medium', annualRainfall: "N/A", groundwaterStage: 28.18, parts: [
              {name: 'Kochi Corporation', risk: 'Medium', details: 'High rainfall but suffers from saline intrusion and urban pollution.'},
          ]},
          { name: 'Thiruvananthapuram', risk: 'Low', annualRainfall: 1845.0, groundwaterStage: 39.42, parts: [
              {name: 'City Area', risk: 'Low', details: 'Well-managed supply from Peppara and Aruvikkara dams.'}
          ]},
          { name: 'Idukki', risk: 'Low', annualRainfall: 3269.2, groundwaterStage: 4.25, parts: [
              {name: 'Idukki District', risk: 'Low', details: 'Source of major rivers and dams, water-rich region.'}
          ]}
      ]
  },
  {
      name: 'Andhra Pradesh', risk: 'Medium', districts: [
          { name: 'Visakhapatnam', risk: 'Medium', annualRainfall: 1121.6, groundwaterStage: 24.3, parts: [
              {name: 'Industrial Port Area', risk: 'High', details: 'Massive industrial water demand and pollution risks.'},
          ]},
          { name: 'Vijayawada', risk: 'Low', annualRainfall: "N/A", groundwaterStage: 47.95, parts: [
              {name: 'City Area', risk: 'Low', details: 'Located on the banks of the Krishna River with reliable supply from Prakasam Barrage.'}
          ]},
          { name: 'Anantapur', risk: 'High', annualRainfall: 579.3, groundwaterStage: 88.96, parts: [
              {name: 'Anantapur District', risk: 'High', details: 'One of the most arid districts in India, extreme groundwater dependency.'}
          ]}
      ]
  }
];


// --- Helper function to get risk-based styling ---
const getRiskStyles = (risk: 'High' | 'Medium' | 'Low') => {
  switch (risk) {
    case 'High': return {
      bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300',
      highlight: 'hover:bg-red-100 hover:border-red-500', selected: '!bg-red-100 !border-red-600 shadow-md',
      bar: 'bg-red-500', darkText: 'text-red-500'
    };
    case 'Medium': return {
      bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300',
      highlight: 'hover:bg-yellow-100 hover:border-yellow-500', selected: '!bg-yellow-100 !border-yellow-600 shadow-md',
      bar: 'bg-yellow-500', darkText: 'text-yellow-500'
    };
    case 'Low': return {
      bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300',
      highlight: 'hover:bg-green-100 hover:border-green-500', selected: '!bg-green-100 !border-green-600 shadow-md',
      bar: 'bg-green-500', darkText: 'text-green-500'
    };
  }
};

const RiskTag: React.FC<{ risk: 'High' | 'Medium' | 'Low' }> = ({ risk }) => {
    const styles = getRiskStyles(risk);
    return (
        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${styles.bg} ${styles.text}`}>
            {risk} Risk
        </span>
    );
};

// --- NEW Risk Profile Chart Component ---
const RiskProfileChart: React.FC<{ items: { risk: 'High' | 'Medium' | 'Low' }[], title: string }> = ({ items, title }) => {
    const profile = useMemo(() => {
        const counts = { High: 0, Medium: 0, Low: 0 };
        items.forEach(item => counts[item.risk]++);
        const total = items.length;
        return {
            high: total > 0 ? (counts.High / total) * 100 : 0,
            medium: total > 0 ? (counts.Medium / total) * 100 : 0,
            low: total > 0 ? (counts.Low / total) * 100 : 0,
            counts
        };
    }, [items]);

    return (
        <div className="p-4 rounded-lg bg-white border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{title}</h3>
            <div className="w-full flex h-3 rounded-full overflow-hidden mb-3">
                <motion.div initial={{width:0}} animate={{width:`${profile.high}%`}} className={getRiskStyles('High').bar} />
                <motion.div initial={{width:0}} animate={{width:`${profile.medium}%`}} className={getRiskStyles('Medium').bar} />
                <motion.div initial={{width:0}} animate={{width:`${profile.low}%`}} className={getRiskStyles('Low').bar} />
            </div>
            <div className="flex justify-between text-sm">
                <span className="font-semibold text-red-600">{profile.counts.High} High</span>
                <span className="font-semibold text-yellow-600">{profile.counts.Medium} Medium</span>
                <span className="font-semibold text-green-600">{profile.counts.Low} Low</span>
            </div>
        </div>
    );
};

// --- Main Dashboard Component ---
const RiskAnalysisDashboard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState<IndianState | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

    const filteredStates = useMemo(() =>
        indianStates.filter(state => state.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm]);

    const handleStateSelect = (state: IndianState) => {
        setSelectedState(state);
        setSelectedDistrict(null);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 font-sans">
            <header className="flex-shrink-0 bg-white border-b border-gray-200 z-20">
                <div className="max-w-[1920px] mx-auto px-6 py-3 flex items-center gap-4">
                    <Droplet className="text-blue-600" size={32}/>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Water Scarcity Risk Dashboard</h1>
                        <p className="text-sm text-gray-500">A Comprehensive Analysis for Key Indian Regions</p>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex min-h-0">
                <div className="w-full max-w-[1920px] mx-auto flex">
                    {/* --- Column 1: States --- */}
                    <div className="w-full md:w-1/3 lg:w-[28%] xl:w-1/4 flex flex-col border-r border-gray-200 bg-white">
                        <div className="p-4 border-b border-gray-200 flex-shrink-0">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3"><Map size={20}/> States</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" placeholder="Search states..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex-grow overflow-y-auto p-3 space-y-2">
                           {filteredStates.map(state => {
                                const styles = getRiskStyles(state.risk);
                                return (
                                <motion.div key={state.name} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -10 }}
                                    onClick={() => handleStateSelect(state)}
                                    className={`p-3.5 rounded-lg cursor-pointer border-2 transition-all ${styles.highlight} ${selectedState?.name === state.name ? styles.selected : styles.border + ' border-dashed'}`}>
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-base text-gray-800">{state.name}</h3>
                                        <RiskTag risk={state.risk} />
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">{state.districts.length} districts analyzed</p>
                                </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* --- Column 2: Districts --- */}
                    <div className="w-full md:w-1/3 lg:w-[32%] xl:w-[30%] flex flex-col border-r border-gray-200 bg-slate-50">
                        <AnimatePresence mode="wait">
                        {selectedState ? (
                            <motion.div key={selectedState.name} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}} className="flex flex-col h-full">
                                <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
                                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3"><MapPin size={20}/> {selectedState.name} Districts</h2>
                                    <RiskProfileChart items={selectedState.districts} title="District Risk Profile" />
                                </div>
                                <div className="flex-grow overflow-y-auto p-3 space-y-2">
                                    {selectedState.districts.map(district => (
                                        <div key={district.name} onClick={() => setSelectedDistrict(district)}
                                            className={`p-3 rounded-lg cursor-pointer border transition-all flex justify-between items-center bg-white shadow-sm hover:shadow-md hover:border-blue-400 ${selectedDistrict?.name === district.name ? 'border-blue-500 border-2' : 'border-gray-200'}`}>
                                            <h4 className="font-semibold text-gray-800">{district.name}</h4>
                                            <RiskTag risk={district.risk} />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                             <motion.div key="no-state" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-8">
                                <MapPin size={40} className="mb-4 text-gray-400"/>
                                <h3 className="text-lg font-semibold text-gray-700">Select a State</h3>
                                <p className="text-sm">Choose a state from the list to view its district-level risk analysis.</p>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>

                    {/* --- Column 3: Analysis Details --- */}
                    <div className="w-full md:w-1/3 lg:w-[40%] xl:w-[46%] flex flex-col bg-gray-100">
                         <AnimatePresence mode="wait">
                            {selectedDistrict ? (
                                <motion.div key={selectedDistrict.name} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}} className="flex flex-col h-full">
                                    <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
                                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3"><BarChartHorizontal size={20}/> {selectedDistrict.name} Analysis</h2>
                                        <RiskProfileChart items={selectedDistrict.parts} title="Sub-Regional Risk Profile" />
                                    </div>
                                    <div className="flex-grow overflow-y-auto p-4 space-y-4">
                                        {/* NEWLY ADDED DATA SECTION */}
                                        <div>
                                            <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-2">Environmental Metrics</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="p-3 bg-white rounded-lg border border-gray-200 flex items-center gap-3">
                                                    <CloudDrizzle className="text-blue-500" size={24}/>
                                                    <div>
                                                        <div className="text-xs text-gray-500">Annual Rainfall</div>
                                                        <div className="font-bold text-gray-800">{selectedDistrict.annualRainfall && selectedDistrict.annualRainfall !== "N/A" ? `${selectedDistrict.annualRainfall} mm` : 'N/A'}</div>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-white rounded-lg border border-gray-200 flex items-center gap-3">
                                                    <Thermometer className="text-orange-500" size={24}/>
                                                    <div>
                                                        <div className="text-xs text-gray-500">Groundwater Stress</div>
                                                        <div className="font-bold text-gray-800">{selectedDistrict.groundwaterStage && selectedDistrict.groundwaterStage !== "N/A" ? `${selectedDistrict.groundwaterStage}% Extracted` : 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-2">Qualitative Assessment</h4>
                                            {selectedDistrict.parts.map((part, i) => {
                                                const styles = getRiskStyles(part.risk);
                                                const Icon = part.risk === 'High' ? ShieldAlert : part.risk === 'Medium' ? Shield : ShieldCheck;
                                                return(
                                                <motion.div key={part.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                                                  className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex gap-4 items-start mt-2">
                                                    <div className={`p-2 rounded-full ${styles.bg}`}>
                                                        <Icon size={20} className={styles.text} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center justify-between mb-1 w-full">
                                                            <h4 className="font-bold text-gray-800">{part.name}</h4>
                                                            <RiskTag risk={part.risk} />
                                                        </div>
                                                        <p className="text-sm text-gray-600 leading-relaxed">{part.details}</p>
                                                    </div>
                                                </motion.div>
                                            )})}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="no-district" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-8">
                                    <BarChartHorizontal size={40} className="mb-4 text-gray-400"/>
                                    <h3 className="text-lg font-semibold text-gray-700">Select a District</h3>
                                    <p className="text-sm">Choose a district from the list to see its detailed sub-regional breakdown.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RiskAnalysisDashboard;