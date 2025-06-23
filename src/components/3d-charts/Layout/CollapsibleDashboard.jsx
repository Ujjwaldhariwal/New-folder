import React from 'react';
import CollapsibleSection from '../UI/CollapsibleSection';
import ChartGrid from '../common/ChartGrid';
import { dashboardSections } from '../data/dashboardData';
import { useCollapsibleSections } from '../hooks/useCollapsibleSections';

function CollapsibleDashboard() {
  const { openSections, toggleSection, closeAllSections, openAllSections } =
    useCollapsibleSections(dashboardSections);

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md shadow-sm border-b border-white/20 dark:border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                Collapsible 3D chart sections for comprehensive data analysis
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={closeAllSections}
                className="px-3 py-2 text-sm bg-gray-100/30 hover:bg-gray-100/50 text-gray-800 dark:text-white rounded-lg transition-colors duration-200"
              >
                Collapse All
              </button>
              <button
                onClick={openAllSections}
                className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                Expand All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {dashboardSections.map((section) => (
          <CollapsibleSection
            key={section.id}
            title={section.title}
            icon={section.icon}
            subtitle={section.subtitle}
            defaultOpen={openSections[section.id]}
          >
            <ChartGrid
              charts={section.charts}
              columns={section.charts.length <= 2 ? 2 : 3}
            />
          </CollapsibleSection>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 dark:border-white/10 mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 dark:text-gray-300 text-sm">
              © 2024 3D Analytics Dashboard. Interactive collapsible charts with React Three Fiber.
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="text-sm text-gray-500 dark:text-gray-300">
                {dashboardSections.reduce(
                  (total, section) => total + section.charts.length,
                  0
                )}{' '}
                Charts Active
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-300">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>System Ready</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default CollapsibleDashboard;
