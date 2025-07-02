import React, { useState } from 'react';
import CollapsibleDashboard from '../Layout/CollapsibleDashboard';

function ThreeDDashboardPage() {
  const [viewMode, setViewMode] = useState('collapsible');

  const toggleViewMode = () => {
    setViewMode(prev => (prev === 'standard' ? 'collapsible' : 'standard'));
  };

  if (viewMode === 'collapsible') {
    return <CollapsibleDashboard />;
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--body-color)' }}
    >
      {/* This would be the placeholder for the standard, non-collapsing dashboard view */}
      {/* <Dashboard /> */}
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold">Standard Dashboard View</h1>
        <p className="text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">
          This view is not yet implemented.
        </p>
      </div>

      <footer
        className="backdrop-blur-sm border-t mt-12"
        style={{
          backgroundColor: 'var(--card-color)',
          borderColor: 'var(--primary-border-color)'
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-center items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleViewMode}
                className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-[var(--primary-accent)] hover:opacity-90 transition-opacity"
              >
                Switch to {viewMode === 'standard' ? 'Collapsible' : 'Standard'} View
              </button>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ThreeDDashboardPage;