import React from 'react';
import { Canvas } from '@react-three/fiber';
import CompactScene from './CompactScene';

function CompactChart({
  data,
  type = 'bar',
  title,
  height = '250px',
  barLabelStyle = 'onbar'
}) {
  const isDataAvailable = Array.isArray(data) && data.length > 0;

  return (
    <div
      className="rounded-lg custom_border overflow-hidden flex flex-col h-full"
      style={{
        backgroundColor: 'var(--card-color)',
        borderColor: 'var(--primary-border-color)'
      }}
    >
      {title && (
        <div
          className="px-4 py-3 custom_border"
          style={{
            borderColor: 'var(--primary-border-color)',
            borderBottomWidth: '0.9px',
            borderStyle: 'solid'
          }}
        >
          <h4
            className="text-sm font-semibold"
            style={{ color: 'var(--card-Header-color)' }}
          >
            {title}
          </h4>
        </div>
      )}

      <div style={{ height }} className="relative flex-grow">
        <Canvas
          shadows
          camera={{
            position: type === 'pie' ? [0, 5, 5] : [0, 5, 10],
            fov: 35
          }}
          style={{ background: 'var(--card-color)' }}
        >
          <CompactScene
            data={data}
            chartType={type}
            barLabelStyle={barLabelStyle}
            labelStyle="compact"
          />
        </Canvas>
      </div>

      <div
        className="px-4 py-2 custom_border"
        style={{
          backgroundColor: 'var(--popup-body-color)',
          borderColor: 'var(--primary-border-color)',
          borderTopWidth: '0.9px',
          borderStyle: 'solid'
        }}
      >
        <div className="flex flex-wrap gap-2">
          {isDataAvailable ? (
            <>
              {data.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: 'var(--bar-axis-color)' }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
              {data.length > 3 && (
                <span
                  className="text-xs"
                  style={{ color: 'var(--bar-axis-color)' }}
                >
                  +{data.length - 3} more
                </span>
              )}
            </>
          ) : (
            <span className="text-xs" style={{ color: 'var(--bar-axis-color)' }}>
              Loading data...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompactChart;
