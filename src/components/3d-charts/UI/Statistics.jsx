import React from 'react';

function Statistics({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const average = (total / data.length).toFixed(1);
  const highest = Math.max(...data.map(item => item.value));
  const lowest = Math.min(...data.map(item => item.value));
  
  const highestItem = data.find(item => item.value === highest);
  const lowestItem = data.find(item => item.value === lowest);

  const stats = [
    { 
      label: 'Total', 
      value: `${total}%`, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    { 
      label: 'Average', 
      value: `${average}%`, 
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    { 
      label: 'Highest', 
      value: `${highest}%`, 
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      subtitle: highestItem?.label
    },
    { 
      label: 'Lowest', 
      value: `${lowest}%`, 
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      subtitle: lowestItem?.label
    }
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg border border-gray-800">
      <h3 className="text-white text-lg font-semibold mb-3 flex items-center">
        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
        Statistics
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className={`${stat.bgColor} rounded-lg p-3 border border-gray-700`}
          >
            <div className="text-gray-300 text-xs font-medium mb-1">
              {stat.label}
            </div>
            <div className={`${stat.color} text-lg font-bold`}>
              {stat.value}
            </div>
            {stat.subtitle && (
              <div className="text-gray-400 text-xs mt-1">
                {stat.subtitle}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gray-800 rounded-lg">
        <div className="text-xs text-gray-400 mb-2">Performance Metrics</div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Data Points:</span>
          <span className="text-white font-medium">{data.length}</span>
        </div>
      </div>
    </div>
  );
}

export default Statistics;