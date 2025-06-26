import React, { useState, useMemo } from 'react';
import { Text } from '@react-three/drei';
import Bar3D from './Bar3d';

const LABEL_COLOR = '#a0522d'; // Same brown for axis labels

function BarChart3D({ data, labelStyle = 'front' }) {
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(item => item.value), 1);
  const spacing = 1.4;
  const chartWidth = data.length * spacing;
  const startX = -(chartWidth - spacing) / 2;

  const bars = useMemo(() => data.map((item, index) => {
    const height = item.value > 0 ? (item.value / maxValue) * 3 : 0;
    const xPosition = startX + index * spacing;

    return (
      <Bar3D
        key={item.id || index}
        position={[xPosition, 0, 0]}
        height={height}
        color={item.color}
        label={item.label}
        value={item.value}
        isHovered={hoveredIndex === index}
        onHover={() => setHoveredIndex(index)}
        onLeave={() => setHoveredIndex(-1)}
        labelStyle={labelStyle}
      />
    );
  }), [data, maxValue, startX, spacing, hoveredIndex, labelStyle]);

  // Y-axis labels with fixed brown color
  const yAxisLabels = useMemo(() => {
    const labels = [];
    const stepCount = 4;
    for (let i = 1; i <= stepCount; i++) {
        const value = Math.round((i / stepCount) * maxValue);
        const yPos = (i / stepCount) * 3;
        labels.push({ value, yPos });
    }
    return labels;
  }, [maxValue]);

  return (
    <group>
      {bars}

      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[chartWidth, 3.2]} />
        <meshStandardMaterial 
          color={'#f9fafb'} // Light platform color, you can keep static or improve later
          roughness={0.8} 
          metalness={0.1} 
        />
      </mesh>

      {yAxisLabels.map(({ value, yPos }) => (
        <group key={value}>
          <mesh position={[0, yPos, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[chartWidth, 0.015]} />
            <meshStandardMaterial 
              color={'#d3d3d3'}
              transparent 
              opacity={0.3} 
            />
          </mesh>
          <Text
            position={[startX - 0.9, yPos, 0]}
            fontSize={0.12}
            color={LABEL_COLOR}
            anchorX="center"
            anchorY="middle"
          >
            {value}
          </Text>
        </group>
      ))}
    </group>
  );
}

export default BarChart3D;
