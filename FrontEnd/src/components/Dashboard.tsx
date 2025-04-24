import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, RefreshCw } from 'lucide-react';
import Select from 'react-select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [data, setData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch list of states from backend.
  useEffect(() => {
    fetch('http://localhost:5000/api/states')
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch((err) => console.error('Error fetching states:', err));
  }, []);

  // Fetch districts when a state is selected.
  useEffect(() => {
    if (selectedState) {
      setLoading(true);
      fetch(`http://localhost:5000/api/districts?state=${selectedState}`)
        .then((res) => res.json())
        .then((data) => setDistricts(data))
        .catch((err) => console.error('Error fetching districts:', err))
        .finally(() => setLoading(false));
    }
  }, [selectedState]);

  // Fetch data for the selected state/district.
  const fetchData = () => {
    if (!selectedState || !selectedDistrict) return;
    setLoading(true);
    setError(null);
    setSelectedMetric(null); // Reset selected metric when fetching new data
    fetch(`http://localhost:5000/api/data?state=${selectedState}&district=${selectedDistrict}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  // Custom dot for the LineChart that registers a click.
  const CustomDot = (props) => {
    const { cx, cy, payload, value } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        stroke="#4F46E5"
        strokeWidth={2}
        fill="#fff"
        onClick={() => setSelectedMetric(`${payload.metric}: ${value}`)}
        style={{ cursor: 'pointer' }}
      />
    );
  };

  // Render the dotted line chart with a custom x-axis.
  const renderChart = () => {
    if (!data) return null;
    const chartData = Object.keys(data)
      .filter((key) => key !== 'S.no.')
      .map((key) => ({ metric: key, value: data[key] }));
      
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis 
              dataKey="metric" 
              tick={false} 
              label={{ 
                value: (selectedDistrict && selectedState) ? `District: ${selectedDistrict} State: ${selectedState}` : '', 
                position: 'insideBottom', 
                offset: -10, 
                fill: '#374151', 
                fontWeight: 'bold' 
              }} 
            />
            <YAxis stroke="#374151" />
            <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px' }} />
            <Legend wrapperStyle={{ color: '#374151' }} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#4F46E5" 
              strokeDasharray="5 5" 
              dot={<CustomDot />} 
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    );
  };

  // Render a plain text summary from the data with added description and italic styling.
  const renderSummaryText = () => {
    if (!data) return null;
    const summary = Object.entries(data)
      .filter(([key]) => key !== 'S.no.')
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    return (
      <>
        <p className="italic">
          Below is the comprehensive analysis of water resource data for the selected district.
          This summary highlights key metrics and offers insights into resource usage patterns.
        </p>
        <br />
        <p className="italic whitespace-pre-wrap">{summary}</p>
      </>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-blue-700 flex items-center">
            <BarChart2 className="mr-3" size={32} /> Water Resource Analytics
          </h1>
          {loading && <RefreshCw className="animate-spin text-blue-500" size={24} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Select State</label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('');
                setData(null);
              }}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a state</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Select District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              disabled={!selectedState}
            >
              <option value="">Select a district</option>
              {districts.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={fetchData}
          className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          Analyze Data
        </button>

        {loading && <p className="text-center text-blue-600 mt-4">Fetching data...</p>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        {data && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-bold text-blue-700">Graphical Representation</h2>
            {renderChart()}
            <h2 className="text-2xl font-bold text-blue-700 mt-6">Data Summary</h2>
            {selectedMetric ? (
              <div className="bg-gray-100 p-4 rounded-lg shadow-inner overflow-auto whitespace-pre-wrap">
                {selectedMetric}
              </div>
            ) : (
              <div className="bg-gray-100 p-4 rounded-lg shadow-inner overflow-auto">
                {renderSummaryText()}
              </div>
            )}
            {selectedMetric && (
              <button 
                onClick={() => setSelectedMetric(null)} 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset Selection
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
