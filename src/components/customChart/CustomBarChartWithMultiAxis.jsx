import dayjs from 'dayjs';
import React, { PureComponent, useEffect, useRef, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
  LabelList,
} from 'recharts';

const data1 = [
  { months: '2024-02', sla: 'Billing', package: 'All PKG', sla_target: 99.5, sla_achieved: 99.94 },
  { months: '2024-01', sla: 'Billing', package: 'All PKG', sla_target: 99.5, sla_achieved: 99.72 },
  { months: '2023-12', sla: 'Billing', package: 'All PKG', sla_target: 99.5, sla_achieved: 99.75 },
  { months: '2024-02', sla: 'Daily', package: 'All PKG', sla_target: 99.9, sla_achieved: 99.37 },
  { months: '2024-01', sla: 'Daily', package: 'All PKG', sla_target: 99.9, sla_achieved: 99.72 },
  { months: '2023-12', sla: 'Daily', package: 'All PKG', sla_target: 99.9, sla_achieved: 99.76 },
  { months: '2023-12', sla: 'Availibility', package: 'All PKG', sla_target: 99.5, sla_achieved: 100 },
  { months: '2023-11', sla: 'Availibility', package: 'All PKG', sla_target: 99.5, sla_achieved: 100 },
  { months: '2023-10', sla: 'Availibility', package: 'All PKG', sla_target: 99.5, sla_achieved: 99.96 },
  {
    months: '2023-12',
    sla: 'Meter Loss and Restoration of Power',
    package: 'All PKG',
    sla_target: 60,
    sla_achieved: 65.44,
  },
  {
    months: '2023-11',
    sla: 'Meter Loss and Restoration of Power',
    package: 'All PKG',
    sla_target: 60,
    sla_achieved: 63.61,
  },
  {
    months: '2023-10',
    sla: 'Meter Loss and Restoration of Power',
    package: 'All PKG',
    sla_target: 60,
    sla_achieved: 59.68,
  },
];

const monthTickFormatter = (tick) => {
  let forDate = dayjs(tick, 'YYYY-MM').format('MMM-YYYY');
  return forDate;
};

const monthLabelFormatter = (tick) => {
  //   const date = new Date(tick);
  //   return date.getMonth() + 1;
  let forDate = dayjs(tick, 'YYYY-MM').format('MMM-YYYY');
  return forDate;
};

const renderQuarterTick = (tickProps, data) => {
  const { x, y, index, payload } = tickProps;
  const { value, offset } = payload;
  const date = new Date(value);
  const month = index; //date.getMonth();
  //   const quarterNo = Math.floor(month / 3) + 1;
  let sla = data?.length > 0 ? data[index].sla : '';
  const isMidMonth = month % 3 === 1;

  if (month % 3 === 1) {
    if (sla == 'Meter Loss and Restoration of Power') {
      sla = 'Meter Loss & Restoration';
      return (
        <text x={x} y={y - 4} fill="rgb(154, 204, 209)" fontSize={'12'} textAnchor="middle">
          <tspan x={x} dy="50">{`Meter Loss `}</tspan>
          <tspan x={x} dy="1.3em">{`& Restoration`}</tspan>
        </text>
      );
    }
    return (
      <text x={x} y={y - 4} fill="rgb(154, 204, 209)" dy={50} fontSize={'12'} textAnchor="middle">{`${sla}`}</text>
    );
  }

  const isLast = month === 11;

  if (month != 0 && month % 3 === 0 && !isLast) {
    // const pathX = Math.floor(isLast ? x + 40 : x - offset) + 0.5;
    const pathX = Math.floor(x - offset) + 0.5;

    return <path d={`M${pathX},${y - 4}v${-35}`} strokeWidth="2" stroke="#7e8c9a" />;
  }

  return null;
};
const colors = ['#413aef', '#ff5700'];

export default function CustomBarChartWithMultiAxis({
  data,
  minYAxisVal,
  maxYAxisVal = 100,
  chartHeight = 320,
  xAxisAgnle = 0,
  xAxis_dyTick = 15,
  xAxis_dxTick = 0,
}) {
  const chartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [showToolTipList, setShowToolTipList] = useState(['Achieved', 'Target']);

  const CustomTooltip = (param) => {
    const { active, payload, label } = param;
    if (active && payload && payload.length) {
      // Extract the main bar payload
      // const mainBarPayload = payload.find(entry => entry.name === LegendName);

      const mainBarPayload = payload.filter((entry) => showToolTipList.includes(entry.name));

      return (
        <div className="tooltipCard">
          <span>{`${monthLabelFormatter(label)}`}</span>
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

  return (
    <div ref={chartRef} style={{ width: '100%' }}>
      <ComposedChart
        width={chartWidth}
        height={chartHeight}
        data={data}
        margin={{
          top: 25,
          right: 5,
          left: 5,
          bottom: 5,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis
          dataKey="months"
          tick={{ dy: xAxis_dyTick, dx: xAxis_dxTick }}
          fontSize={11}
          tickFormatter={monthTickFormatter}
          angle={xAxisAgnle}
          stroke="rgb(154, 204, 209)"
        />
        <XAxis
          dataKey="months"
          axisLine={false}
          tickLine={false}
          interval={0}
          tick={(e) => renderQuarterTick(e, data)}
          height={3}
          scale="auto"
          xAxisId="quarter"

          // tickMargin= {40}
        />
        <YAxis domain={[minYAxisVal, maxYAxisVal]} fontSize={11} stroke="rgb(154, 204, 209)" />
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
        <Legend wrapperStyle={{ paddingTop: 70 }} />
        <Bar dataKey="sla_achieved" barSize={10} name={'Achieved'} fill={colors[0]} legendType="square">
          <LabelList
            dataKey={'sla_achieved'}
            fontSize={'12px'}
            fontWeight={'500'}
            fill={colors[0]}
            position="top"
            className="animated-label"
          />
        </Bar>

        {/* <Bar dataKey="sla_target" name={'Target'} fill="#82ca9d" /> */}
        <Line
          type="monotone"
          dataKey={'sla_target'}
          name={'Target'}
          stroke={colors[1]}
          fill={colors[1]}
          strokeWidth={2}
          legendType="plainline"
          unit={'%'}
          dot={{ stroke: '#06345a', strokeWidth: 2, r: 3 }}
        />
      </ComposedChart>
    </div>
  );
}
