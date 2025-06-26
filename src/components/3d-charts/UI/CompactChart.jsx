import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PieChart3D from '../Charts/PieChart3D';
import DonutChart3D from '../Charts/DonutChart3D';
import BarChart3D from '../Charts/BarChart3D';

function CompactScene({ data, type = 'pie', barLabelStyle = 'hover' }) {
  const renderChart = () => {
    switch (type) {
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
      {data && data.length > 0 && renderChart()}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={true}
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
  type = 'pie',
  title,
  height = '250px',
  barLabelStyle = 'hover'
}) {
  const isDataAvailable = Array.isArray(data) && data.length > 0;

  return (
    <div
      className="rounded-lg custom_border overflow-hidden flex flex-col h-full"
      style={{
        backgroundColor: 'var(--card-color)',
        borderColor: 'var(--primary-border-color)'
      }}
    >
      {title && (
        <div
          className="px-4 py-3 custom_border"
          style={{
            borderColor: 'var(--primary-border-color)',
            borderBottomWidth: '0.9px',
            borderStyle: 'solid'
          }}
        >
          <h4
            className="text-sm font-semibold"
            style={{ color: 'var(--card-Header-color)' }}
          >
            {title}
          </h4>
        </div>
      )}

      <div style={{ height }} className="relative flex-grow">
        <Canvas
          camera={{ position: [0, 2, 4], fov: 50 }}
          style={{ background: 'var(--card-color)' }}
        >
          <CompactScene
            data={data}
            type={type}
            barLabelStyle={barLabelStyle}
          />
        </Canvas>
      </div>

      <div
        className="px-4 py-2 custom_border"
        style={{
          backgroundColor: 'var(--popup-body-color)',
          borderColor: 'var(--primary-border-color)',
          borderTopWidth: '0.9px',
          borderStyle: 'solid'
        }}
      >
        <div className="flex flex-wrap gap-2">
          {isDataAvailable ? (
            <>
              {data.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: 'var(--bar-axis-color)' }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
              {data.length > 3 && (
                <span
                  className="text-xs"
                  style={{ color: 'var(--bar-axis-color)' }}
                >
                  +{data.length - 3} more
                </span>
              )}
            </>
          ) : (
            <span className="text-xs" style={{ color: 'var(--bar-axis-color)' }}>
              Loading data...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompactChart;
