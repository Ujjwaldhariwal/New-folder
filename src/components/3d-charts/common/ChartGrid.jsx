import React from 'react';
import CompactChart from '../UI/CompactChart';

/**
 * A responsive grid component for displaying charts.
 * @param {object} props - The component props.
 * @param {Array<object>} props.charts - An array of chart objects to display.
 * @param {number} [props.columns=3] - The default number of columns for the grid layout.
 * @param {function} props.onChartClick - A callback function to handle clicks on individual charts.
 */
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
        <CompactChart
          key={chart.id}
          {...chart}
          height="250px"
          onClick={() => onChartClick(chart)}
        />
      ))}
    </div>
  );
}

export default ChartGrid;