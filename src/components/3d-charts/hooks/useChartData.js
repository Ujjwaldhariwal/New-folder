import { useState, useEffect } from 'react';
import { sampleData } from '../data/sampleData';

export const useChartData = () => {
  const [data, setData] = useState(sampleData);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(true);
  const [chartType, setChartType] = useState('pie');

  const updateData = (newData) => {
    setData(newData);
  };

  const handleHover = (index) => {
    setHoveredIndex(index);
  };

  const handleLeave = () => {
    setHoveredIndex(-1);
  };

  const toggleAnimation = () => {
    setIsAnimating(prev => !prev);
  };

  const changeChartType = (type) => {
    setChartType(type);
  };

  // Reset hover state when chart type changes
  useEffect(() => {
    setHoveredIndex(-1);
  }, [chartType]);

  return {
    data,
    hoveredIndex,
    isAnimating,
    chartType,
    updateData,
    handleHover,
    handleLeave,
    toggleAnimation,
    changeChartType
  };
};