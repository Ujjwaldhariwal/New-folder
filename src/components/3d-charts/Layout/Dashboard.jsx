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
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        {/* 3D Chart - Takes up 2 columns on large screens */}
        <div className="lg:col-span-2 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {getChartTitle()}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
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
            <p className="text-gray-400 text-sm">
              {getChartInstructions()}
            </p>
          </div>
        </div>

        {/* Sidebar - Takes up 1 column */}
        <div className="space-y-6">
          <ChartSelector 
            activeChart={activeChart} 
            onChartChange={setActiveChart} 
          />
          
          {/* Show bar chart controls only when bar chart is active */}
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

      {/* Full width data table */}
      <div className="mt-8">
        <DataTable data={data} />
      </div>
    </div>
  );
}

export default Dashboard;