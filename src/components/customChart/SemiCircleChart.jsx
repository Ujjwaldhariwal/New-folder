import React from 'react';
import Chart from 'react-apexcharts';
import { FaArrowDown } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa6";
const SemiCircleChart = ({ seriesData, label }) => {
  const options = {
    chart: {
      type: 'radialBar',
      offsetY: -20, // Shift chart upwards to simulate semi-circle
    },
    plotOptions: {
      radialBar: {
        startAngle: -90, // Start from the top
        endAngle: 90, // End at the bottom
        hollow: {
          size: '65%',
        },
        track: {
          background: '#d3d3d3', // Light gray track color
          strokeWidth: '100%', // Full thickness for track
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '15px',
            fontWeight: 'bold',
            color: '#637381', // Dark color for the name
            offsetY: 0, // Adjust position inside the chart
          },
          value: {
            show: true,
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'var(--primary-color)', // Dark blue value color
            offsetY: -40, // Adjust position inside the chart
          },
          subject: {},
        },
      },
    },
    fill: {
      type: 'solid',
      colors: ['#5c59e8'], // Dark blue progress bar
    },
    stroke: {
      lineCap: 'round', // Rounded edges for the progress bar
    },
    labels: [label], // Data label
  };

  const series = [seriesData || 0]; // Percentage value (progress)

  return (
    <div
      style={{
        padding: '20px',
      }}
    >
      <div className="flex justify-center items-center h-44">
        <Chart options={options} series={series} type="radialBar" width={300} />
      </div>
      <div className="text-center text-gray-400 -mt-8">You succeed SLA Achieved today</div>
      <div className="flex justify-between items-center mt-3">
        <div className="text-gray-400 text-xs">SLA Target</div>
        <div className="text-gray-400 text-xs">SLA Achieved</div>
        <div className="text-gray-400 text-xs">Today</div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-[#637381] text-lg flex items-start gap-1">
          <p>99%</p><span className='mt-1'> <FaArrowDown className='text-red-600' /></span>
        </div>
        <div className="text-[#637381] text-lg flex items-start gap-1">
        <p>99.3%</p> <span className='mt-1'><FaArrowUp className='text-green-700' /></span>
        </div>
        <div className="text-[#637381] text-lg flex items-start gap-1">
        <p>99.4%</p><span className='mt-1'> <FaArrowUp className='text-green-700' /></span>
        </div>
      </div>
    </div>
  );
};

export default SemiCircleChart;
