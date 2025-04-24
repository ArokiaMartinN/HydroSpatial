import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

// Complete dataset of Indian states and union territories with districts.
// For brevity, only a few sample districts are provided per state/UT.
// Replace the sample entries ("...") with the complete list of districts.
const indianStates = [
  {
    name: 'Andhra Pradesh',
    risk: 'Medium',
    districts: [
      { name: 'Anantapur', risk: 'High', details: 'Severe water stress in rural areas.' },
      { name: 'Chittoor', risk: 'Medium', details: 'Moderate water stress with agricultural demand.' },
      { name: 'East Godavari', risk: 'Low', details: 'Better water management with abundant rainfall.' },
      // ... add all remaining districts of Andhra Pradesh
    ]
  },
  {
    name: 'Arunachal Pradesh',
    risk: 'Low',
    districts: [
      { name: 'Tawang', risk: 'Low', details: 'Mountainous terrain with adequate rainfall.' },
      { name: 'West Kameng', risk: 'Low', details: 'Low population and balanced water resources.' },
      // ... add all remaining districts of Arunachal Pradesh
    ]
  },
  {
    name: 'Assam',
    risk: 'Medium',
    districts: [
      { name: 'Kamrup', risk: 'Medium', details: 'Urban water stress in parts of Guwahati.' },
      { name: 'Nagaon', risk: 'Low', details: 'Agriculture dominant with moderate water usage.' },
      // ... add all remaining districts of Assam
    ]
  },
  {
    name: 'Bihar',
    risk: 'High',
    districts: [
      { name: 'Patna', risk: 'High', details: 'High urban demand and infrastructure challenges.' },
      { name: 'Gaya', risk: 'Medium', details: 'Mixed water usage with some scarcity issues.' },
      // ... add all remaining districts of Bihar
    ]
  },
  {
    name: 'Chhattisgarh',
    risk: 'Medium',
    districts: [
      { name: 'Raipur', risk: 'High', details: 'Rapid urbanization affecting water supply.' },
      { name: 'Bilaspur', risk: 'Medium', details: 'Balanced water resources with industrial pressure.' },
      // ... add all remaining districts of Chhattisgarh
    ]
  },
  {
    name: 'Goa',
    risk: 'Low',
    districts: [
      { name: 'North Goa', risk: 'Low', details: 'Tourism-driven but water managed well.' },
      { name: 'South Goa', risk: 'Low', details: 'Rural regions with ample rainfall.' },
      // ... add all remaining districts of Goa (if any)
    ]
  },
  {
    name: 'Gujarat',
    risk: 'Medium',
    districts: [
      { name: 'Ahmedabad', risk: 'High', details: 'Rapid urban growth impacting water supply.' },
      { name: 'Surat', risk: 'Medium', details: 'Industrial demand causing moderate stress.' },
      // ... add all remaining districts of Gujarat
    ]
  },
  {
    name: 'Haryana',
    risk: 'High',
    districts: [
      { name: 'Ambala', risk: 'Medium', details: 'Mixed agricultural and urban demand.' },
      { name: 'Gurgaon', risk: 'High', details: 'Extremely high urban demand with rapid development.' },
      // ... add all remaining districts of Haryana
    ]
  },
  {
    name: 'Himachal Pradesh',
    risk: 'Low',
    districts: [
      { name: 'Shimla', risk: 'Medium', details: 'Tourism and urban growth impacting water.' },
      { name: 'Solan', risk: 'Low', details: 'Balanced water resources in hilly terrain.' },
      // ... add all remaining districts of Himachal Pradesh
    ]
  },
  {
    name: 'Jharkhand',
    risk: 'Medium',
    districts: [
      { name: 'Ranchi', risk: 'High', details: 'Urban stress and mining impacting water availability.' },
      { name: 'Jamshedpur', risk: 'Medium', details: 'Industrial and urban pressures on water supply.' },
      // ... add all remaining districts of Jharkhand
    ]
  },
  {
    name: 'Karnataka',
    risk: 'Medium',
    districts: [
      { name: 'Bangalore Urban', risk: 'High', details: 'Severe urban water shortage.' },
      { name: 'Mysore', risk: 'Low', details: 'Better managed with balanced water usage.' },
      // ... add all remaining districts of Karnataka
    ]
  },
  {
    name: 'Kerala',
    risk: 'Low',
    districts: [
      { name: 'Thiruvananthapuram', risk: 'Low', details: 'Good rainfall and water management practices.' },
      { name: 'Ernakulam', risk: 'Medium', details: 'Urbanization leading to moderate water stress.' },
      // ... add all remaining districts of Kerala
    ]
  },
  {
    name: 'Madhya Pradesh',
    risk: 'Medium',
    districts: [
      { name: 'Bhopal', risk: 'High', details: 'High urban demand impacting water reserves.' },
      { name: 'Indore', risk: 'Medium', details: 'Industrial and urban challenges in water supply.' },
      // ... add all remaining districts of Madhya Pradesh
    ]
  },
  {
    name: 'Maharashtra',
    risk: 'High',
    districts: [
      { name: 'Mumbai', risk: 'High', details: 'Severe water depletion due to high population density.' },
      { name: 'Pune', risk: 'Medium', details: 'Rapid growth with increasing water stress.' },
      // ... add all remaining districts of Maharashtra
    ]
  },
  {
    name: 'Manipur',
    risk: 'Low',
    districts: [
      { name: 'Imphal East', risk: 'Low', details: 'Low industrial pressure with adequate water resources.' },
      { name: 'Imphal West', risk: 'Low', details: 'Balanced water availability in rural and urban areas.' },
      // ... add all remaining districts of Manipur
    ]
  },
  {
    name: 'Meghalaya',
    risk: 'Low',
    districts: [
      { name: 'East Khasi Hills', risk: 'Medium', details: 'Growing urban centers with emerging water challenges.' },
      { name: 'West Khasi Hills', risk: 'Low', details: 'Lush areas with good rainfall distribution.' },
      // ... add all remaining districts of Meghalaya
    ]
  },
  {
    name: 'Mizoram',
    risk: 'Low',
    districts: [
      { name: 'Aizawl', risk: 'Low', details: 'Cool climate with balanced water supply.' },
      { name: 'Lunglei', risk: 'Low', details: 'Rural areas with minimal water stress.' },
      // ... add all remaining districts of Mizoram
    ]
  },
  {
    name: 'Nagaland',
    risk: 'Low',
    districts: [
      { name: 'Kohima', risk: 'Medium', details: 'Urban centers with moderate water challenges.' },
      { name: 'Dimapur', risk: 'High', details: 'Rapid urbanization increasing water demand.' },
      // ... add all remaining districts of Nagaland
    ]
  },
  {
    name: 'Odisha',
    risk: 'Medium',
    districts: [
      { name: 'Cuttack', risk: 'High', details: 'Industrial and urban pressures on water supply.' },
      { name: 'Bhubaneswar', risk: 'Medium', details: 'Growing urban area with mixed challenges.' },
      // ... add all remaining districts of Odisha
    ]
  },
  {
    name: 'Punjab',
    risk: 'High',
    districts: [
      { name: 'Amritsar', risk: 'High', details: 'Over-extraction and agricultural demands causing stress.' },
      { name: 'Ludhiana', risk: 'High', details: 'Industrial and agricultural overuse of water.' },
      // ... add all remaining districts of Punjab
    ]
  },
  {
    name: 'Rajasthan',
    risk: 'High',
    districts: [
      { name: 'Jaipur', risk: 'High', details: 'Urban expansion and scarce rainfall.' },
      { name: 'Jodhpur', risk: 'High', details: 'Arid region with chronic water shortages.' },
      // ... add all remaining districts of Rajasthan
    ]
  },
  {
    name: 'Sikkim',
    risk: 'Low',
    districts: [
      { name: 'East Sikkim', risk: 'Low', details: 'Abundant rainfall and pristine water sources.' },
      { name: 'West Sikkim', risk: 'Low', details: 'Rural districts with sustainable water usage.' },
      // ... add all remaining districts of Sikkim
    ]
  },
  {
    name: 'Tamil Nadu',
    risk: 'High',
    districts: [
      { name: 'Chennai', risk: 'High', details: 'Acute water scarcity in a densely populated urban area.' },
      { name: 'Coimbatore', risk: 'Medium', details: 'Rapid industrialization with growing water demands.' },
      // ... add all remaining districts of Tamil Nadu
    ]
  },
  {
    name: 'Telangana',
    risk: 'Medium',
    districts: [
      { name: 'Hyderabad', risk: 'High', details: 'Severe urban water stress in the capital region.' },
      { name: 'Rangareddy', risk: 'Medium', details: 'Suburban growth with rising water demand.' },
      // ... add all remaining districts of Telangana
    ]
  },
  {
    name: 'Tripura',
    risk: 'Low',
    districts: [
      { name: 'Agartala', risk: 'Medium', details: 'Urban challenges with mostly adequate water supply.' },
      { name: 'Udaipur', risk: 'Low', details: 'Rural area with sufficient water availability.' },
      // ... add all remaining districts of Tripura
    ]
  },
  {
    name: 'Uttar Pradesh',
    risk: 'High',
    districts: [
      { name: 'Lucknow', risk: 'High', details: 'High urban demand and stress on water resources.' },
      { name: 'Kanpur', risk: 'High', details: 'Industrial pollution and over-extraction of groundwater.' },
      // ... add all remaining districts of Uttar Pradesh
    ]
  },
  {
    name: 'Uttarakhand',
    risk: 'Medium',
    districts: [
      { name: 'Dehradun', risk: 'Medium', details: 'Rapid urban growth impacting natural water bodies.' },
      { name: 'Nainital', risk: 'Low', details: 'Tourism and hilly terrain with moderate demand.' },
      // ... add all remaining districts of Uttarakhand
    ]
  },
  {
    name: 'West Bengal',
    risk: 'Medium',
    districts: [
      { name: 'Kolkata', risk: 'High', details: 'Urban congestion with heavy water consumption.' },
      { name: 'Howrah', risk: 'Medium', details: 'Industrial and urban challenges in water management.' },
      // ... add all remaining districts of West Bengal
    ]
  },
  // Union Territories
  {
    name: 'Andaman and Nicobar Islands',
    risk: 'Low',
    districts: [
      { name: 'North and Middle Andaman', risk: 'Low', details: 'Island terrain with abundant rainfall.' },
      { name: 'South Andaman', risk: 'Low', details: 'Tourism and marine resources help sustain water supply.' },
      { name: 'Nicobar', risk: 'Low', details: 'Rural islands with balanced water availability.' }
    ]
  },
  {
    name: 'Chandigarh',
    risk: 'Low',
    districts: [
      { name: 'Chandigarh', risk: 'Low', details: 'Small UT with managed water resources.' }
    ]
  },
  {
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    risk: 'Low',
    districts: [
      { name: 'Dadra and Nagar Haveli', risk: 'Low', details: 'Industrial and rural mix.' },
      { name: 'Daman', risk: 'Low', details: 'Coastal UT with balanced supply.' },
      { name: 'Diu', risk: 'Low', details: 'Tourism-driven, low water stress.' }
    ]
  },
  {
    name: 'Delhi',
    risk: 'High',
    districts: [
      { name: 'New Delhi', risk: 'High', details: 'Extreme urban demand and limited supply.' },
      // ... add remaining administrative districts/regions of Delhi if needed
    ]
  },
  {
    name: 'Jammu and Kashmir',
    risk: 'Medium',
    districts: [
      { name: 'Srinagar', risk: 'High', details: 'Urban pressure in the valley.' },
      { name: 'Jammu', risk: 'Medium', details: 'Growing urban demand.' },
      // ... add all remaining districts of Jammu and Kashmir
    ]
  },
  {
    name: 'Ladakh',
    risk: 'Low',
    districts: [
      { name: 'Leh', risk: 'Low', details: 'Sparse population and minimal water stress.' },
      { name: 'Kargil', risk: 'Low', details: 'Rural mountainous region.' }
    ]
  },
  {
    name: 'Lakshadweep',
    risk: 'Low',
    districts: [
      { name: 'Lakshadweep', risk: 'Low', details: 'Island UT with unique water management needs.' }
    ]
  },
  {
    name: 'Puducherry',
    risk: 'Low',
    districts: [
      { name: 'Puducherry', risk: 'Low', details: 'Small UT with moderate water usage.' },
      { name: 'Karaikal', risk: 'Low', details: 'Coastal region with balanced water resources.' },
      { name: 'Mahé', risk: 'Low', details: 'Island area with sustainable water supply.' },
      { name: 'Yanam', risk: 'Low', details: 'Rural region with low stress.' }
    ]
  }
];

