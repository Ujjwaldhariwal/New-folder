import React from 'react';

function Header({ isAnimating, toggleAnimation, viewMode, toggleViewMode }) {
  return (
    <div
      className="backdrop-blur-sm border-b"
      style={{
        backgroundColor: 'var(--popup-body-color)',
        borderColor: 'var(--primary-border-color)',
      }}
    >
<div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: 'var(--card-Header-color)' }}
            >
              3D Analytics Dashboard
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: 'var(--bar-axis-color)' }}
            >
              Interactive data visualization with React Three Fiber
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Animation toggle */}
            {viewMode === 'standard' && (
              <button
                onClick={toggleAnimation}
                className="px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                style={{
                  backgroundColor: 'var(--secondary-color)',
                  color: '#fff',
                }}
              >
                <span>{isAnimating ? '⏸️' : '▶️'}</span>
                <span>{isAnimating ? 'Pause Rotation' : 'Start Rotation'}</span>
              </button>
            )}

            {/* View mode toggle */}
            {toggleViewMode && (
              <button
                onClick={toggleViewMode}
                className="px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                style={{
                  backgroundColor: '#7c3aed', // Or use a custom variable like var(--purple-color)
                  color: '#fff',
                }}
              >
                <span>🔄</span>
                <span>Switch View</span>
              </button>
            )}

            {/* Live status */}
            <div className="text-right">
              <div
                className="text-sm font-medium"
                style={{ color: 'var(--card-Header-color)' }}
              >
                Live Data
              </div>
              <div
                className="text-xs"
                style={{ color: '#22c55e' /* Tailwind green-400 */ }}
              >
                ● Connected
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
