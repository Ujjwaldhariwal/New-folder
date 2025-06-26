import React, { useState, useEffect, useMemo } from 'react';
import PieSlice from './PieSlice';

function PieChart3D({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  // No theme logic needed anymore

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const slices = data.map((item, index) => {
    const sliceAngle = (item.value / total) * Math.PI * 2;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    return (
      <PieSlice
        key={item.id || index}
        startAngle={startAngle}
        endAngle={endAngle}
        radius={2}
        height={0.5}
        color={item.color}
        label={item.label}
        value={((item.value / total) * 100).toFixed(1)}
        position={[0, 0, 0]}
        isHovered={hoveredIndex === index}
        onHover={() => setHoveredIndex(index)}
        onLeave={() => setHoveredIndex(-1)}
      />
    );
  });

  return (
    <group>
      {slices}

      {/* Optional base platform */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial
          color={'#e5e7eb'} // Light gray base
          transparent
          opacity={0.1}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

export default PieChart3D;
