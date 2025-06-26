import React, { useState, useMemo, useEffect } from 'react';
import { Text } from '@react-three/drei';
import Bar3D from './Bar3D'; // Assumes Bar3D is the child component for individual bars

function BarChart3D({ data, labelStyle = 'front' }) {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [isDark, setIsDark] = useState(false);

  // Checks the document's theme once on mount and observes changes.
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // Uses CSS variables for consistent, theme-aware colors.
  const themeColors = useMemo(() => {
    return {
      platform: isDark ? 'var(--card-dark)' : 'var(--background-light)',
      gridLines: isDark ? 'var(--border-dark)' : 'var(--border-light)',
      text: isDark ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)',
    };
  }, [isDark]);
  
  // Return null to prevent rendering errors if data is not yet available.
  if (!data || data.length === 0) {
    return null; 
  }

  // Calculate chart dimensions dynamically for responsiveness.
  const maxValue = Math.max(...data.map(item => item.value), 1); // Avoids division by zero.
  const spacing = 1.4;
  const chartWidth = data.length * spacing;
  const startX = -(chartWidth - spacing) / 2;

  // Memoize the calculation of bars to prevent re-computation on every render.
  const bars = useMemo(() => data.map((item, index) => {
    // Ensure height is a valid number, defaulting to 0 to prevent geometry errors.
    const height = item.value > 0 ? (item.value / maxValue) * 3 : 0;
    const xPosition = startX + index * spacing;

    return (
      <Bar3D
        key={item.id || index}
        position={[xPosition, 0, 0]}
        height={height}
        color={item.color}
        label={item.label}
        value={item.value}
        isHovered={hoveredIndex === index}
        onHover={() => setHoveredIndex(index)}
        onLeave={() => setHoveredIndex(-1)}
        labelStyle={labelStyle}
      />
    );
  }), [data, maxValue, startX, spacing, hoveredIndex, labelStyle]);

  // Dynamically generate Y-axis labels for different scales.
  const yAxisLabels = useMemo(() => {
    const labels = [];
    const stepCount = 4; // Determines the number of grid lines.
    for (let i = 1; i <= stepCount; i++) {
        const value = Math.round((i / stepCount) * maxValue);
        const yPos = (i / stepCount) * 3;
        labels.push({ value, yPos });
    }
    return labels;
  }, [maxValue]);

  return (
    <group>
      {bars}

      {/* Base platform for the bars */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[chartWidth, 3.2]} />
        <meshStandardMaterial 
          color={isDark ? '#1f2937' : '#f9fafb'} // Subtle platform color
          roughness={0.8} 
          metalness={0.1} 
        />
      </mesh>

      {/* Y-axis grid lines and labels */}
      {yAxisLabels.map((labelInfo) => (
        <group key={labelInfo.value}>
          <mesh position={[0, labelInfo.yPos, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[chartWidth, 0.015]} />
            <meshStandardMaterial 
              color={themeColors.gridLines}
              transparent 
              opacity={0.3} 
            />
          </mesh>
          <Text
            position={[startX - 0.9, labelInfo.yPos, 0]}
            fontSize={0.12}
            color={themeColors.text}
            anchorX="center"
            anchorY="middle"
          >
            {labelInfo.value}
          </Text>
        </group>
      ))}
    </group>
  );
}

export default BarChart3D;
