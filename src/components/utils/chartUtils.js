export const calculateAngles = (data) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  return data.map(item => {
    const sliceAngle = (item.value / total) * Math.PI * 2;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;
    
    return { ...item, startAngle, endAngle, sliceAngle };
  });
};

export const getStatistics = (data) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const average = (total / data.length).toFixed(1);
  const highest = Math.max(...data.map(item => item.value));
  const lowest = Math.min(...data.map(item => item.value));
  
  return { total, average, highest, lowest };
};

export const getMidAngle = (startAngle, endAngle) => {
  return (startAngle + endAngle) / 2;
};

export const getLabelPosition = (midAngle, radius) => {
  const labelRadius = radius + 0.8;
  return [
    labelRadius * Math.cos(midAngle),
    0.25,
    labelRadius * Math.sin(midAngle)
  ];
};