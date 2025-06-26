// components/charts/PieChart3D.tsx
import React, { useState, useEffect, useMemo } from 'react';
import PieSlice from './PieSlice';

function PieChart3D({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [isDark, setIsDark] = useState(false);

  // Check theme from document class
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Theme-based styling (if you need to add platform or base elements)
  const themeColors = useMemo(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    return {
      platform: isDark ? '#1f1f1f' : '#e5e7eb',
      gridLines: isDark ? '#444' : '#9ca3af',
      // Use your CSS variables:
      cardColor: computedStyle.getPropertyValue('--card-color').trim(),
      primaryBorderColor: computedStyle.getPropertyValue('--primary-border-color').trim()
    };
  }, [isDark]);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const slices = data.map((item, index) => {
    const sliceAngle = (item.value / total) * Math.PI * 2;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    return (
      <PieSlice
        key={item.id || index}
        startAngle={startAngle}
        endAngle={endAngle}
        radius={2}
        height={0.5}
        color={item.color}
        label={item.label}
        value={((item.value / total) * 100).toFixed(1)}
        position={[0, 0, 0]}
        isHovered={hoveredIndex === index}
        onHover={() => setHoveredIndex(index)}
        onLeave={() => setHoveredIndex(-1)}
      />
    );
  });

  return (
    <group>
      {slices}
      
      {/* Optional: Add a base platform for the pie chart */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial 
          color={themeColors.platform} 
          transparent 
          opacity={0.1}
          roughness={0.8} 
          metalness={0.1} 
        />
      </mesh>
    </group>
  );
}

export default PieChart3D;
