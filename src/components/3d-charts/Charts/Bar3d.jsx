// components/charts/Bar3D.tsx
import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

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

  // Animation loop
  useFrame(() => {
    if (meshRef.current) {
      const scaleTarget = hovered || isHovered ? 1.1 : 1;
      const newScale = new THREE.Vector3(scaleTarget, 1, scaleTarget);
      meshRef.current.scale.lerp(newScale, 0.1);

      const posTargetY = hovered || isHovered ? height / 2 + 0.15 : height / 2;
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        posTargetY,
        0.1
      );
    }
  });

  const geometry = useMemo(() => new THREE.BoxGeometry(0.8, height, 0.8), [height]);

  const renderLabels = () => {
    switch (labelStyle) {
      case 'onbar':
        return (
          <>
            <Text
              position={[position[0], height + 0.3, position[2]]}
              fontSize={0.14}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {value}
            </Text>
            <Text
              position={[position[0], height / 2, position[2] + 0.5]}
              fontSize={0.12}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              rotation={[-Math.PI / 2, 0, 0]}
            >
              {label}
            </Text>
          </>
        );

      case 'hover':
        return (
          <>
            <Text
              position={[position[0], height + 0.3, position[2]]}
              fontSize={0.14}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {value}
            </Text>

            {(hovered || isHovered) && (
              <>
                <Text
                  position={[position[0], height + 0.6, position[2]]}
                  fontSize={0.13}
                  color="#4ECDC4"
                  anchorX="center"
                  anchorY="middle"
                >
                  {label}
                </Text>
                <mesh position={[position[0], height + 0.8, position[2]]}>
                  <planeGeometry args={[1.2, 0.4]} />
                  <meshStandardMaterial color="#1a1a1a" transparent opacity={0.9} />
                </mesh>
              </>
            )}
          </>
        );

      case 'front':
      default:
        return (
          <>
            <Text
              position={[position[0], height + 0.3, position[2]]}
              fontSize={0.15}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {value}
            </Text>
            <Text
              position={[position[0], 0.15, position[2] + 1.2]}
              fontSize={0.14}
              color="#cccccc"
              anchorX="center"
              anchorY="middle"
            >
              {label}
            </Text>
            <mesh position={[position[0], 0.1, position[2] + 0.7]}>
              <boxGeometry args={[0.02, 0.02, 1]} />
              <meshStandardMaterial color="#666666" transparent opacity={0.5} />
            </mesh>
          </>
        );
    }
  };

  return (
    <group>
      <Float floatIntensity={0.25} speed={3} rotationIntensity={0.02}>
        <mesh
          ref={meshRef}
          geometry={geometry}
          position={[position[0], height / 2, position[2]]}
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
            metalness={0.2}
            roughness={0.3}
            transparent
            opacity={hovered || isHovered ? 0.95 : 0.85}
            emissive={hovered || isHovered ? color : '#000'}
            emissiveIntensity={hovered || isHovered ? 0.3 : 0}
          />
        </mesh>
      </Float>

      {renderLabels()}
    </group>
  );
}

export default Bar3D;
