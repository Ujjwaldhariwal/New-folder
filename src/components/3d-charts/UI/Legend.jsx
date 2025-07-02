import React from 'react';

function Legend({ data }) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg border border-gray-800">
      <h3 className="text-white text-lg font-semibold mb-3 flex items-center">
        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
        Legend
      </h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div 
            key={item.id || index} 
            className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800 transition-colors duration-200"
          >
            <div 
              className="w-4 h-4 rounded shadow-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-300 text-sm flex-1 font-medium">
              {item.label}
            </span>
            <span className="text-white font-semibold">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          Total: {data.reduce((sum, item) => sum + item.value, 0)}%
        </div>
      </div>
    </div>
  );
}

export default Legend;