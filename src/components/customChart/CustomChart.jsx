import React, { useState, useEffect } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, LabelList } from 'recharts';

const data = [
  {
    name: '1-01-2024',
    NonCommunicating: 2123,
    Communicating: 615,
    NonComm: 1919,
    cnt: 214,
  },
  {
    name: '2-01-2024',
    NonCommunicating: 2023,
    Communicating: 880,
    NonComm: 950,
    cnt: 268,
  },
  {
    name: '3-01-2024',
    NonCommunicating: 2023,
    Communicating: 757,
    NonComm: 1300,
    cnt: 303,
  },
  {
    name: '4-01-2024',
    NonCommunicating: 2183,
    Communicating: 409,
    NonComm: 1226,
    cnt: 48,
  },
  {
    name: '5-01-2024',
    NonCommunicating: 2223,
    Communicating: 581,
    NonComm: 1666,
    cnt: 201,
  },
  {
    name: '6-01-2024',
    NonCommunicating: 2323,
    Communicating: 945,
    NonComm: 1969,
    cnt: 390,
  },
  {
    name: '7-01-2024',
    NonCommunicating: 2380,
    Communicating: 3,
    NonComm: 1300,
    cnt: 58,
  },
  {
    name: '8-01-2024',
    NonCommunicating: 2363,
    Communicating: 529,
    NonComm: 1300,
    cnt: 225,
  },
  {
    name: '9-01-2024',
    NonCommunicating: 2223,
    Communicating: 312,
    NonComm: 1980,
    cnt: 147,
  },
  {
    name: '10-01-2024',
    NonCommunicating: 2303,
    Communicating: 604,
    NonComm: 1300,
    cnt: 125,
  },
  {
    name: '11-01-2024',
    NonCommunicating: 2003,
    Communicating: 126,
    NonComm: 1017,
    cnt: 18,
  },
  {
    name: '12-01-2024',
    NonCommunicating: 2303,
    Communicating: 445,
    NonComm: 1300,
    cnt: 294,
  },
  {
    name: '13-01-2024',
    NonCommunicating: 2024,
    Communicating: 610,
    NonComm: 1300,
    cnt: 272,
  },
  {
    name: '14-01-2024',
    NonCommunicating: 2024,
    Communicating: 208,
    NonComm: 1894,
    cnt: 280,
  },
  {
    name: '15-01-2024',
    NonCommunicating: 2024,
    Communicating: 8,
    NonComm: 1300,
    cnt: 244,
  },
  {
    name: '16-01-2024',
    NonCommunicating: 2124,
    Communicating: 734,
    NonComm: 1300,
    cnt: 252,
  },
  {
    name: '17-01-2024',
    NonCommunicating: 2224,
    Communicating: 83,
    NonComm: 1300,
    cnt: 129,
  },
  {
    name: '18-01-2024',
    NonCommunicating: 2124,
    Communicating: 132,
    NonComm: 1855,
    cnt: 490,
  },
  {
    name: '19-01-2024',
    NonCommunicating: 2024,
    Communicating: 145,
    NonComm: 1962,
    cnt: 233,
  },
  {
    name: '20-01-2024',
    NonCommunicating: 2324,
    Communicating: 49,
    NonComm: 1005,
    cnt: 186,
  },
  {
    name: '21-01-2024',
    NonCommunicating: 2024,
    Communicating: 808,
    NonComm: 1638,
    cnt: 110,
  },
  {
    name: '22-01-2024',
    NonCommunicating: 2224,
    Communicating: 540,
    NonComm: 1184,
    cnt: 464,
  },
  {
    name: '23-01-2024',
    NonCommunicating: 2024,
    Communicating: 293,
    NonComm: 1300,
    cnt: 94,
  },
  {
    name: '24-01-2024',
    NonCommunicating: 2124,
    Communicating: 8,
    NonComm: 1134,
    cnt: 176,
  },
  {
    name: '25-01-2024',
    NonCommunicating: 2224,
    Communicating: 65,
    NonComm: 1465,
    cnt: 49,
  },
  {
    name: '26-01-2024',
    NonCommunicating: 2324,
    Communicating: 841,
    NonComm: 1355,
    cnt: 288,
  },
  {
    name: '27-01-2024',
    NonCommunicating: 2024,
    Communicating: 736,
    NonComm: 1844,
    cnt: 481,
  },
  {
    name: '28-01-2024',
    NonCommunicating: 2024,
    Communicating: 874,
    NonComm: 1300,
    cnt: 116,
  },
  {
    name: '29-01-2024',
    NonCommunicating: 2254,
    Communicating: 635,
    NonComm: 1482,
    cnt: 7,
  },
  {
    name: '30-01-2024',
    NonCommunicating: 2024,
    Communicating: 529,
    NonComm: 1300,
    cnt: 162,
  },
  {
    name: '31-01-2024',
    NonCommunicating: 2024,
    Communicating: 736,
    NonComm: 1200,
    cnt: 88,
  },
];

function CustomChart() {
  const [barChartWidth, setBarChartWidth] = useState(340);

  useEffect(() => {
    // if (window.innerWidth===1366) {
    //   setBarChartWidth(1120);
    // }
    if (window.innerWidth >=1300) {
      setBarChartWidth(1100);
    }
  }, []);

  return (
    <ComposedChart
      width={barChartWidth}
      // width={window.innerWidth}
      // width={"100% !important"}
      height={450}
      data={data}
      margin={{
        top: 50,
        right: 20,
        bottom: 15,
        left: 0,
      }}
    >
      <CartesianGrid stroke="#f5f5f5" />
      <XAxis
        padding={{ top: 20, left: 20 }}
        dataKey="name"
        label={{ value: 'Date', position: 'insideBottomLeft', offset: -5 }}
        type="category"
        angle={-90}
        interval={0}
        tick={{ dy: 40 }}
      />
      <YAxis label={{ angle: -90, position: 'insideLeft' }} axisLine={false} />
      <Tooltip
        contentStyle={{
          background: 'rgba(255, 255, 255, 0.8)',
          border: 'none',
          boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.2)',
          borderRadius: '5px',
          padding: '8px',
          color: '#333',
        }}
      />
      <Legend align="center" verticalAlign="bottom" layout="horizontal" wrapperStyle={{ paddingTop: 70 }} />
      <Line
        type="monotone"
        dataKey="NonComm"
        stroke="#ffb22f"
        strokeWidth={4}
        dot={{ stroke: '#ffb22f', strokeWidth: 2, r: 5 }}
      />
      <Bar dataKey="Communicating" barSize={20} fill="#20639b" >
        <LabelList dataKey="Communicating" fontSize={"12px"} position="top" />
      </Bar>
      <Line
        type="monotone"
        dataKey="NonCommunicating"
        stroke="#06345a"
        strokeWidth={4}
        dot={{ stroke: '#06345a', strokeWidth: 2, r: 5 }}
      >
        <LabelList dataKey="NonCommunicating" position="top" fontSize={"12px"} angle={-89} offset={30} />
      </Line>
    </ComposedChart>
  );
}

export default CustomChart;
