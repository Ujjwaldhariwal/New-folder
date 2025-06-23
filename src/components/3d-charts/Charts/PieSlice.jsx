import React, { useRef, useState, useMemo } from 'react';
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
  position,
  isHovered,
  onHover,
  onLeave
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      const targetY = (hovered || isHovered) ? 0.3 : 0;
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetY,
        0.1
      );
      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(
          meshRef.current.scale.x,
          hovered || isHovered ? 1.05 : 1,
          0.1
        )
      );
    }
  });

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const innerRadius = 0.5;

    shape.moveTo(
      innerRadius * Math.cos(startAngle),
      innerRadius * Math.sin(startAngle)
    );
    shape.lineTo(
      radius * Math.cos(startAngle),
      radius * Math.sin(startAngle)
    );
    shape.absarc(0, 0, radius, startAngle, endAngle, false);
    shape.lineTo(
      innerRadius * Math.cos(endAngle),
      innerRadius * Math.sin(endAngle)
    );
    shape.absarc(0, 0, innerRadius, endAngle, startAngle, true);

    const extrudeSettings = {
      depth: height,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 3,
      bevelSize: 0.03,
      bevelThickness: 0.03
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [startAngle, endAngle, radius, height]);

  const midAngle = (startAngle + endAngle) / 2;
  const labelRadius = radius + 0.8;
  const labelPosition = [
    labelRadius * Math.cos(midAngle),
    height + 0.1,
    labelRadius * Math.sin(midAngle)
  ];

  return (
    <group>
      <Float speed={4} rotationIntensity={0.05} floatIntensity={0.02}>
        <mesh
          ref={meshRef}
          geometry={geometry}
          position={position}
          rotation={[-Math.PI / 2, 0, 0]}
          castShadow
          receiveShadow
          onPointerEnter={() => {
            setHovered(true);
            onHover();
          }}
          onPointerLeave={() => {
            setHovered(false);
            onLeave();
          }}
        >
          <meshStandardMaterial
            color={color}
            metalness={0.3}
            roughness={0.4}
            transparent
            opacity={hovered || isHovered ? 0.95 : 0.85}
            emissive={hovered || isHovered ? color : '#000000'}
            emissiveIntensity={hovered || isHovered ? 0.3 : 0}
          />
        </mesh>
      </Float>

      {/* Black Label Text */}
      <Text
        position={labelPosition}
        fontSize={0.14}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        outlineColor="#ffffff"
        outlineWidth={0.003}
      >
        {label}
      </Text>

      <Text
        position={[labelPosition[0], labelPosition[1] - 0.18, labelPosition[2]]}
        fontSize={0.11}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {value}%
      </Text>
    </group>
  );
}

export default PieSlice;
