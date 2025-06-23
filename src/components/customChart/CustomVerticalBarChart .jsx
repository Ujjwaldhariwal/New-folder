import dayjs from 'dayjs';
import React, { PureComponent, useEffect, useRef, useState } from 'react';
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const data1 = [
  {
    months: '03-2024',
    sla: 'Block-12-Hrs',
    sla_achieved_8hrs: 99.31,
    sla_achieved_12hrs: 99.36,
    sla_target_8hrs: 98,
    sla_target_12hrs: 99,
  },
  {
    months: '02-2024',
    sla: 'Block-12-Hrs',
    sla_achieved_8hrs: 99.3,
    sla_achieved_12hrs: 99.36,
    sla_target_8hrs: 98,
    sla_target_12hrs: 99,
  },
  {
    months: '01-2024',
    sla: 'Block-12-Hrs',
    sla_achieved_8hrs: 99.27,
    sla_achieved_12hrs: 99.27,
    sla_target_8hrs: 98,
    sla_target_12hrs: 99,
  },
];

const monthTickFormatter = (tick) => {
  //   const date = new Date(tick);
  //   return date.getMonth() + 1;
  let forDate = dayjs(tick, 'MM-YYYY').format('MMM');
  return forDate;
};

const monthLabelFormatter = (tick) => {
  //   const date = new Date(tick);
  //   return date.getMonth() + 1;
  let forDate = dayjs(tick, 'MM-YYYY').format('MMM-YYYY');
  return forDate;
};

const CustomVertilcalBarChart = ({
  data,
  barDataKey1,
  barDataKey2,
  lineDataKey1,
  lineDataKey2,
  YAxisDataKey,
  barLegendName1,
  barLegendName2,
  lineLegendName1,
  lineLegendName2,
  chartHeight = 250,
  minXAxisVal = 0,
}) => {
  const chartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [showToolTipList, setShowToolTipList] = useState([
    barLegendName1,
    barLegendName2,
    lineLegendName1,
    lineLegendName2,
  ]);

  useEffect(() => {
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

  const CustomTooltip = (param) => {
    const { active, payload, label } = param;
    if (active && payload && payload.length) {
      // Extract the main bar payload
      // const mainBarPayload = payload.find(entry => entry.name === LegendName);

      const mainBarPayload = payload.filter((entry) => showToolTipList.includes(entry.name));

      return (
        <div
          style={{
            background: 'black',
            border: 'none',
            boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.2)',
            borderRadius: '5px',
            padding: '8px',
            color: '#333',
          }}
        >
          <span style={{ color: 'white', fontWeight: 'normal' }}>{`${monthLabelFormatter(label)}`}</span>
          <br />
          {mainBarPayload &&
            mainBarPayload.map((entry, index) => (
              <div key={`${entry.name}${index}`} style={{ marginTop: 5 }}>
                <span style={{ color: entry.color }}>{`${entry.name} : ${entry.value} `}</span>
              </div>
            ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div ref={chartRef} style={{ width: '100%' }}>
      <ComposedChart
        layout="vertical"
        width={chartWidth}
        height={chartHeight}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 5,
        }}
        barGap={0}
      >
        {/* <CartesianGrid stroke="#f5f5f5" /> */}
        <XAxis type="number" domain={[minXAxisVal, 100]} stroke="#7e8c9a" />
        <YAxis
          dataKey={YAxisDataKey}
          type="category"
          scale="auto"
          stroke="#7e8c9a"
          tickFormatter={monthTickFormatter}
        />
        <Tooltip
          contentStyle={{
            background: 'rgba(255, 255, 255, 0.8)',
            border: 'none',
            boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.2)',
            borderRadius: '5px',
            padding: '8px',
            color: '#333',
          }}
          content={CustomTooltip}
        />
        {/* <Legend /> */}

        <Bar dataKey={barDataKey1} barSize={15} fill="#0891b2" name={barLegendName1} />
        <Bar dataKey={barDataKey2} barSize={15} fill="var(--primary-color)" name={barLegendName2} />
        <Line
          dataKey={lineDataKey1}
          stroke="#0891b2"
          strokeWidth={2}
          name={lineLegendName1}
          dot={{ stroke: '#06345a', strokeWidth: 2, r: 3 }}
        />
        <Line
          dataKey={lineDataKey2}
          stroke="var(--primary-color)"
          strokeWidth={2}
          name={lineLegendName2}
          dot={{ stroke: '#06345a', strokeWidth: 2, r: 3 }}
        />
      </ComposedChart>
    </div>
  );
};

export default CustomVertilcalBarChart;
