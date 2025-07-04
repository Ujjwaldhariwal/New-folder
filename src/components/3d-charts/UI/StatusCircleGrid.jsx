// StatusCircleGrid.js
import React from 'react';
import StatusCircle from './StatusCircle';

function StatusCircleGrid({ data = [], isLoading = false }) {
  const fallbackData = [
    { id: -1, label: 'Data N/A', value: 0, color: '#9CA3AF' }
  ];

  const displayData = isLoading
    ? [
        { id: 1, label: 'Loading...', value: '...', color: '#6b7280', isLoading: true },
        { id: 2, label: 'Loading...', value: '...', color: '#6b7280', isLoading: true },
        { id: 3, label: 'Loading...', value: '...', color: '#6b7280', isLoading: true },
        { id: 4, label: 'Loading...', value: '...', color: '#6b7280', isLoading: true },
      ]
    : (Array.isArray(data) && data.length > 0 ? data : fallbackData);

  return (
    <div 
      className="rounded-lg custom_border p-3 sm:p-4 md:p-5 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300"
      style={{
        backgroundColor: 'var(--card-color)',
        borderColor: 'var(--primary-border-color)',
      }}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 items-center justify-items-center h-full auto-rows-fr">
        {displayData.map((item) => (
          <StatusCircle
            key={item.id}
            label={item.label}
            value={item.value}
            color={item.color}
            isLoading={item.isLoading} 
          />
        ))}
      </div>
    </div>
  );
}

export default StatusCircleGrid;
