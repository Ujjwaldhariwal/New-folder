

function ChartSelector({ activeChart, onChartChange }) {
  const chartTypes = [
    { id: 'pie', name: 'Pie Chart', icon: '🥧', description: 'Classic pie visualization' },
    { id: 'donut', name: 'Donut Chart', icon: '🍩', description: 'Ring-shaped chart with center info' },
    { id: 'bar', name: 'Bar Chart', icon: '📊', description: '3D bar comparison' }
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg border border-gray-800">
      <h3 className="text-white text-lg font-semibold mb-3 flex items-center">
        <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
        Chart Type
      </h3>
      
      <div className="space-y-2">
        {chartTypes.map((chart) => (
          <button
            key={chart.id}
            onClick={() => onChartChange(chart.id)}
            className={`w-full p-3 rounded-lg transition-all duration-200 text-left ${
              activeChart === chart.id
                ? 'bg-blue-600 text-white border-blue-500 border'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{chart.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{chart.name}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {chart.description}
                </div>
              </div>
              {activeChart === chart.id && (
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              )}
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gray-800 rounded-lg">
        <div className="text-xs text-gray-400 mb-1">Current Selection</div>
        <div className="text-sm text-white font-medium">
          {chartTypes.find(c => c.id === activeChart)?.name || 'Pie Chart'}
        </div>
      </div>
    </div>
  );
}

export default ChartSelector;