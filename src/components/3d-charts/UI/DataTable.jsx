import React, { useState, useMemo } from 'react';

function DataTable({ data, headers, overviewHeaderColor }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Use provided headers or fallback to defaults
  const headerLabel = headers?.label || 'Category';
  const headerValue = headers?.value || 'Value';
  
  const sortedData = useMemo(() => {
    if (!data) return []; // Guard against null/undefined data
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (!data) {
    return <div>No data available.</div>;
  }

  return (
    <div
      className="rounded-lg p-4 shadow-lg border text-sm"
      style={{
        backgroundColor: 'var(--card-color)',
        borderColor: 'var(--primary-border-color)',
        color: 'var(--custom-color)',
      }}
    >
      <h3
        className="text-lg font-semibold mb-3 flex items-center"
        style={{ color: overviewHeaderColor || 'var(--card-Header-color)' }} // Use the color from props
      >
        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#FACC15' }}></span>
        Data Overview
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--primary-border-color)' }}>
              <th
                className="pb-2 cursor-pointer transition-colors"
                onClick={() => handleSort('label')}
                style={{
                  color: 'var(--bar-axis-color)',
                  textAlign: 'left',
                }}
              >
                {headerLabel} {getSortIcon('label')}
              </th>
              <th
                className="pb-2 cursor-pointer transition-colors"
                onClick={() => handleSort('value')}
                style={{
                  color: 'var(--bar-axis-color)',
                  textAlign: 'right',
                }}
              >
                {headerValue} {getSortIcon('value')}
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedData.map((item, index) => (
              <tr
                key={item.id || index}
                style={{
                  borderBottom: '1px solid var(--primary-border-color)',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--active-color)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td className="py-3">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span style={{ color: 'var(--custom-color)', fontWeight: 500 }}>
                      {item.label}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-right font-mono">
                    {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="mt-3 flex justify-between items-center text-xs"
        style={{ color: 'var(--bar-axis-color)' }}
      >
        <span>Showing {data.length} entries</span>
        <span>Click headers to sort</span>
      </div>
    </div>
  );
}

export default DataTable;
