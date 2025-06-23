import React from 'react';
import CompactChart from '../UI/CompactChart';

function ChartGrid({ charts, columns = 3 }) {
  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div className={`grid ${getGridCols()} gap-4`}>
      {charts.map((chart, index) => (
        <CompactChart
          key={chart.id || index}
          data={chart.data}
          chartType={chart.type}
          title={chart.title}
          height={chart.height || '250px'}
          barLabelStyle={chart.barLabelStyle || 'hover'}
        />
      ))}
    </div>
  );
}

export default ChartGrid;