// PieChart3D.js
import React, { useState, useMemo } from 'react';
import PieSlice from './PieSlice';

function PieChart3D({ data, labelStyle = 'default' }) {
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const fallbackData = [{ id: -1, label: 'Data N/A', value: 0, color: '#9CA3AF' }];
  const validData = Array.isArray(data) && data.length > 0 ? data : fallbackData;

  const isDataNA = useMemo(() => validData.length === 1 && validData[0].label === 'Data N/A', [validData]);
  const total = useMemo(() => validData.reduce((sum, item) => sum + item.value, 0), [validData]);

  const slices = useMemo(() => {
    if (isDataNA) {
      return [{
        ...validData[0],
        startAngle: 0,
        endAngle: Math.PI * 2,
      }];
    }

    if (total === 0) return [];

    const fullCircle = Math.PI * 2;
    const sliceAngles = validData.map((item) => (item.value / total) * fullCircle);

    let accumulated = 0;
    return validData.map((item, index) => {
      const startAngle = accumulated;
      const endAngle = accumulated + sliceAngles[index];
      accumulated = endAngle;

      return { ...item, startAngle, endAngle };
    });
  }, [validData, total, isDataNA]);

  return (
    <group>
      {slices.map((slice, index) => (
        <PieSlice
          key={slice.id || index}
          startAngle={slice.startAngle}
          endAngle={slice.endAngle}
          radius={2}
          height={0.5}
          color={slice.color}
          label={slice.percentage}
          value={slice.value}
          isHovered={hoveredIndex === index}
          onHover={() => setHoveredIndex(index)}
          onLeave={() => setHoveredIndex(-1)}
          labelStyle={labelStyle}
          isNA={isDataNA}
        />
      ))}
    </group>
  );
}

export default PieChart3D;
