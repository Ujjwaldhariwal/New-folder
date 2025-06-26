import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '../Charts/Scene';
import DataTable from '../UI/DataTable';

function ChartModalContent({ chart, onClose }) {
  const [barLabelStyle, setBarLabelStyle] = useState('front');
  const [isAnimating, setIsAnimating] = useState(true);

  const toggleAnimation = () => setIsAnimating((prev) => !prev);

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
        {/* The DataTable now receives the tableHeaders from the chart object */}
        <DataTable data={chart.data} headers={chart.tableHeaders} />
      </div>
    </div>
  );
}

export default ChartModalContent;
