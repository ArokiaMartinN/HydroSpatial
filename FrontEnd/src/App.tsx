import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import WelcomePage from './components/WelcomePage';
import Dashboard from './components/Dashboard';
import RiskAnalysis from './components/RiskAnalysis';
import AIAssistant from './components/AIAssistant';
import Settings from './components/Settings';
import Terms from './components/Terms';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<WelcomePage />} />

        {/* Protected layout routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/risk-analysis" element={<RiskAnalysis />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/terms" element={<Terms />} />
          {/* Fallback for old routes */}
          <Route path="/report" element={<Navigate to="/risk-analysis" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes >
    </Router >
  );
}

export default App;