// PieChart3D.jsx
import React, { useState, useMemo } from 'react';
import PieSlice from './PieSlice';

function PieChart3D({ data, labelStyle = 'default' }) {
  if (!data || data.length === 0) return null;

  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);

  let currentAngle = 0;

  return (
    <group>
      {data.map((item, index) => {
        const sliceAngle = (item.value / total) * Math.PI * 2;
        const startAngle = currentAngle;
        currentAngle += sliceAngle;
        const endAngle = currentAngle;

        return (
          <PieSlice
            key={item.id || index}
            startAngle={startAngle}
            endAngle={endAngle}
            radius={2}
            height={0.5}
            color={item.color}
            label={((item.value / total) * 100).toFixed(1)}
            value={item.value}
            isHovered={hoveredIndex === index}
            onHover={() => setHoveredIndex(index)}
            onLeave={() => setHoveredIndex(-1)}
            labelStyle={labelStyle} // 👈 NEW PROP
          />
        );
      })}
    </group>
  );
}

export default PieChart3D;
