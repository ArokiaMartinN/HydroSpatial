import React from 'react';
import { motion } from 'framer-motion';
import { DropletIcon, MapPin, BarChart as ChartBar, Database, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { themeColors } = React.useContext(ThemeContext);

  const FeatureCard = ({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) => (
    <div className={`${themeColors.contentBg} p-6 md:p-8 rounded-xl shadow-lg border ${themeColors.border} transition-colors duration-500`}>
      <div className="text-blue-500 mb-4">{icon}</div>
      <h3 className={`text-lg md:text-xl font-semibold ${themeColors.textPrimary} mb-2`}>{title}</h3>
      <p className={`text-sm md:text-base ${themeColors.textSecondary}`}>{text}</p>
    </div>
  );

  return (
    <div className={`min-h-screen ${themeColors.bg} flex items-center justify-center transition-colors duration-500`}>
      <div className="text-center max-w-5xl mx-auto px-4 py-12 md:py-16">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-10 md:mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-center mb-6">
            <DropletIcon className="h-16 w-16 md:h-24 md:w-24 text-blue-500 mb-4 md:mb-0" />
            <div className="md:ml-4 text-center md:text-left">
              {/* Responsive Text Sizes */}
              <h1 className={`text-4xl md:text-7xl font-bold ${themeColors.textPrimary}`}>HydroSpatial</h1>
              <p className="text-lg md:text-3xl text-blue-500 mt-2">India's Water Resource Analytics</p>
            </div>
          </div>
          <p className={`text-base md:text-lg ${themeColors.textSecondary} max-w-3xl mx-auto leading-relaxed`}>
            Discover comprehensive insights into India's water resources through advanced analytics and real-time visualization.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12"
        >
          <FeatureCard icon={<ChartBar size={40} />} title="Real-time Analytics" text="Interactive dashboards with live data visualization and trend analysis." />
          <FeatureCard icon={<MapPin size={40} />} title="Geographic Mapping" text="Detailed state and district-level water resource mapping." />
          <FeatureCard icon={<Database size={40} />} title="Data Intelligence" text="Advanced metrics and predictive analysis for water management." />
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full md:w-auto bg-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
          >
            Enter Dashboard <ArrowRight className="ml-3" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;