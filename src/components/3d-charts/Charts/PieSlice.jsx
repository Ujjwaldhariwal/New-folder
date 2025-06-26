import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

function PieSlice({
  startAngle,
  endAngle,
  radius,
  height,
  color,
  label,
  value,
  isHovered,
  onHover,
  onLeave
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Check the document's theme once on mount and observes for changes.
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);

  // Use CSS variables for consistent, theme-aware colors.
  const themeColors = useMemo(() => {
    return {
      textPrimary: `var(--text-primary-${isDark ? 'dark' : 'light'})`,
      textSecondary: `var(--text-secondary-${isDark ? 'dark' : 'light'})`,
      outline: isDark ? '#111827' : '#ffffff', // Dark or light outline for text contrast
    };
  }, [isDark]);

  // Animate the slice on hover for a responsive feel.
  useFrame(() => {
    if (meshRef.current) {
      const targetY = hovered || isHovered ? height * 0.2 : 0; // Pop out slightly
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetY,
        0.1
      );
      const scaleTarget = hovered || isHovered ? 1.05 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget), 0.1);
    }
  });

  // Memoize the geometry calculation for performance.
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const innerRadius = radius * 0.4; // Create a donut hole relative to the main radius

    shape.moveTo(innerRadius * Math.cos(startAngle), innerRadius * Math.sin(startAngle));
    shape.lineTo(radius * Math.cos(startAngle), radius * Math.sin(startAngle));
    shape.absarc(0, 0, radius, startAngle, endAngle, false);
    shape.lineTo(innerRadius * Math.cos(endAngle), innerRadius * Math.sin(endAngle));
    shape.absarc(0, 0, innerRadius, endAngle, startAngle, true);

    const extrudeSettings = {
      steps: 2,
      depth: height,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [startAngle, endAngle, radius, height]);

  // Position labels around the pie chart.
  const midAngle = (startAngle + endAngle) / 2;
  const labelRadius = radius * 1.4; // Place labels further out for clarity
  const labelPosition = [
    labelRadius * Math.cos(midAngle),
    height / 2,
    labelRadius * Math.sin(midAngle)
  ];

  return (
    <group>
      <Float speed={2} rotationIntensity={0.05} floatIntensity={0.05}>
        <mesh
          ref={meshRef}
          geometry={geometry}
          rotation={[-Math.PI / 2, 0, 0]}
          castShadow
          receiveShadow
          onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); onHover(); }}
          onPointerLeave={(e) => { e.stopPropagation(); setHovered(false); onLeave(); }}
        >
          <meshStandardMaterial
            color={color}
            metalness={isDark ? 0.4 : 0.2}
            roughness={isDark ? 0.5 : 0.6}
            emissive={hovered || isHovered ? color : '#000000'}
            emissiveIntensity={hovered || isHovered ? 0.5 : 0}
          />
        </mesh>
      </Float>

      {/* Labels for the slice */}
      <Text
        position={labelPosition}
        fontSize={0.16}
        color={themeColors.textPrimary}
        anchorX="center"
        anchorY="middle"
        outlineColor={themeColors.outline}
        outlineWidth={0.005}
      >
        {label}
      </Text>
      <Text
        position={[labelPosition[0], labelPosition[1] - 0.2, labelPosition[2]]}
        fontSize={0.22}
        fontWeight="bold"
        color={themeColors.textPrimary}
        anchorX="center"
        anchorY="middle"
        outlineColor={themeColors.outline}
        outlineWidth={0.005}
      >
        {value}%
      </Text>
    </group>
  );
}

export default PieSlice;
