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
  value,
  isHovered,
  onHover,
  onLeave,
  labelStyle = 'default',
  isNA,
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

  const percentage = isNA ? '0.0' : ((sliceAngle / (Math.PI * 2)) * 100).toFixed(1);
  const displayValue = isNA ? 0 : value;

  const isSmallSlice = sliceAngle < Math.PI / 6;
  const labelOffset = radius * (isSmallSlice ? 1.6 : 1.2);

  const labelPosition = useMemo(() => {
    if (labelStyle === 'compact') {
      const x = labelOffset * Math.sin(midAngle);
      const z = -labelOffset * Math.cos(midAngle);
      return [x, -0.5, z];
    } else {
      const x = labelOffset * Math.cos(midAngle);
      const z = labelOffset * Math.sin(midAngle);
      return [x, height + 0.3, z];
    }
  }, [labelOffset, midAngle, labelStyle, height]);

  const showLabel = parseFloat(percentage) >= 5 || isNA;

  const pointerLine = useMemo(() => {
    if (!(labelStyle === 'compact' && isSmallSlice && showLabel)) return null;
    const x1 = radius * Math.sin(midAngle);
    const z1 = -radius * Math.cos(midAngle);
    const x2 = labelOffset * Math.sin(midAngle);
    const z2 = -labelOffset * Math.cos(midAngle);

    const points = [new THREE.Vector3(x1, -0.5, z1), new THREE.Vector3(x2, -0.5, z2)];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [labelStyle, isSmallSlice, showLabel, radius, labelOffset, midAngle]);

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

      {/* Pointer Line for Small Slices in Compact View */}
      {pointerLine && (
        <line geometry={pointerLine}>
          <lineBasicMaterial color={labelColor} linewidth={2} />
        </line>
      )}

      {/* --- STATIC LABELS --- */}
      {/* MODIFIED: Removed "!isHovered" so this label remains visible even during hover. */}
      {showLabel && labelStyle === 'compact' && (
        <Text
          position={labelPosition}
          fontSize={isSmallSlice ? 0.18 : 0.22}
          color={labelColor}
          anchorX="center"
          outlineWidth={0.008}
          outlineColor="rgba(255,255,255,0.9)"
          rotation={[Math.PI / 2, 0, 0]}
          fontWeight="normal"
          renderOrder={10}
        >
          {displayValue}
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
          {displayValue}
        </Text>
      )}

      {/* --- HOVER LABELS --- */}
      {/* This label appears ON HOVER, in addition to the static label above. */}
      {isHovered && labelStyle === 'compact' && (
        <Text
          position={[0, height - 1.2, 0]}
          fontSize={0.35}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineColor="rgba(0,0,0,0.85)"
          outlineWidth={0.01}
          rotation={[Math.PI / 2, 0, 0]}
          fontWeight="bold"
          renderOrder={15}
        >
          {displayValue} ({percentage}%)
        </Text>
      )}
      
      {isHovered && labelStyle !== 'compact' && (
        <Text
          position={[
            radius * Math.cos(midAngle) * 0.6,
            height + 1.2,
            radius * Math.sin(midAngle) * 0.6,
          ]}
          fontSize={0.35}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineColor="rgba(0,0,0,0.85)"
          outlineWidth={0.01}
          rotation={[0, 0, 0]}
          fontWeight="bold"
          renderOrder={15}
        >
          {displayValue} ({percentage}%)
        </Text>
      )}
    </group>
  );
}

export default PieSlice;