const RiskAnalysis: React.FC = () => {
  const [selectedState, setSelectedState] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('All');
  const [districtSearchTerm, setDistrictSearchTerm] = useState('');

  // Filter states based on search term and risk level
  const filteredStates = indianStates.filter(state => {
    const matchesSearch =
      state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.districts.some(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesRisk = selectedRiskFilter === 'All' || state.risk === selectedRiskFilter;
    return matchesSearch && matchesRisk;
  });

  // Filter districts within the selected state
  const filteredDistricts = selectedState
    ? selectedState.districts.filter((d: any) =>
        d.name.toLowerCase().includes(districtSearchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Report Analysis</h1>
        
        {/* Global Search and Risk Filter */}
        <div className="mb-6 flex flex-col md:flex-row md:space-x-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative flex-grow mb-4 md:mb-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search states or districts..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative">
            <select
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value)}
              className="w-full pl-3 pr-4 py-2 border rounded-lg"
            >
              <option value="All">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </motion.div>
        </div>

        {/* States Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredStates.map((state, index) => (
              <motion.div
                key={state.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-lg p-6 cursor-pointer"
                onClick={() => {
                  setSelectedState(state);
                  setDistrictSearchTerm(''); // reset district filter
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{state.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      state.risk === 'High'
                        ? 'bg-red-100 text-red-800'
                        : state.risk === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {state.risk}
                  </span>
                </div>
                <p className="text-gray-600">{state.districts.length} districts</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* District Details for Selected State */}
        <AnimatePresence>
          {selectedState && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">{selectedState.name} Districts</h2>
                <button onClick={() => setSelectedState(null)} className="text-gray-500 hover:text-gray-700">
                  Close
                </button>
              </div>

              {/* District Search */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search districts..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={districtSearchTerm}
                  onChange={(e) => setDistrictSearchTerm(e.target.value)}
                />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDistricts.map((district: any, index: number) => (
                  <motion.div
                    key={district.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{district.name}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          district.risk === 'High'
                            ? 'bg-red-100 text-red-800'
                            : district.risk === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {district.risk}
                      </span>
                    </div>
                    <p className="text-gray-600">{district.details}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RiskAnalysis;
