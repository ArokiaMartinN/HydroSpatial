import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { DropletIcon, MapPin, BarChart as ChartBar, Database, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(v => {
      if (v >= 0.9 && !shouldNavigate) {
        setShouldNavigate(true);
        setTimeout(() => navigate('/dashboard'), 500);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, navigate, shouldNavigate]);

  return (
    <div className="min-h-[200vh] bg-white">
      <motion.div
        style={{ opacity, scale }}
        className="fixed inset-0 flex flex-col items-center justify-center bg-white"
      >
        <div className="text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center mb-6">
              <DropletIcon className="h-24 w-24 text-blue-600" />
              <div className="ml-4 text-left">
                <h1 className="text-7xl font-bold text-blue-900">HydroSpatial</h1>
                <p className="text-3xl text-blue-600">India's Water Resource Analytics</p>
              </div>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover comprehensive insights into India's water resources through advanced analytics 
              and real-time visualization.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <div className="bg-blue-50 p-8 rounded-xl shadow-lg">
              <ChartBar className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Real-time Analytics</h3>
              <p className="text-gray-600">Interactive dashboards with live data visualization and trend analysis.</p>
            </div>

            <div className="bg-blue-50 p-8 rounded-xl shadow-lg">
              <MapPin className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Geographic Mapping</h3>
              <p className="text-gray-600">Detailed state and district-level water resource mapping.</p>
            </div>

            <div className="bg-blue-50 p-8 rounded-xl shadow-lg">
              <Database className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Data Intelligence</h3>
              <p className="text-gray-600">Advanced metrics and predictive analysis for water management.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-gray-500 animate-bounce"
          >
            <p className="mb-2">Scroll down to explore</p>
            <ArrowDown className="mx-auto h-6 w-6" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;