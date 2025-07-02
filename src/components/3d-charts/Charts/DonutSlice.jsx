// components/charts/DonutSlice.tsx
import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

function DonutSlice({
  startAngle,
  endAngle,
  radius,
  innerRadius,
  height,
  color,
  label,
  value,
  position,
  isHovered,
  onHover,
  onLeave,
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      const targetY = hovered || isHovered ? 0.2 : 0;
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
      const targetScale = hovered || isHovered ? 1.03 : 1;
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1));
    }
  });

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(innerRadius * Math.cos(startAngle), innerRadius * Math.sin(startAngle));
    shape.lineTo(radius * Math.cos(startAngle), radius * Math.sin(startAngle));
    shape.absarc(0, 0, radius, startAngle, endAngle, false);
    shape.lineTo(innerRadius * Math.cos(endAngle), innerRadius * Math.sin(endAngle));
    shape.absarc(0, 0, innerRadius, endAngle, startAngle, true);

    return new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 2,
      bevelSize: 0.02,
      bevelThickness: 0.015,
    });
  }, [startAngle, endAngle, radius, innerRadius, height]);

  const midAngle = (startAngle + endAngle) / 2;
  const labelRadius = (radius + innerRadius) / 2;
  const outerLabelRadius = radius + 0.5;

  // Clean color handling
  const baseColor = new THREE.Color(color);
  const lighterColor = baseColor.clone().lerp(new THREE.Color('#ffffff'), 0.1);

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={geometry}
        position={position}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerEnter={() => {
          setHovered(true);
          onHover();
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setHovered(false);
          onLeave();
          document.body.style.cursor = 'default';
        }}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={hovered || isHovered ? lighterColor : baseColor}
          metalness={0.1}
          roughness={0.3}
          transparent
          opacity={hovered || isHovered ? 0.95 : 0.9}
        />
      </mesh>

      {/* Clean Value Label Inside */}
      <Text
        position={[
          labelRadius * Math.cos(midAngle),
          height + 0.1,
          labelRadius * Math.sin(midAngle),
        ]}
        fontSize={0.11}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineColor="#333333"
        outlineWidth={0.003}
        fontWeight="600"
      >
        {value}%
      </Text>

      {/* Clean Label Outside */}
      <Text
        position={[
          outerLabelRadius * Math.cos(midAngle),
          height + 0.05,
          outerLabelRadius * Math.sin(midAngle),
        ]}
        fontSize={0.12}
        color="#444444"
        anchorX="center"
        anchorY="middle"
        outlineColor="#ffffff"
        outlineWidth={0.002}
        fontWeight="500"
      >
        {label}
      </Text>
    </group>
  );
}

export default DonutSlice;