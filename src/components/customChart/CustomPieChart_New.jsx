import React, { useEffect, useState, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import './customchart.css';
import useResponsive from '../../hooks/useResponsive';

const COLORS = ['#ff5700', '#009ffd', '#344bfe', '#00d7b4'];

const RADIAN = Math.PI / 180;
const THRESHOLD_PERCENT = 8;

const renderCustomizedLabelInside = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  if (percent < THRESHOLD_PERCENT / 100) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const renderCustomizedLabelOutside = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, fill }) => {
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill={fill} textAnchor="middle" dominantBaseline="central" fontSize={14}>
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const renderLegendColor = (value, entry) => {
  const { color } = entry;
  return <span style={{ color: 'black' }}>{value}</span>;
};

const CustomTooltip = (param) => {
  const { active, payload, data } = param;
  if (active && payload && payload.length) {
    // Extract the main bar payload
    const { name, value, dataKey } = payload[0];
    const total = data.reduce((acc, entry) => acc + entry[dataKey], 0);
    // const pr = ((value / total) * 100).toFixed(2);
    const percentage = `${((value / total) * 100).toFixed(1)}%`;

    return (
      <div className="tooltipCard">
        <span>{`${name}`}</span>
        <br />
        <div style={{ marginTop: 5 }}>
          <span style={{ color: '#0983a4' }}>{`Count : ${value}`}</span>
        </div>
        <div style={{ marginTop: 5 }}>
          <span style={{ color: '#0983a4' }}>{`Percentage : ${percentage}`}</span>
        </div>
      </div>
    );
  }

  return null;
};

const CustomPieChartNew = ({
  data,
  pieDataKey,
  pieNameKey,
  title,
  chartHeight = 330,
  colors = COLORS,
  radius = 190,
}) => {
  const chartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [pieChartRadius, setPieChartRadius] = useState(radius);
  const [legendAlignmnet, setLegendAlignment] = useState({
    align: 'right',
    verticalAlign: 'middle',
    layout: 'vertical',
  });
  const [legendWrapperStyle, setLegendWrapperStyle] = useState({ fontSize: '18px', right: '30px', padding: '10px' });

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    // --------------------------------
    // set Dynamic values for mobile device
    if (!isDesktop) {
      setPieChartRadius(90);
      setLegendAlignment({
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
      });
      setLegendWrapperStyle({
        fontSize: '16px',
        right: null,
        padding: '2px',
      });
    }
    // Function to calculate the width of the parent div
    const updateChartWidth = () => {
      if (chartRef.current) {
        const width = chartRef.current.clientWidth;
        setChartWidth(width);
      }
    };

    // Call the function initially and on window resize
    updateChartWidth();
    window.addEventListener('resize', updateChartWidth);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateChartWidth);
    };
  }, []);

  return (
    <div ref={chartRef} style={{ width: '100%', height: `${chartHeight + 30}px` }}>
      {/* { title && <h5 style={{ textAlign: 'left', margin: 0, padding: '10px', 
                            borderRadius:'0.3rem 0.3rem 0 0',
                            background: 'linear-gradient(to right, rgb(235 118 118), rgb(179 168 17))', 
                            color: 'white' }}>
                {title}
            </h5>
           } */}
      <PieChart
        width={chartWidth}
        height={chartHeight}
        margin={{
          top: 0,
          right: 0,
          bottom: 15,
          left: 0,
        }}
      >
        <Pie
          data={data}
          dataKey={pieDataKey}
          nameKey={pieNameKey}
          cx="50%"
          cy="50%"
          innerRadius={pieChartRadius / 2} // Set the innerRadius to create a donut chart
          outerRadius={pieChartRadius}
          // outerRadius={pieChartRadius}
          fill="transparent"
          labelLine={true}
          label={renderCustomizedLabelOutside}
          legendType="circle"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="transparent" />
          ))}
        </Pie>

        <Pie
          data={data}
          dataKey={pieDataKey}
          nameKey={pieNameKey}
          cx="50%"
          cy="50%"
          innerRadius={pieChartRadius}
          outerRadius={pieChartRadius}
          fill="transparent"
          label={false}
          legendType="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="transparent" />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            background: 'rgba(255, 255, 255, 0.8)',
            border: 'none',
            boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.2)',
            borderRadius: '5px',
            padding: '8px',
            color: '#333',
          }}
          content={<CustomTooltip data={data} />}
        />
      </PieChart>
    </div>
  );
};

export default CustomPieChartNew;
