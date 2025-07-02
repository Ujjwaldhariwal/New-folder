import React from 'react';

/**
 * A component to display a value inside a colored circle with a label.
 * @param {object} props - The component props.
 * @param {string} props.label - The label displayed below the circle.
 * @param {number|string} props.value - The value displayed inside the circle.
 * @param {string} props.color - The color of the circle's border and the label's indicator.
 * @param {boolean} [props.isLoading=false] - If true, shows a loading state.
 */
function StatusCircle({ label, value, color, isLoading = false }) {
  const displayValue = () => {
    if (isLoading) {
      return (
        <span className="text-lg font-semibold" style={{ color: 'var(--label-color)' }}>
          Loading...
        </span>
      );
    }
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value;
  };

  // Generate a light background color based on the border color
  const getLightBackgroundColor = (borderColor) => {
    let hex = borderColor;

    if (hex.startsWith('#')) {
      hex = hex.replace('#', '');
    }

    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const lightR = Math.round(r + (255 - r) * 0.85);
    const lightG = Math.round(g + (255 - g) * 0.85);
    const lightB = Math.round(b + (255 - b) * 0.85);

    return `rgb(${lightR}, ${lightG}, ${lightB})`;
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div
        className="w-36 h-36 rounded-full border-4 flex items-center justify-center mb-4 transition-all duration-300 hover:scale-105 shadow-sm"
        style={{
          borderColor: color,
          backgroundColor: isLoading ? '#f3f4f6' : getLightBackgroundColor(color)
        }}
      >
        <div className="text-2xl font-bold text-gray-800">
          {/* ✅ Value display remains untouched */}
          {displayValue()}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        ></div>
        <span
          className="text-sm font-medium whitespace-nowrap"
          style={{ color: 'var(--label-color)' }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export default StatusCircle;
