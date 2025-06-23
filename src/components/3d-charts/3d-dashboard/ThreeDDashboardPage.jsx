import React, { useState } from 'react';
import Dashboard from '../Layout/Dashboard';
import CollapsibleDashboard from '../Layout/CollapsibleDashboard';
import { useChartData } from '../hooks/useChartData';

function ThreeDDashboardPage() {
  const [viewMode, setViewMode] = useState('collapsible'); 

  const {
    data,
    isAnimating,
    toggleAnimation
  } = useChartData();

  const toggleViewMode = () => {
    setViewMode(prev => (prev === 'standard' ? 'collapsible' : 'standard'));
  };

  if (viewMode === 'collapsible') {
    return <CollapsibleDashboard />;
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Dashboard
        data={data}
        isAnimating={isAnimating}
      />

      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button
                onClick={toggleViewMode}
                className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                Switch to {viewMode === 'standard' ? 'Collapsible' : 'Standard'} View
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>System Status: Operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ThreeDDashboardPage;
