import React, { useEffect, useState } from 'react';
import CollapsibleSection from '../UI/CollapsibleSection';
import ChartGrid from '../common/ChartGrid';
import { dashboardSections as initialSections } from '../data/dashboardData';
import { useCollapsibleSections } from '../hooks/useCollapsibleSections';
import StatusCircleGrid from '../UI/StatusCircleGrid';
import CompactChart from '../UI/CompactChart';
import Modal from '../3d-dashboard/Modal';
import ChartModalContent from '../3d-dashboard/ChartModalContent';

function CollapsibleDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sections, setSections] = useState(initialSections);
  const { openSections, toggleSection, closeAllSections, openAllSections } = useCollapsibleSections(sections);

  // --- FIX ---
  // Modal state is now managed centrally by the dashboard.
  const [activeChart, setActiveChart] = useState(null);

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    Object.keys(openSections).forEach((sectionId) => {
      if (openSections[sectionId]) {
        const sectionIndex = sections.findIndex((s) => s.id === sectionId);
        if (sectionIndex === -1) return;

        sections[sectionIndex].charts.forEach((chart) => {
          if (chart.fetchData && !chart.data) {
            (async () => {
              const data = await chart.fetchData();
              setSections((currentSections) =>
                currentSections.map((sec) =>
                  sec.id === sectionId
                    ? { ...sec, charts: sec.charts.map((ch) => (ch.id === chart.id ? { ...ch, data } : ch)) }
                    : sec
                )
              );
            })();
          }
        });
      }
    });
  }, [openSections, sections]);

  const bodyStyle = {
    background: 'var(--body-color)',
    color: 'var(--custom-color)',
  };

  const cardHeaderColor = { color: 'var(--card-Header-color)' };
  const subTextColor = { color: 'var(--bar-axis-color)' };

  return (
    <div className="min-h-screen transition-colors duration-300" style={bodyStyle}>
      {/* Header */}
      <div
        className="backdrop-blur-md shadow-sm border-b"
        style={{
          background: 'var(--popup-body-color)',
          borderColor: 'rgba(255, 255, 255, 0.3)', // example subtle gray with transparency
        }}
      >
        
      </div>

      {/* Collapsible Sections */}
      <div className="container mx-auto px-6 py-8">
        {sections.map((section) => (
          <div key={section.id} className="mb-2">
            <CollapsibleSection
              title={section.title}
              icon={section.icon}
              subtitle={section.subtitle}
              isOpen={openSections[section.id]}
              onToggle={() => toggleSection(section.id)}
            >
              <div className="p-2">
                {section.id === 'connect-disconnect' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-1.5">
                    {/* Left side: Status Circles (Not clickable) */}
                    <div className="lg:col-span-2">
                      <StatusCircleGrid data={section.charts[0]?.data} isLoading={!section.charts[0]?.data} />
                    </div>
                    {/* Right side: Installed Meters Chart (Clickable) */}
                    <div className="lg:col-span-1 cursor-pointer" onClick={() => setActiveChart(section.charts[1])}>
                      <CompactChart {...section.charts[1]} height="250px" />
                    </div>
                  </div>
                ) : section.id === 'net-metering' ? (
                  <ChartGrid charts={section.charts} columns={1} onChartClick={setActiveChart} gapClass="gap-1.5" />
                ) : (
                  <ChartGrid
                    charts={section.charts}
                    columns={section.charts.length <= 2 ? 2 : 3}
                    onChartClick={setActiveChart}
                    gapClass="gap-1.5"
                  />
                )}
              </div>
            </CollapsibleSection>
          </div>
        ))}
      </div>

      {/* --- FIX: A single, centralized Modal for the entire dashboard --- */}
      <Modal isOpen={!!activeChart} onClose={() => setActiveChart(null)}>
        {activeChart && <ChartModalContent chart={activeChart} onClose={() => setActiveChart(null)} />}
      </Modal>

      {/* Footer */}
      <footer
        className="backdrop-blur-md border-t mt-12"
        style={{
          background: 'var(--popup-body-color)',
          borderColor: 'rgba(96, 96, 96, 0.3)', // example subtle gray with transparency
        }}
      >
      </footer>
    </div>
  );
}

export default CollapsibleDashboard;
