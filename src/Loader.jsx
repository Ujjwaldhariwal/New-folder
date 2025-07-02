import React from 'react';

const Loader = ({
  size = 48,
  color = '#0ea5e9',
  text = 'Loading...',
  strokeWidth = 4,
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="animate-spin"
        style={{ animation: 'spin 1s linear infinite' }}
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-300 dark:text-gray-700"
          opacity="0.25"
        />
        {/* Foreground spinning arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          style={{
            transformOrigin: '50% 50%',
            transform: 'rotate(-90deg)'
          }}
        />
      </svg>

      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium animate-pulse tracking-wide">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
