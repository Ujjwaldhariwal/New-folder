import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

const LABEL_COLOR = '#a0522d'; // Fixed brown label color

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

  // Animate slice on hover
  useFrame(() => {
    if (meshRef.current) {
      const targetY = hovered || isHovered ? height * 0.2 : 0;
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetY,
        0.1
      );
      const scaleTarget = hovered || isHovered ? 1.05 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget), 0.1);
    }
  });

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const innerRadius = radius * 0.4;

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

  const midAngle = (startAngle + endAngle) / 2;
  const labelRadius = radius * 1.4;
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
            metalness={0.2}
            roughness={0.6}
            emissive={hovered || isHovered ? color : '#000000'}
            emissiveIntensity={hovered || isHovered ? 0.5 : 0}
          />
        </mesh>
      </Float>

      {/* Labels with fixed brown color */}
      <Text
        position={labelPosition}
        fontSize={0.16}
        color={LABEL_COLOR}
        anchorX="center"
        anchorY="middle"
        outlineColor={'#ffffff'}
        outlineWidth={0.005}
      >
        {label}
      </Text>
      <Text
        position={[labelPosition[0], labelPosition[1] - 0.2, labelPosition[2]]}
        fontSize={0.22}
        fontWeight="bold"
        color={LABEL_COLOR}
        anchorX="center"
        anchorY="middle"
        outlineColor={'#ffffff'}
        outlineWidth={0.005}
      >
        {value}%
      </Text>
    </group>
  );
}

export default PieSlice;
