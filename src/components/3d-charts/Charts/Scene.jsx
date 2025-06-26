import React, { useMemo, useEffect, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import PieChart3D from './PieChart3D';
import BarChart3D from './BarChart3D';

function Scene({ data, isAnimating, chartType = 'pie' }) {
  const [isDark, setIsDark] = useState(false);

  // Check theme from document class
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

  // Use a simplified lighting and animation config
  const themeConfig = useMemo(() => ({
    lighting: {
      ambient: isDark ? 0.5 : 0.8,
      directional: isDark ? 0.9 : 1.5,
      point1: isDark ? 0.7 : 1.2,
      point2: isDark ? 0.4 : 0.6,
      shadowOpacity: isDark ? 0.35 : 0.2
    },
    colors: {
      // These colors are for lighting and shadows, not direct component styling
      directionalLight: '#ffffff',
      pointLight1: isDark ? '#5c9aff' : '#ffc875',
      pointLight2: isDark ? '#ff7b7b' : '#a1ff8b',
      shadowColor: '#000000',
      groundPlane: isDark ? 'var(--card-dark)' : 'var(--background-light)'
    },
    animation: {
      autoRotateSpeed: 0.4,
      cameraMinDistance: 3,
      cameraMaxDistance: 15
    }
  }), [isDark]);

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
      {/* Optimized Lighting Setup */}
      <ambientLight intensity={themeConfig.lighting.ambient} />
      <directionalLight
        castShadow
        position={[8, 12, 8]}
        intensity={themeConfig.lighting.directional}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        color={themeConfig.colors.directionalLight}
      />
      <pointLight 
        position={[15, 10, 15]} 
        intensity={themeConfig.lighting.point1} 
        color={themeConfig.colors.pointLight1}
      />
      <pointLight 
        position={[-15, -10, -15]} 
        intensity={themeConfig.lighting.point2} 
        color={themeConfig.colors.pointLight2}
      />

      {/* Render the selected chart */}
      {renderChart()}

      {/* Ground plane to receive shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <shadowMaterial 
          transparent 
          opacity={themeConfig.lighting.shadowOpacity} 
          color={themeConfig.colors.shadowColor}
        />
      </mesh>
      
      {/* A solid plane matching the background to hide the grid below a certain point */}
       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.11, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial 
          color={themeConfig.colors.groundPlane}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Camera Controls */}
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        autoRotate={isAnimating}
        autoRotateSpeed={themeConfig.animation.autoRotateSpeed}
        minDistance={themeConfig.animation.cameraMinDistance}
        maxDistance={themeConfig.animation.cameraMaxDistance}
        dampingFactor={0.05}
        enableDamping
      />
    </>
  );
}

export default Scene;
