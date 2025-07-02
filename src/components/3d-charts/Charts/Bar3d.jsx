import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

const LABEL_COLOR = '#a0522d';

function Bar3D({
  position,
  height,
  color,
  label,
  value,
  isHovered,
  onHover,
  onLeave,
  labelStyle = 'front',
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      const scaleTarget = hovered || isHovered ? 1.05 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scaleTarget, 1, scaleTarget), 0.1);
      const posTargetY = height / 2;
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        posTargetY,
        0.1
      );
    }
  });

  const geometry = useMemo(() => new THREE.BoxGeometry(0.7, height, 0.7), [height]);

  const renderLabels = () => {
    const shouldShow = hovered || isHovered;

    switch (labelStyle) {
      case 'onbar':
        return (
          <>
            <Text position={[0, height + 0.25, 0]} fontSize={0.14} color={LABEL_COLOR} anchorX="center">
              {value}
            </Text>
            <Text position={[0, -0.2, 0]} fontSize={0.12} color={LABEL_COLOR} anchorX="center">
              {label}
            </Text>
          </>
        );
      case 'hover':
        return (
          <>
            {shouldShow && (
              <Text
                position={[0, height + 0.25, 0]}
                fontSize={0.14}
                color={LABEL_COLOR}
                anchorX="center"
              >
                {value}
              </Text>
            )}
            <Text position={[0, -0.2, 0]} fontSize={0.12} color={LABEL_COLOR} anchorX="center">
              {label}
            </Text>
          </>
        );
      case 'front':
      default:
        return (
          <>
            <Text
              position={[0, height + 0.2, 0]}
              fontSize={0.15}
              color={LABEL_COLOR}
              anchorX="center"
              anchorY="middle"
            >
              {value}
            </Text>
            <Text
              position={[0, -0.2, 0]}
              fontSize={0.09}
              color={LABEL_COLOR}
              anchorX="center"
              anchorY="middle"
            >
{label}
            </Text>
          </>
        );
    }
  };

  return (
    <group position={position}>
      <Float floatIntensity={0.1} speed={2} rotationIntensity={0.01}>
        <mesh
          ref={meshRef}
          geometry={geometry}
          position={[0, height / 2, 0]}
          castShadow
          receiveShadow
          onPointerEnter={(e) => {
            e.stopPropagation();
            setHovered(true);
            onHover();
          }}
          onPointerLeave={(e) => {
            e.stopPropagation();
            setHovered(false);
            onLeave();
          }}
        >
          <meshStandardMaterial
            color={color}
            metalness={0.5}
            roughness={0.3}
            emissive={hovered || isHovered ? color : '#000000'}
            emissiveIntensity={hovered || isHovered ? 0.4 : 0}
          />
        </mesh>
      </Float>
      {renderLabels()}
    </group>
  );
}

export default Bar3D;
