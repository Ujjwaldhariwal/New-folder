import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '../Charts/Scene';
import DataTable from '../UI/DataTable';

function ChartModalContent({ chart, onClose }) {
  const [barLabelStyle, setBarLabelStyle] = useState('front');
  const [isAnimating, setIsAnimating] = useState(true);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  // Effect to detect theme changes on the root HTML element
  useEffect(() => {
    const checkTheme = () => {
      const currentlyDark = document.documentElement.classList.contains('dark');
      setIsDark(currentlyDark);
    };

    // Initial check is done in useState initializer, but we can do it again just in case.
    checkTheme(); 

    // Observe for class changes (like toggling 'dark' mode)
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Cleanup the observer when the component unmounts
    return () => observer.disconnect();
  }, []);

  const toggleAnimation = () => setIsAnimating((prev) => !prev);

  // Determine the correct color for the DataTable header based on the theme
  const overviewHeaderColor = isDark ? '#999999' : '#4a4a4a';

  // Fallback in case chart data is not available yet
  if (!chart || !chart.data) {
    return (
      <div className="p-6 text-center text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)]">
        Loading chart data...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary-light)] dark:text-[var(--text-primary-dark)] mb-2 sm:mb-0">
          {chart.title}
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--text-secondary-light)] dark:text-[var(--text-secondary-dark)] mr-4">
            {chart.type.toUpperCase()} CHART PREVIEW
          </p>
          <button
            onClick={toggleAnimation}
            className="px-3 py-1 text-sm rounded-lg font-semibold text-white bg-[var(--primary-accent)] hover:opacity-90 transition-opacity"
          >
            {isAnimating ? '⏸ Pause' : '▶ Play'}
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="h-[350px] sm:h-[400px] mb-6 rounded-lg overflow-hidden bg-gray-100 dark:bg-black/20">
        <Canvas camera={{ position: [0, 3, 5], fov: 60 }}>
          <Scene
            data={chart.data}
            isAnimating={isAnimating}
            chartType={chart.type}
            barLabelStyle={barLabelStyle}
          />
        </Canvas>
      </div>

      {/* Controls and Data Table */}
      <div className="space-y-6">
        <DataTable 
          data={chart.data} 
          headers={chart.tableHeaders}
          overviewHeaderColor={overviewHeaderColor} // Pass the dynamic color as a prop
        />
      </div>
    </div>
  );
}

export default ChartModalContent;
