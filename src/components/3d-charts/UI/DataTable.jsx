import React, { useState } from 'react';

function DataTable({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedData = React.useMemo(() => {
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
    if (sortConfig.key !== key) {
      return '↕️';
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg border border-gray-800">
      <h3 className="text-white text-lg font-semibold mb-3 flex items-center">
        <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
        Data Overview
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th 
                className="text-left text-gray-300 pb-2 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('label')}
              >
                Category {getSortIcon('label')}
              </th>
              <th 
                className="text-right text-gray-300 pb-2 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('value')}
              >
                Value {getSortIcon('value')}
              </th>
              <th className="text-right text-gray-300 pb-2">Share</th>
              <th className="text-center text-gray-300 pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr 
                key={item.id || index} 
                className="border-b border-gray-800 hover:bg-gray-800 transition-colors duration-200"
              >
                <td className="py-3">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-300 font-medium">
                      {item.label}
                    </span>
                  </div>
                </td>
                <td className="text-right text-white py-3 font-semibold">
                  {item.value}
                </td>
                <td className="text-right text-gray-300 py-3">
                  {item.value}%
                </td>
                <td className="text-center py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.value >= 20 
                      ? 'bg-green-500/20 text-green-400' 
                      : item.value >= 10 
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {item.value >= 20 ? 'High' : item.value >= 10 ? 'Medium' : 'Low'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
        <span>Showing {data.length} entries</span>
        <span>Click headers to sort</span>
      </div>
    </div>
  );
}

export default DataTable;