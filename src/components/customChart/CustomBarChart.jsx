import React, { useState, useEffect, useRef } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, LabelList, Scatter } from 'recharts';

function CustomBarChart({
  data,
  title,
  xAxisDataKey,
  barDataKey,
  shadowDatakey,
  lineDataKey,
  LegendName,
  LineLegendName,
  yAxisLabel,
  minYAixsVal = 0,
  maxYAixsVal = 100,
  isShowLineChart = true,
  isShowShadowBar = true,
  chartHeight = 330,
  displayLegend = true,
  barSize = 40,
  barColor = '#3159ff',
  labelColor = '#3159ff',
  lineColor = '#ff5700',
  unit = '%',
  showTick=true
}) {
  const chartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const updateChartWidth = () => {
      if (chartRef.current) {
        const width = chartRef.current.clientWidth;
        setChartWidth(width);
      }
    };
    updateChartWidth();
    window.addEventListener('resize', updateChartWidth);
    return () => {
      window.removeEventListener('resize', updateChartWidth);
    };
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const mainBarPayload = payload.filter((entry) => entry.name === LegendName || entry.name === LineLegendName);
      return (
        <div className="tooltipCard">
          <span>{`${label}`}</span>
          <br />
          {mainBarPayload.map((entry, index) => (
            <div key={`${entry.name}${index}`} style={{ marginTop: 5 }}>
              <span style={{ color: entry.color }}>{`${entry.name}: ${entry.value} ${entry.unit}`}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomBarShape = (props) => {
    const { x, y, width, height, fill } = props;
    return (
      <>
        <rect x={x} y={y} width={width} height={height} rx={5} ry={5} fill={fill} />
        {height > 0 && <circle cx={x + width} cy={y + 3} r={8} fill={fill} />}
      </>
    );
  };

  const CustomShadowBarShape = (props) => {
    const { x, y, width, height, fill } = props;
    return (
      <rect x={x} y={y} width={width} height={height} rx={8} ry={8} fill={fill} opacity={0.2} />
    );
  };

  return (
    <div ref={chartRef} style={{ width: '100%', height: `${chartHeight + 30}px` }}>
      {title && (
        <p
          className="customCardHeader whitespace-nowrap"
          style={{
            textAlign: 'start',
            margin: 0,
            padding: '20px 12px',
          }}
        >
          {title}
        </p>
      )}
      <ComposedChart
        width={chartWidth}
        height={chartHeight}
        data={data}
        layout="vertical"
        margin={{
          top: 0,
          right: 20,
          bottom: 35,
          left: -80,
        }}
        barGap={-barSize}
        barCategoryGap={'0%'}
      >
        <XAxis
          type="number"
          domain={[minYAixsVal, maxYAixsVal]}
          tickFormatter={(tick) => `${tick}${unit}`}
          fontSize={11}
          axisLine={false}
          tickLine={false}
          stroke="rgb(136, 175, 179)"
          tick={showTick}
        />
        <YAxis
          type="category"
          dataKey={xAxisDataKey}
          fontSize={11}
          axisLine={false}
          tickLine={false}
          stroke="rgb(136, 175, 179)"
          width={100}
          orientation="left"
          tick={({ x, y, payload }) => (
            <text
              x={x + 60}
              y={y - 15}
              dy={0}
              fontSize="12px"
              fontWeight="500"
              fill="rgb(136, 175, 179)"
              textAnchor="end"
            >
              {payload.value}
            </text>
          )}
        />
        <Tooltip
          contentStyle={{
            background: 'black',
            color: 'white',
            border: 'none',
            boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.2)',
            borderRadius: '5px',
            padding: '8px',
          }}
          content={CustomTooltip}
        />
        <Legend
          align="center"
          verticalAlign="bottom"
          layout="horizontal"
          wrapperStyle={{
            paddingTop: 10,
            fontSize: '13px',
            paddingLeft: 105,
            // visibility: displayLegend ? 'visible' : 'hidden',
            visibility: displayLegend ? 'block' : 'none',
          }}
        />

        <Bar
          dataKey={barDataKey}
          barSize={barSize}
          fill={barColor}
          unit={unit}
          name={LegendName || barDataKey}
          shape={<CustomBarShape />}
          legendType='square'
        >
          <LabelList
            dataKey={barDataKey}
            fontSize={'12px'}
            fontWeight={'500'}
            fill={labelColor}
            content={({ x, y, value }) => (
              <text x={x + 220} y={y - 10} dy={0} fontSize="12px" fontWeight="500" fill={labelColor} textAnchor="end">
                {`${value}%`}
              </text>
            )}
          />
        </Bar>
        {isShowShadowBar && (
          <Bar 
              dataKey={shadowDatakey || barDataKey} 
              barSize={barSize+1} 
              fill="#a7c0c0" 
              opacity={0.9} 
              legendType="none" 
              shape={<CustomShadowBarShape />}
              />
        )}
        {isShowLineChart && (
          <>
            <Line
              type="monotone"
              dataKey={lineDataKey}
              name={LineLegendName || lineDataKey}
              stroke={lineColor}
              fill={lineColor}
              strokeWidth={3}
              unit={unit}
              dot={false}
              legendType='plainline'
            />
          </>
        )}
      </ComposedChart>
    </div>
  );
}

export default CustomBarChart;
