import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const RadialBarChart = ({ seriesData, label, progessbarColor, innerCircleColor, subject }) => {
  const processedSeriesData = parseFloat(seriesData.toString().replace('%', ''));
  const [isShowChartVal, setIsShowChartVal] = useState(false);

  useEffect(() => {
    if (seriesData !== 0) {
      setIsShowChartVal(true);
    }
  }, [seriesData]);

  const options = {
    chart: {
      type: 'radialBar',
    },
    animations: {
      enabled: true, 
      easing: 'easeout', // You can try 'linear', 'easein', 'easeout', etc.
      speed: 90000000, // Adjust this value to control the speed (default is 800ms)
      animateGradually: {
        enabled: true,
        delay: 20000000, // Delay before animating each segment (if applicable)
      },
      dynamicAnimation: {
        enabled: true,
        speed: 20000000000, // Speed of dynamic animation on updates
      },
    },
    plotOptions: {
      radialBar: {
        track: {
          background: innerCircleColor,
          strokeWidth: '100%',
        },
        hollow: {
          size: '65%',
          margin: -0,
          background: innerCircleColor,
        },
        dataLabels: {
          show: true,
          name: {
            show: !isShowChartVal,
            fontSize: '20px',
            color: '#333',
            offsetY: 5,
            formatter: () => "Loading...",
          },
          value: {
            fontSize: '22px',
            show: isShowChartVal,
            color: '#333',
            offsetY: 5,
            fontWeight: 'bold',
            formatter: (val) => val.toFixed(0),
          },
        },
        startAngle: 0,
        endAngle: 360,
      },
    },
    fill: {
      type: 'solid', // Use gradient fill
      colors: progessbarColor,
    },
    stroke: {
      lineCap: 'round',
    },
    labels: [subject], // Label for the progress bar
  };

  const series = [processedSeriesData || 0]; // Progress data

  return (
    <div
      id="chart"
      style={{
        padding: '10px 15px 20px 0px',
      }}
    >
      <Chart options={options} series={series} type="radialBar" width={190} height={210} />
      <div className="flex justify-center items-center text-cardHeader font-semibold mt-2">
        <span className="inline-block rounded-full w-4 h-4 mr-2" style={{ backgroundColor: progessbarColor }}></span>
        {label}
      </div>
    </div>
  );
};

export default RadialBarChart;
