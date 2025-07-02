import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const getLabelColor = () => {
  return getComputedStyle(document.documentElement).getPropertyValue('--label-color').trim() || '#000';
};

const BarWithBillboardLabel = ({ position, height, color, value, label }) => {
  const textRef = useRef();
  const hoverTextRef = useRef();
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false);
  const [labelColor, setLabelColor] = useState(getLabelColor());

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLabelColor(getLabelColor());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useFrame(() => {
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion);
    }
    if (hoverTextRef.current) {
      hoverTextRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group position={position}>
      <mesh
        position-y={height / 2}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <boxGeometry args={[0.7, height, 0.7]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Bottom label (label name) */}
      <Text
        ref={textRef}
        position={[0, -0.4, 0]}
        fontSize={0.25}
        color={labelColor}
        anchorX="center"
        anchorY="top"
        backgroundColor="rgba(255, 255, 255, 0.8)"
        background
        padding={[0.05, 0.1]}
        borderRadius={0.05}
      >
        {label}
      </Text>

      {/* Top value on hover */}
      {hovered && (
        <Text
          ref={hoverTextRef}
          position={[0, height + 0.1, 0]}
          fontSize={0.3}
          color={labelColor}
          anchorX="center"
          anchorY="bottom"
          backgroundColor="rgba(255, 255, 255, 0.9)"
          background
          padding={[0.05, 0.1]}
          borderRadius={0.05}
        >
          {value}
        </Text>
      )}
    </group>
  );
};

const BarChart3D = ({ data }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const chartHeight = 3;
  const spacing = 1.4;
  const chartWidth = data.length * spacing;
  const startX = -(chartWidth - spacing) / 2;

  const yAxisLabels = useMemo(() => {
    const stepCount = 4;
    return Array.from({ length: stepCount + 1 }, (_, i) => {
      const value = Math.round((i / stepCount) * maxValue);
      const yPos = (i / stepCount) * chartHeight;
      return { value, yPos };
    });
  }, [maxValue, chartHeight]);

  const [labelColor, setLabelColor] = useState(getLabelColor());

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLabelColor(getLabelColor());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <group position={[0, -1, 0]}>
      {data.map((item, index) => {
        const height = (item.value / maxValue) * chartHeight;
        const xPosition = startX + index * spacing;
        return (
          <BarWithBillboardLabel
            key={item.id || index}
            position={[xPosition, 0, 0]}
            height={height}
            color={item.color}
            value={item.value}
            label={item.label}
          />
        );
      })}

      {/* Y-axis */}
      {yAxisLabels.map(({ value, yPos }) => (
        <group key={value} position-y={yPos}>
          <mesh position={[0, 0, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[chartWidth + 1, 0.02]} />
            <meshStandardMaterial color="#ccc" transparent opacity={0.5} />
          </mesh>
          <Text
            position={[startX - 1, 0, 0]}
            fontSize={0.3}
            color={labelColor}
            anchorX="center"
            anchorY="middle"
          >
            {value}
          </Text>
        </group>
      ))}
    </group>
  );
};

export default BarChart3D;
