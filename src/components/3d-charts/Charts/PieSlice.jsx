import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

function getLabelColorFromCSS() {
  return getComputedStyle(document.documentElement).getPropertyValue('--label-color').trim();
}

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
  onLeave,
  labelStyle = 'default',
}) {
  const meshRef = useRef();
  const [labelColor, setLabelColor] = useState(getLabelColorFromCSS());

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLabelColor(getLabelColorFromCSS());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      const targetY = isHovered ? height * 0.2 : 0;
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
      const scaleTarget = isHovered ? 1.05 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget), 0.1);
    }
  });

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.absarc(0, 0, radius, startAngle, endAngle, false);
    shape.lineTo(0, 0);
    return new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: height,
      bevelEnabled: false,
    });
  }, [startAngle, endAngle, radius, height]);

  const midAngle = (startAngle + endAngle) / 2;
  const sliceAngle = endAngle - startAngle;
  const percentage = ((sliceAngle / (Math.PI * 2)) * 100).toFixed(1);

  const isSmallSlice = sliceAngle < Math.PI / 6; // Less than 30 degrees
  const labelOffset = radius * (isSmallSlice ? 1.6 : 1.2);
  const labelY = labelStyle === 'compact' ? 0.15 : height + 0.3;
  const labelPosition = [
    labelOffset * Math.cos(midAngle),
    labelY,
    labelOffset * Math.sin(midAngle),
  ];

  const showLabel = percentage >= 5;

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={geometry}
        rotation-x={-Math.PI / 2}
        castShadow
        receiveShadow
        onPointerEnter={(e) => {
          e.stopPropagation();
          onHover();
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          onLeave();
        }}
      >
        <meshStandardMaterial
          color={color}
          metalness={0.2}
          roughness={0.6}
          emissive={isHovered ? color : '#000000'}
          emissiveIntensity={isHovered ? 0.5 : 0}
        />
      </mesh>

      {/* Regular label (only for bigger slices) */}
      {showLabel && labelStyle === 'compact' && (
        <Text
          position={labelPosition}
          fontSize={isSmallSlice ? 0.18 : 0.22}
          color={labelColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.008}
          outlineColor="rgba(255,255,255,0.9)"
          rotation={[Math.PI / 2, 0, 0]}
          fontWeight="normal"
          renderOrder={10}
        >
          {value}
        </Text>
      )}

      {showLabel && labelStyle !== 'compact' && (
        <Text
          position={labelPosition}
          fontSize={isSmallSlice ? 0.24 : 0.28}
          color={labelColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.005}
          outlineColor="rgba(255,255,255,0.9)"
          fontWeight="normal"
          renderOrder={10}
        >
          {value}
        </Text>
      )}

      {/* Hover label – always shown on hover in compact and modal */}
      {isHovered && (
        <Text
          position={
            labelStyle === 'compact'
              ? [0, 0, radius + 1.2] // ✅ Correct for flat top chart
              : [0, height + 1.2, 0]
          }
          fontSize={0.35}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineColor="rgba(0,0,0,0.85)"
          outlineWidth={0.01}
          rotation={labelStyle === 'compact' ? [0, 0, 0] : [0, 0, 0]} // ✅ Faces camera in both
          fontWeight="bold"
          renderOrder={15}
        >
          {value} ({percentage}%)
        </Text>
      )}
    </group>
  );
}

export default PieSlice;
