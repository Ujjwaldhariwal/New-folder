import React from 'react';
import { OrbitControls } from '@react-three/drei';
import PieChart3D from './PieChart3D';
import BarChart3D from './BarChart3D';

function Scene({ data, isAnimating, chartType = 'pie' }) {
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <BarChart3D data={data} />;
      case 'pie':
      default:
        return <PieChart3D data={data} />;
    }
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[5, 10, 5]}
        intensity={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
      />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Chart */}
      {renderChart()}

      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>

      {/* Camera Controls */}
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        autoRotate={isAnimating}
        autoRotateSpeed={0.5}
        minDistance={3}
        maxDistance={12}
      />
    </>
  );
}

export default Scene;
