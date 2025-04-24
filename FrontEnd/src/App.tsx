import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, Bot, FileText, DropletIcon, FileCheck } from 'lucide-react';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import Report from './components/RiskAnalysis';
import WelcomePage from './components/WelcomePage';
import TermsAndConditions from './components/Terms';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-white">
              <div className="min-h-screen bg-white">
                <nav className="bg-white backdrop-blur-md shadow-lg sticky top-0 z-50">
                  <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                      <div className="flex items-center">
                        <DropletIcon className="h-8 w-8 text-blue-600" />
                        <div className="ml-2">
                          <span className="text-xl font-bold text-blue-600">HydroSpatial</span>
                          <span className="block text-xs text-gray-600">India</span>
                        </div>
                      </div>
                      <div className="flex space-x-8">
                        <Link
                          to="/dashboard"
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          <Home className="mr-2" size={20} />
                          Home
                        </Link>
                        <Link
                          to="/ai-assistant"
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          <Bot className="mr-2" size={20} />
                          AI Assistant
                        </Link>
                        <Link
                          to="/report"
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          <FileText className="mr-2" size={20} />
                          Report Analysis
                        </Link>
                        <Link
                          to="/terms"
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          <FileCheck className="mr-2" size={20} />
                          Terms & Conditions
                        </Link>
                      </div>
                    </div>
                  </div>
                </nav>

                <main className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ai-assistant" element={<AIAssistant />} />
                    <Route path="/report" element={<Report />} />
                    <Route path="/terms" element={<TermsAndConditions />} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
