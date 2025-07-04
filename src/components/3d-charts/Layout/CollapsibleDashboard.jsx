import React, { useState, useEffect, useCallback } from 'react';
import CollapsibleSection from '../UI/CollapsibleSection';
import ChartGrid from '../common/ChartGrid';
import { dashboardSections } from '../data/dashboardData';
import StatusCircleGrid from '../UI/StatusCircleGrid';
import CompactChart from '../UI/CompactChart';
import Modal from '../3d-dashboard/Modal';
import ChartModalContent from '../3d-dashboard/ChartModalContent';

// Helper function to initialize the open/closed state of sections
const initializeOpenSections = () => {
  const initialState = {};
  dashboardSections.forEach(section => {
    initialState[section.id] = !!section.defaultOpen;
  });
  return initialState;
};

function CollapsibleDashboard() {
  const [openSections, setOpenSections] = useState(initializeOpenSections);
  const [chartData, setChartData] = useState({});
  const [activeChart, setActiveChart] = useState(null);
  // NEW: Track loading and error states for each section
  const [sectionStates, setSectionStates] = useState({});

  // --- MODIFIED: The data fetching function now properly throws errors ---
  const fetchDataForSection = useCallback(async (sectionId) => {
    const section = dashboardSections.find(s => s.id === sectionId);
    if (!section) {
      throw new Error(`Section ${sectionId} not found`);
    }

    // Update section state to loading
    setSectionStates(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], loading: true, error: null }
    }));

    const chartPromises = section.charts.map(async (chartConfig) => {
      if (chartConfig.fetchData) {
        try {
          const data = await chartConfig.fetchData();
          return { chartId: chartConfig.id, data, success: true };
        } catch (error) {
          console.error(`Failed to fetch data for chart ${chartConfig.id}:`, error);
          return { chartId: chartConfig.id, data: null, success: false, error };
        }
      }
      return { chartId: chartConfig.id, data: chartConfig.data || [], success: true };
    });

    const results = await Promise.all(chartPromises);

const hasFailures = results.some(result => !result.success);

setChartData(prevData => {
  const newData = { ...prevData };
  results.forEach(({ chartId, data, success }) => {
    newData[chartId] = success
      ? data
      : [{ id: -1, label: 'Data N/A', value: 0, color: '#5588ff' }]; 
  });
  return newData;
});


    // Update section state
    setSectionStates(prev => ({
      ...prev,
      [sectionId]: { 
        ...prev[sectionId], 
        loading: false, 
        error: hasFailures ? new Error(`Failed to fetch data for some charts in section ${sectionId}`) : null
      }
    }));

    // If any chart failed, throw an error to trigger the red cross
    if (hasFailures) {
      throw new Error(`Failed to fetch data for some charts in section ${sectionId}`);
    }
  }, []);

  // --- MODIFIED: handleRefresh now properly handles and propagates errors ---
  const handleRefresh = async (sectionId) => {
    console.log(`Refreshing data for section: ${sectionId}`);
    
    try {
      // Await the data fetching process
      await fetchDataForSection(sectionId);
      console.log(`Successfully refreshed data for section: ${sectionId}`);
    } catch (error) {
      console.error(`Failed to refresh data for section ${sectionId}:`, error);
      // Re-throw the error so the RefreshButton can catch it and show the red cross
      throw error;
    }
  };

  const handleToggle = (sectionId) => {
    const isOpening = !openSections[sectionId];
    setOpenSections(prev => ({ ...prev, [sectionId]: isOpening }));

    if (isOpening) {
      const sectionCharts = dashboardSections.find(s => s.id === sectionId)?.charts || [];
      const hasData = sectionCharts.every(c => chartData[c.id]);
      if (!hasData) {
        // Just trigger the fetch, don't catch errors
        // The RefreshButton will handle showing success/error states when manually clicked
        fetchDataForSection(sectionId).catch(error => {
          console.error(`Failed to fetch initial data for section ${sectionId}:`, error);
        });
      }
    }
  };

  useEffect(() => {
    for (const sectionId in openSections) {
      if (openSections[sectionId]) {
        // Just trigger the fetch, don't catch errors
        // The RefreshButton will handle showing success/error states when manually clicked
        fetchDataForSection(sectionId).catch(error => {
          console.error(`Failed to fetch initial data for section ${sectionId}:`, error);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--body-color)' }}>
      <div className="container mx-auto px-6 py-8">
        {dashboardSections.map((section) => (
          <div key={section.id} className="mb-2">
            <CollapsibleSection
              title={section.title}
              subtitle={section.subtitle}
              isOpen={!!openSections[section.id]}
              onToggle={() => handleToggle(section.id)}
              // Pass the async refresh handler to the section
              onRefresh={() => handleRefresh(section.id)}
              // NEW: Pass section state for better error handling
              sectionState={sectionStates[section.id]}
            >
              <div className="p-2">
                {/* Your existing rendering logic remains the same */}
                {section.id === 'connect-disconnect' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-1.5">
                    <div className="lg:col-span-2">
                      <StatusCircleGrid 
                        data={chartData[section.charts[0].id]} 
                        isLoading={!chartData[section.charts[0].id] && chartData[section.charts[0].id] !== null} 
                      />
                    </div>
                    <div className="lg:col-span-1 cursor-pointer" onClick={() => setActiveChart({ ...section.charts[1], data: chartData[section.charts[1].id] })}>
                      <CompactChart {...section.charts[1]} data={chartData[section.charts[1].id]} height="250px" />
                    </div>
                  </div>
                ) : section.id === 'net-metering' ? (
                  <ChartGrid 
                    charts={section.charts.map(c => ({...c, data: chartData[c.id]}))} 
                    columns={1} 
                    onChartClick={(chart) => setActiveChart({...chart, data: chartData[chart.id]})} 
                    gapClass="gap-1.5" 
                  />
                ) : (
                  <ChartGrid
                    charts={section.charts.map(c => ({...c, data: chartData[c.id]}))}
                    columns={section.charts.length <= 2 ? 2 : 3}
                    onChartClick={(chart) => setActiveChart({...chart, data: chartData[chart.id]})}
                    gapClass="gap-1.5"
                  />
                )}
              </div>
            </CollapsibleSection>
          </div>
        ))}
      </div>

      <Modal isOpen={!!activeChart} onClose={() => setActiveChart(null)}>
        {activeChart && <ChartModalContent chart={activeChart} onClose={() => setActiveChart(null)} />}
      </Modal>

      <footer
        className="backdrop-blur-md border-t mt-12"
        style={{ background: 'var(--popup-body-color)', borderColor: 'rgba(96, 96, 96, 0.3)' }}
      ></footer>
    </div>
  );
}

export default CollapsibleDashboard;