import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '../Charts/Scene';
import Legend from '../UI/Legend';
import Statistics from '../UI/Statistics';
import DataTable from '../UI/DataTable';
import ChartSelector from '../UI/ChartSelector';
import BarChartControls from '../UI/BarChartControls';

function Dashboard({ data, isAnimating }) {
  const [activeChart, setActiveChart] = useState('pie');
  const [barLabelStyle, setBarLabelStyle] = useState('front');

  const getChartTitle = () => {
    switch (activeChart) {
      case 'donut':
        return '3D Donut Chart Visualization';
      case 'bar':
        return '3D Bar Chart Visualization';
      case 'pie':
      default:
        return '3D Pie Chart Visualization';
    }
  };

  const getChartInstructions = () => {
    switch (activeChart) {
      case 'bar':
        return '🖱️ Hover over bars • 🎯 Click and drag to rotate • 🔍 Scroll to zoom • 📊 Adjust label style below';
      case 'donut':
        return '🖱️ Hover over segments • 🎯 Click and drag to rotate • 🔍 Scroll to zoom • 💫 Center shows total';
      case 'pie':
      default:
        return '🖱️ Hover over segments • 🎯 Click and drag to rotate • 🔍 Scroll to zoom';
    }
  };

  return (
    <div
      className="container mx-auto px-6 py-8"
      style={{ color: 'var(--custom-color)' }}
    >
<div className="grid grid-cols-1 lg:grid-cols-3 gap-10 min-h-[600px]">
        {/* 3D Chart - 2 columns */}
        <div
          className="lg:col-span-2 rounded-xl border p-4 backdrop-blur-sm"
          style={{
            backgroundColor: 'var(--card-color)',
            borderColor: 'var(--primary-border-color)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xl font-semibold"
              style={{ color: 'var(--card-Header-color)' }}
            >
              {getChartTitle()}
            </h2>
            <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--bar-axis-color)' }}>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Real-time</span>
            </div>
          </div>

          <div className="h-[500px] rounded-lg overflow-hidden">
            <Canvas 
              camera={{ position: [0, 3, 5], fov: 60 }} 
              style={{ background: 'transparent' }}
            >
              <Scene 
                data={data} 
                isAnimating={isAnimating} 
                chartType={activeChart}
                barLabelStyle={barLabelStyle}
              />
            </Canvas>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm" style={{ color: 'var(--bar-axis-color)' }}>
              {getChartInstructions()}
            </p>
          </div>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          <ChartSelector 
            activeChart={activeChart} 
            onChartChange={setActiveChart} 
          />

          {activeChart === 'bar' && (
            <BarChartControls 
              labelStyle={barLabelStyle}
              onLabelStyleChange={setBarLabelStyle}
            />
          )}

          <Legend data={data} />
          <Statistics data={data} />
        </div>
      </div>

      {/* Data Table */}
      <div className="mt-8">
        <DataTable data={data} />
      </div>
    </div>
  );
}

export default Dashboard;
