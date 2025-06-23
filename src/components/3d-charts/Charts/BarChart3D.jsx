import React, { useState } from 'react';
import Bar3D from './Bar3D';
import { Text } from '@react-three/drei';

function BarChart3D({ data, labelStyle = 'front' }) {
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const maxValue = Math.max(...data.map(item => item.value));
  const spacing = 1.4;
  const startX = -(data.length - 1) * spacing / 2;

  const bars = data.map((item, index) => {
    const height = (item.value / maxValue) * 3; // Scale bar height to max 3 units
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
  });

  return (
    <group>
      {/* Render all bars */}
      {bars}

      {/* Base platform */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[data.length * spacing + 1, 3.2]} />
        <meshStandardMaterial color="#1f1f1f" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Horizontal grid lines and Y-axis values */}
      {[1, 2, 3].map((h) => (
        <group key={h}>
          <mesh position={[0, h, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[data.length * spacing + 1, 0.015]} />
            <meshStandardMaterial color="#444" transparent opacity={0.4} />
          </mesh>
          <Text
            position={[startX - 1, h, 0]}
            fontSize={0.1}
            color="#888888"
            anchorX="center"
            anchorY="middle"
          >
            {Math.round((h / 3) * maxValue)}
          </Text>
        </group>
      ))}
    </group>
  );
}

export default BarChart3D;
