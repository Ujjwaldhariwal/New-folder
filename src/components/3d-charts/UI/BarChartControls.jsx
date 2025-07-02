import React from 'react';

function BarChartControls({ labelStyle, onLabelStyleChange }) {
  const labelOptions = [
    { 
      id: 'front', 
      name: 'Front Labels', 
      icon: '📍', 
      description: 'Labels in front of chart with connecting lines' 
    },
    { 
      id: 'onbar', 
      name: 'On Bar', 
      icon: '📝', 
      description: 'Labels written on the bars themselves' 
    },
    { 
      id: 'hover', 
      name: 'Hover Only', 
      icon: '👆', 
      description: 'Labels appear only when hovering' 
    }
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg border border-gray-800">
      <h3 className="text-white text-lg font-semibold mb-3 flex items-center">
        <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
        Bar Labels
      </h3>
      
      <div className="space-y-2">
        {labelOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onLabelStyleChange(option.id)}
            className={`w-full p-3 rounded-lg transition-all duration-200 text-left ${
              labelStyle === option.id
                ? 'bg-orange-600 text-white border-orange-500 border'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{option.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-sm">{option.name}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {option.description}
                </div>
              </div>
              {labelStyle === option.id && (
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              )}
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-3 p-2 bg-gray-800 rounded text-xs text-gray-400">
        💡 Try different label styles to find what works best for your data
      </div>
    </div>
  );
}

export default BarChartControls;