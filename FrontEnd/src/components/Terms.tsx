import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Lock, AlertCircle, RefreshCw, ChevronRight, CheckCircle2 } from 'lucide-react';
import { ThemeContext } from '../App';

const TermsAndConditions: React.FC = () => {
  const { themeColors } = React.useContext(ThemeContext);
  const [activeSection, setActiveSection] = useState<string>('intro');

  // Configuration
  const sections = [
    { id: 'intro', title: 'Introduction', icon: <FileText size={18} /> },
    { id: 'data-usage', title: 'Data Usage', icon: <Shield size={18} /> },
    { id: 'privacy', title: 'Privacy & Security', icon: <Lock size={18} /> },
    { id: 'disclaimer', title: 'Disclaimer', icon: <AlertCircle size={18} /> },
    { id: 'updates', title: 'Updates', icon: <RefreshCw size={18} /> },
  ];

  // --- SCROLL SPY LOGIC ---
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollY + windowHeight >= documentHeight - 50) {
        setActiveSection('updates');
        return;
      }

      if (scrollY < 100) {
        setActiveSection('intro');
        return;
      }

      const triggerPoint = scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (triggerPoint >= offsetTop && triggerPoint < offsetBottom) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="relative w-full min-h-screen">
      
      {/* FIXED BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/20" />
        <div className="absolute top-20 left-[-100px] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[-100px] w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      {/* Added px-4 for mobile padding */}
      <div className="max-w-7xl mx-auto pt-8 px-4 md:px-6 pb-24 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
          
          {/* --- LEFT SIDEBAR (Hidden on Mobile) --- */}
          <div className="hidden lg:block">
             <div className="sticky top-24">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-2xl backdrop-blur-md border ${themeColors.border} shadow-lg bg-white/80 dark:bg-gray-900/80`}
                >
                  <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 px-4 ${themeColors.textSecondary}`}>
                    Table of Contents
                  </h3>
                  <ul className="space-y-1">
                    {sections.map((section) => {
                      const isActive = activeSection === section.id;
                      return (
                        <li key={section.id} className="relative">
                          <button
                            onClick={() => scrollToSection(section.id)}
                            className={`relative w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 z-10 ${
                              isActive 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : `${themeColors.textSecondary} hover:${themeColors.textPrimary}`
                            }`}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              />
                            )}
                            
                            <span className="relative z-10">{section.icon}</span>
                            <span className="relative z-10">{section.title}</span>
                            
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute right-3 text-blue-500 z-10"
                              >
                                <ChevronRight size={14} />
                              </motion.div>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
             </div>
          </div>

          {/* --- RIGHT CONTENT --- */}
          <div className="space-y-12 md:space-y-16 min-h-screen"> 
            
            {/* Header / Intro */}
            <motion.section 
              id="intro" 
              initial="hidden" 
              animate="visible" 
              variants={fadeInUp}
              className="scroll-mt-24"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                LEGALLY BINDING
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  Terms & Conditions
                </span>
              </h1>
              <p className={`text-base md:text-lg ${themeColors.textSecondary} max-w-2xl leading-relaxed`}>
                Please read these terms carefully before using our HydroSpatial platform. 
                Last updated: <span className="font-semibold text-blue-600 dark:text-blue-400">{new Date().toLocaleDateString()}</span>
              </p>
            </motion.section>

            <hr className="border-gray-200 dark:border-gray-800" />

            {/* Data Usage */}
            <motion.section 
              id="data-usage" 
              initial="hidden" 
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="scroll-mt-24"
            >
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <Shield size={28} strokeWidth={1.5} />
                </div>
                <div className="space-y-4 w-full">
                   <h2 className={`text-xl md:text-2xl font-bold ${themeColors.textPrimary}`}>Data Usage Policy</h2>
                   <p className={`${themeColors.textSecondary} leading-relaxed text-sm md:text-base`}>
                     The water resource data provided through HydroSpatial India is intended for informational purposes only. By accessing our data, you agree to the following strict usage guidelines:
                   </p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-4">
                     {['Responsible Usage', 'No Redistribution', 'Source Attribution', 'Report Inaccuracies'].map((item, i) => (
                       <div key={i} className={`flex items-center gap-3 p-3 md:p-4 rounded-lg border ${themeColors.border} hover:border-blue-300 transition-colors bg-white dark:bg-gray-900/50`}>
                         <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                         <span className={`font-medium text-sm md:text-base ${themeColors.textPrimary}`}>{item}</span>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </motion.section>

            {/* Privacy */}
            <motion.section 
              id="privacy" 
              initial="hidden" 
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="scroll-mt-24"
            >
               <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                  <Lock size={28} strokeWidth={1.5} />
                </div>
                <div className="space-y-4 w-full">
                  <h2 className={`text-xl md:text-2xl font-bold ${themeColors.textPrimary}`}>Privacy & Security</h2>
                  <p className={`${themeColors.textSecondary} leading-relaxed text-sm md:text-base`}>
                    We utilize industry-standard encryption (AES-256) to protect your personal information. We maintain a strict policy of transparency regarding data collection.
                  </p>
                  <ul className="space-y-3 pl-1 mt-2 text-sm md:text-base">
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      <span className={themeColors.textSecondary}>No data sharing with third-parties without explicit consent.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      <span className={themeColors.textSecondary}>Regular vulnerability assessments and security audits.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Disclaimer */}
            <motion.section 
              id="disclaimer" 
              initial="hidden" 
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="scroll-mt-24"
            >
               <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                  <AlertCircle size={28} strokeWidth={1.5} />
                </div>
                <div className="space-y-4 w-full">
                  <h2 className={`text-xl md:text-2xl font-bold ${themeColors.textPrimary}`}>Disclaimer</h2>
                  <div className={`p-4 md:p-6 rounded-xl bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30`}>
                    <p className={`${themeColors.textSecondary} leading-relaxed italic text-sm md:text-base`}>
                      "While we strive to maintain accurate and up-to-date information, HydroSpatial India makes no warranties about the completeness, reliability, or accuracy of the data. Users acknowledge that any reliance on the information is at their own risk."
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Updates */}
            <motion.section 
              id="updates" 
              initial="hidden" 
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="scroll-mt-24"
            >
               <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
                  <RefreshCw size={28} strokeWidth={1.5} />
                </div>
                <div className="space-y-4 w-full">
                  <h2 className={`text-xl md:text-2xl font-bold ${themeColors.textPrimary}`}>Updates to Terms</h2>
                  <p className={`${themeColors.textSecondary} leading-relaxed text-sm md:text-base`}>
                    These terms may be updated periodically. We will notify you of significant changes via email. Continued use of the platform constitutes acceptance of the updated terms.
                  </p>
                </div>
              </div>
            </motion.section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;