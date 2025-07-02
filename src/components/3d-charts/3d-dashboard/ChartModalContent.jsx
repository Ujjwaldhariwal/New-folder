import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '../Charts/Scene';
import DataTable from '../UI/DataTable';

function ChartModalContent({ chart, onClose }) {
  const [barLabelStyle, setBarLabelStyle] = useState('front');
  const [isAnimating, setIsAnimating] = useState(true);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  
  // 1. STATE MANAGEMENT: The label state is correctly managed here.
  const [labels, setLabels] = useState([]);

  // Effect to detect theme changes on the root HTML element
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme(); 
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // 2. THE CLEANUP FIX: This effect correctly clears the labels
  // ONLY when the chart type changes away from 'pie'.
  useEffect(() => {
    if (chart.type !== 'pie') {
      setLabels([]);
    }
  }, [chart.type]); // This runs whenever the chart type changes.

  const toggleAnimation = () => setIsAnimating((prev) => !prev);
  const overviewHeaderColor = isDark ? '#999999' : '#4a4a4a';

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
            className="px-3 py-1 text-sm rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            {isAnimating ? '⏸ Pause' : '▶ Play'}
          </button>
        </div>
      </div>

      {/* 3D Canvas Container - position: relative is key */}
<div className="h-[350px] sm:h-[400px] mb-6 rounded-lg overflow-hidden relative"
     style={{ background: 'var(--body-color)' }}>
        <Canvas camera={{ position: [0, 3, 5], fov: 60 }}>
          {/* 3. PROP DRILLING: Pass `setLabels` down to the Scene component. */}
          <Scene
            data={chart.data}
            isAnimating={isAnimating}
            chartType={chart.type}
            barLabelStyle={barLabelStyle}
            onLabelsUpdate={setLabels}
          />
        </Canvas>
        
        {/* 4. LABEL RENDERING: This div sits on top of the canvas and renders the labels. */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {labels.map((label, i) => (
            <div
              key={i}
              className="pie-chart-html-label"
              style={{
                position: 'absolute',
                top: `${label.y}px`,
                left: `${label.x}px`,
                transform: 'translate(-50%, -50%)',
                opacity: label.isHovered ? 1 : 0.6,
                transition: 'opacity 0.2s',
              }}
            >
              <div className="pie-chart-label-name">{label.text}</div>
              <div className="pie-chart-label-value">{label.value}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Table section */}
      <div className="space-y-6">
        <DataTable 
          data={chart.data} 
          headers={chart.tableHeaders}
          overviewHeaderColor={overviewHeaderColor}
        />
      </div>
    </div>
  );
}

export default ChartModalContent;
