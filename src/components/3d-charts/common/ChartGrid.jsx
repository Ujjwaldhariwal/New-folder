import React from 'react';
import CompactChart from '../UI/CompactChart';

function ChartGrid({ charts, columns = 3, onChartClick }) {
  const getGridCols = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      case 3:
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div className={`grid gap-2 ${getGridCols()}`}>
      {charts.map((chart) => (
        <div
          key={chart.id}
          className="cursor-pointer"
          onClick={() => onChartClick(chart)}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onChartClick(chart); }}
        >
          <CompactChart {...chart} height="250px" />
        </div>
      ))}
    </div>
  );
}

export default ChartGrid;
