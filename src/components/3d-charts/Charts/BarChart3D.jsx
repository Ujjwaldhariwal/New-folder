// BarChart3D.js
import React, { useMemo, useState, useEffect } from 'react';
import { Text } from '@react-three/drei';

const getLabelColor = () => {
  return getComputedStyle(document.documentElement).getPropertyValue('--label-color').trim() || '#333333';
};

const Bar = ({ position, height, color, value, total, label, labelColor }) => {
  const [hovered, setHovered] = useState(false);

  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  const showPercentage = hovered;

  return (
    <group position={position}>
      <mesh
        position-y={height / 2}
        onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.7, height, 0.7]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.6}
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={0.4}
        />
      </mesh>

      <Text
        position={[0, -0.25, 0]}
        fontSize={0.22}
        color={labelColor}
        anchorX="center"
        anchorY="top"
        backgroundColor="rgba(255, 255, 255, 0.8)"
        padding={[0.05, 0.1]}
        borderRadius={0.1}
        fontWeight="bold"
      >
        {label}
      </Text>

      <Text
        position={[0, height + 0.1, 0]}
        fontSize={0.25}
        color={labelColor}
        anchorX="center"
        anchorY="bottom"
      >
        {value}
      </Text>

      {showPercentage && (
        <Text
          position={[0, height / 2, 0.4]}
          fontSize={0.28}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          outlineWidth={0.008}
          outlineColor="#000000"
        >
          {percentage}%
        </Text>
      )}
    </group>
  );
};

const BarChart3D = ({ data }) => {
  const fallbackData = [{ id: -1, label: 'Data N/A', value: 0, color: '#9CA3AF' }];
  const safeData = Array.isArray(data) && data.length > 0 ? data : fallbackData;

  const [labelColor, setLabelColor] = useState(getLabelColor());

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLabelColor(getLabelColor());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const total = useMemo(() => safeData.reduce((sum, item) => sum + item.value, 0), [safeData]);
  const maxValue = Math.max(...safeData.map((item) => item.value), 1);
  const chartHeight = 2.9;
  const spacing = 1.4;
  const chartWidth = safeData.length * spacing;
  const startX = -(chartWidth - spacing) / 2;

  const yAxisLabels = useMemo(() => {
    const stepCount = 4;
    return Array.from({ length: stepCount + 1 }, (_, i) => {
      const value = Math.round((i / stepCount) * maxValue);
      const yPos = (i / stepCount) * chartHeight;
      return { value, yPos };
    });
  }, [maxValue, chartHeight]);

  return (
    <group position={[0, -0.8, 0]}>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />

      {safeData.map((item, index) => {
        const height = item.value > 0 ? (item.value / maxValue) * chartHeight : 0;
        const xPosition = startX + index * spacing;
        return (
          <Bar
            key={item.id || index}
            position={[xPosition, 0, 0]}
            height={height}
            color={item.color}
            value={item.value}
            total={total}
            label={item.label}
            labelColor={labelColor}
          />
        );
      })}

      {yAxisLabels.map(({ value, yPos }) => (
        <group key={value} position-y={yPos}>
          <mesh position={[0, 0, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[chartWidth, 0.01]} />
            <meshStandardMaterial color={labelColor} transparent opacity={0.15} />
          </mesh>
          <Text
            position={[startX - 0.8, 0, 0]}
            fontSize={0.22}
            color={labelColor}
            anchorX="center"
            anchorY="middle"
            backgroundColor="rgba(255, 255, 255, 0.8)"
            padding={[0.05, 0.1]}
            borderRadius={0.1}
            fontWeight="bold"
          >
            {value}
          </Text>
        </group>
      ))}
    </group>
  );
};

export default BarChart3D;
