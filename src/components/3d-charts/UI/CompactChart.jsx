import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PieChart3D from '../Charts/PieChart3D';
import DonutChart3D from '../Charts/DonutChart3D';
import BarChart3D from '../Charts/BarChart3D';

function CompactScene({ data, chartType = 'pie', barLabelStyle = 'hover' }) {
  const renderChart = () => {
    switch (chartType) {
      case 'donut':
        return <DonutChart3D data={data} />;
      case 'bar':
        return <BarChart3D data={data} labelStyle={barLabelStyle} />;
      case 'pie':
      default:
        return <PieChart3D data={data} />;
    }
  };

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, -5]} intensity={0.4} />
      <directionalLight position={[3, 3, 3]} intensity={0.3} />
      
      {renderChart()}
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={false} // Disabled auto-rotation
        minDistance={2}
        maxDistance={8}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
}

function CompactChart({ 
  data, 
  chartType = 'pie', 
  title, 
  height = '250px',
  barLabelStyle = 'hover'
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {title && (
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
        </div>
      )}
      
      <div style={{ height }} className="relative">
        <Canvas 
          camera={{ position: [0, 2, 4], fov: 50 }} 
          style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}
        >
          <CompactScene 
            data={data} 
            chartType={chartType}
            barLabelStyle={barLabelStyle}
          />
        </Canvas>
      </div>
      
      {/* Small legend below chart */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          {data.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center space-x-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
          {data.length > 3 && (
            <span className="text-xs text-gray-400">+{data.length - 3} more</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompactChart;