import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, MapPin, Search, X } from 'lucide-react';
import { BarChart, Bar, Tooltip, ResponsiveContainer } from 'recharts';

const states = [
  // ... same states array as before
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } }),
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const modalVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { opacity: 0, y: 50, transition: { duration: 0.2 } }
};

const EnhancedReport: React.FC = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStates = useMemo(
    () => states.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <motion.header
        className="max-w-6xl mx-auto flex items-center justify-between mb-8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-blue-900 flex items-center">
          <FileText className="mr-4" size={32} />
          Water Resource Dashboard
        </h1>
        <div className="relative">
          <Search className="absolute top-2 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search states..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full shadow-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </motion.header>

      <motion.main className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredStates.map((state, i) => (
            <motion.div
              key={state.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl cursor-pointer"
              onClick={() => setSelectedState(state)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold flex items-center text-blue-800">
                  <MapPin className="mr-2" size={24} />
                  {state.name}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                  ${state.risk === 'High' ? 'bg-red-200 text-red-800' : state.risk === 'Medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`
                }
                >
                  {state.risk} Risk
                </span>
              </div>
              <p className="text-gray-600 mb-2">Water Level: <strong>{state.waterLevel}m</strong></p>
              <p className="text-gray-600 mb-4">Districts: <strong>{state.districts.length}</strong></p>
              <div className="w-full h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ name: state.name, level: state.waterLevel }]}> 
                    <Bar dataKey="level" radius={[4,4,0,0]} />
                    <Tooltip />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedState && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center"
            initial="hidden" animate="visible" exit="exit"
            variants={modalVariants}
          >
            <motion.div className="bg-white rounded-2xl w-11/12 md:w-2/3 lg:w-1/2 p-8 relative shadow-2xl">
              <X
                className="absolute top-4 right-4 cursor-pointer text-gray-500"
                size={24}
                onClick={() => setSelectedState(null)}
              />
              <h2 className="text-3xl font-bold mb-4 text-blue-800">{selectedState.name} Details</h2>
              <p className="mb-2">Risk Level: <strong>{selectedState.risk}</strong></p>
              <p className="mb-6">Water Level: <strong>{selectedState.waterLevel} meters</strong></p>
              <h3 className="text-xl font-semibold mb-2">Districts</h3>
              <ul className="list-disc ml-6 max-h-64 overflow-y-auto space-y-1">
                {selectedState.districts.map(d => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedReport;
