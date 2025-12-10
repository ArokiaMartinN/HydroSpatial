import React, { useState, createContext, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Link } from 'react-router-dom';
import { Home, Bot, DropletIcon, FileCheck, Moon, Sun, BarChart2, Menu, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import Report from './components/RiskAnalysis'; // Ensure this points to your MillerColumns file
import WelcomePage from './components/WelcomePage';
import TermsAndConditions from './components/Terms';

type Theme = 'light' | 'dark';

const THEME_COLORS = {
  light: {
    bg: 'bg-gray-100',
    contentBg: 'bg-white',
    textPrimary: 'text-gray-800',
    textSecondary: 'text-gray-500',
    border: 'border-gray-200',
    brand: '#2563eb',
  },
  dark: {
    bg: 'bg-gray-900',
    contentBg: 'bg-gray-800',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-400',
    border: 'border-gray-700',
    brand: '#60a5fa',
  }
};

export const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
  themeColors: typeof THEME_COLORS.light;
}>({
  theme: 'dark',
  toggleTheme: () => {},
  themeColors: THEME_COLORS.dark,
});

const MainLayout: React.FC = () => {
  const { theme, toggleTheme, themeColors } = React.useContext(ThemeContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClasses = `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${themeColors.textSecondary}`;
  const activeLinkClasses = `!text-white ${theme === 'light' ? 'bg-blue-600' : 'bg-blue-500/40'}`;

  return (
    <div className={`min-h-screen ${themeColors.bg} ${themeColors.textPrimary} transition-colors duration-500 flex flex-col`}>
      <nav className={`${themeColors.contentBg} shadow-md sticky top-0 z-50 border-b ${themeColors.border}`}>
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <Link to="/" className="flex items-center z-50" onClick={() => setIsMobileMenuOpen(false)}>
              <DropletIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <span className={`text-xl font-bold ${themeColors.textPrimary}`}>HydroSpatial</span>
                <span className={`block text-xs ${themeColors.textSecondary}`}>India</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <NavLink to="/dashboard" className={({isActive}) => `${navLinkClasses} ${isActive && activeLinkClasses}`}><Home className="mr-2" size={18} />Home</NavLink>
              <NavLink to="/report" className={({isActive}) => `${navLinkClasses} ${isActive && activeLinkClasses}`}><BarChart2 className="mr-2" size={18} />Risk Analysis</NavLink>
              <NavLink to="/ai-assistant" className={({isActive}) => `${navLinkClasses} ${isActive && activeLinkClasses}`}><Bot className="mr-2" size={18} />AI Assistant</NavLink>
              <NavLink to="/terms" className={({isActive}) => `${navLinkClasses} ${isActive && activeLinkClasses}`}><FileCheck className="mr-2" size={18} />Terms</NavLink>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className={`p-2 rounded-full ${themeColors.textSecondary} hover:bg-gray-500/20 transition-colors`}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2 rounded-md ${themeColors.textPrimary}`}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className={`md:hidden absolute w-full ${themeColors.contentBg} border-b ${themeColors.border} shadow-lg p-4 flex flex-col space-y-2 z-40`}>
             <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/dashboard" className={({isActive}) => `${navLinkClasses} ${isActive && activeLinkClasses}`}><Home className="mr-2" size={20} />Home</NavLink>
             <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/report" className={({isActive}) => `${navLinkClasses} ${isActive && activeLinkClasses}`}><BarChart2 className="mr-2" size={20} />Risk Analysis</NavLink>
             <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/ai-assistant" className={({isActive}) => `${navLinkClasses} ${isActive && activeLinkClasses}`}><Bot className="mr-2" size={20} />AI Assistant</NavLink>
             <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/terms" className={({isActive}) => `${navLinkClasses} ${isActive && activeLinkClasses}`}><FileCheck className="mr-2" size={20} />Terms</NavLink>
          </div>
        )}
      </nav>

      <main className="flex-1 relative">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/report" element={<Report />} />
          <Route path="/terms" element={<TermsAndConditions />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const themeValues = useMemo(() => ({ theme, toggleTheme, themeColors: THEME_COLORS[theme] }), [theme]);

  return (
    <ThemeContext.Provider value={themeValues}>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;