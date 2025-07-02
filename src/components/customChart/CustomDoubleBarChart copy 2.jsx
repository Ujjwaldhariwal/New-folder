import React, { useState, useEffect, useRef } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, BarChart, Line } from 'recharts';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

function CustomDoubleBarChart({
  data,
  title,
  xAxisDataKey,
  barDataKey1,
  barDataKey2,
  lineDataKey1,
  lineDataKey2,
  LegendName1,
  LegendName2,
  LineLegendName1,
  LineLegendName2,
  yAxisLabel,
  minYAixsVal = 0,
  isShowLineChart = true,
  showLabelList = true,
  xAxisAgnle = 0,
  unit = '%',
  xAxisOffset = 0,
  chartHeight = 400,
  xAxis_dyTick = 15,
  xAxis_dxTick = 0,
  legendBottom = 15,
  legendTop = 20,
  barSize = 20,
  barLabelAngle = 0,
  barLabelDX = 0,
  barLabelDY = 0,
  chartTopPadding = 10,
  displayLegend = true,
  applyTickFormatter = false,
  addExtraHeight = true,
}) {
  const chartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);
  const colors = ['#029ffc', '#fda5a4'];
  const [showToolTipList, setShowToolTipList] = useState([LegendName1, LegendName2, LineLegendName1, LineLegendName2]);

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

  const GradientBar = ({ x, y, width, height, color }) => (
    <g>
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity={1} />
          <stop offset="100%" stopColor={color} stopOpacity={1} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={width} height={height} rx={5} ry={5} fill={`url(#gradient-${color})`} />
    </g>
  );

  const formatYAxisTick = (tick) => `${tick}${unit}`;

  const monthTickFormatter = (tick) => {
    if (!applyTickFormatter) return tick;
    //   const date = new Date(tick);
    //   return date.getMonth() + 1;
    let forDate = dayjs(tick, 'MM-YYYY').format('MMM-YYYY');
    return forDate;
  };

  const monthLabelFormatter = (tick) => {
    if (!applyTickFormatter) return tick;
    let forDate = dayjs(tick, 'MM-YYYY').format('MMM-YYYY');
    return forDate;
  };

  const CustomTooltip = (param) => {
    const { active, payload, label } = param;
    if (active && payload && payload.length) {
      // Extract the main bar payload
      // const mainBarPayload = payload.find(entry => entry.name === LegendName);

      const mainBarPayload = payload.filter((entry) => showToolTipList.includes(entry.name));

      return (
        <div
          className="tooltipCard"
          style={{ border: 'none', boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.2)', borderRadius: '5px', padding: '10px' }}
        >
          <span style={{ fontWeight: 'normal' }}>{`${monthLabelFormatter(label)}`}</span>
          <br />
          {mainBarPayload &&
            mainBarPayload.map((entry, index) => (
              <div key={`${entry.name}${index}`} style={{ marginTop: 8 }}>
                <span style={{ color: entry.color }}>{`${entry.name} : ${entry.value} `}</span>
              </div>
            ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div ref={chartRef} style={{ width: '100%', height: `${addExtraHeight ? chartHeight + 30 : chartHeight}px` }}>
      {title && (
        <h5
          style={{
            textAlign: 'start',
            margin: 0,
            padding: '14px',
            color: 'white',
            borderBottom: '1px solid var(--primary-border-color)',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {title}
        </h5>
      )}
      <ComposedChart
        width={chartWidth}
        height={chartHeight}
        data={data}
        margin={{
          top: chartTopPadding,
          right: 20,
          bottom: 50,
          left: 0,
        }}
        barGap={8} // Space between bars in the same category
        // barCategoryGap="10%"
      >
        {/* <CartesianGrid stroke="#205c8e" /> */}
        <XAxis
          padding={{ top: 0, left: 0 }}
          dataKey={xAxisDataKey}
          // label={{ value: 'Date', position: 'insideBottomLeft', offset: -5 }}
          label={{ value: '', position: 'insideBottomLeft', offset: xAxisOffset }}
          type="category"
          fontSize={11}
          axisLine={false}
          angle={xAxisAgnle}
          interval={0}
          tick={{ dy: xAxis_dyTick, dx: xAxis_dxTick }}
          stroke="rgb(154, 204, 209)"
          tickFormatter={monthTickFormatter}
        />
        <YAxis
          domain={[minYAixsVal, 100]}
          stroke="rgb(154, 204, 209)"
          tickFormatter={formatYAxisTick}
          fontSize={11}
          label={{ value: ``, angle: -90, position: 'insideLeft', offset: 13 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'black',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '8px',
          }}
          content={CustomTooltip}
        />
        {/* <Legend align="center" verticalAlign="bottom" layout="horizontal" wrapperStyle={{ paddingTop: 10}} /> */}
        <Legend
          align="start"
          verticalAlign="top"
          layout="horizontal"
          iconType="circle"
          wrapperStyle={{
            top: 0,
            paddingTop: legendTop,
            paddingLeft: '20px',
            bottom: legendBottom,
            fontSize: '13px',
            visibility: displayLegend ? 'visible' : 'hidden',
          }}
        />

        <Bar
          dataKey={barDataKey1}
          barSize={barSize}
          fill={colors[0]}
          unit={unit}
          shape={<GradientBar color={colors[0]} />}
          name={LegendName1 ? LegendName1 : barDataKey1}
        >
          <LabelList
            dataKey={barDataKey1}
            fontSize={'12px'}
            position="top"
            fill={colors[0]}
            angle={barLabelAngle}
            dx={barLabelDX}
            dy={barLabelDY}
            className="animated-label"
          />
        </Bar>

        <Bar
          dataKey={barDataKey2}
          barSize={barSize}
          fill={colors[1]}
          unit={unit}
          shape={<GradientBar color={colors[1]} />}
          name={LegendName2 ? LegendName2 : barDataKey2}
        >
          <LabelList
            dataKey={barDataKey2}
            fontSize={'12px'}
            position="top"
            fill={colors[1]}
            angle={barLabelAngle}
            dx={barLabelDX}
            dy={barLabelDY}
            className="animated-label"
          />
        </Bar>

        {isShowLineChart && (
          <Line
            type="monotone"
            dataKey={lineDataKey1}
            name={LineLegendName1 ? LineLegendName1 : lineDataKey1}
            stroke={colors[0]}
            strokeWidth={2}
            legendType="plainline"
            unit={unit}
            fill={colors[0]}
            dot={{ stroke: '#06345a', strokeWidth: 2, r: 3 }}
          />
        )}

        {isShowLineChart && (
          <Line
            type="monotone"
            dataKey={lineDataKey2}
            name={LineLegendName2 ? LineLegendName2 : lineDataKey2}
            stroke={colors[1]}
            strokeWidth={2}
            legendType="plainline"
            unit={unit}
            fill={colors[1]}
            dot={{ stroke: '#06345a', strokeWidth: 2, r: 3 }}
          />
        )}
      </ComposedChart>
    </div>
  );
}

export default CustomDoubleBarChart;
