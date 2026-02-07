
import React, { useState } from 'react';
import { LayoutDashboard, FlaskConical, Zap, Box, MessageSquare } from 'lucide-react';
import Dashboard from './components/Dashboard';
import AlloyDesign from './components/AlloyDesign';
import Optimization from './components/Optimization';
import Sidebar from './components/Sidebar';
import Inventory from './components/Inventory';
import Research from './components/Research';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'alloy-design': return <AlloyDesign />;
      case 'optimization': return <Optimization />;
      case 'inventory': return <Inventory />;
      case 'research': return <Research />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-steel-100 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
