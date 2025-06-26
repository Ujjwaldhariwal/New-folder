import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

function CollapsibleSection({
  title,
  children,
  subtitle,
  isOpen,
  onToggle,
}) {
  return (
    <div
      className="rounded-md border transition-all duration-300 p-1 sm:p-4"
      style={{
        backgroundColor: 'var(--card-color)',
        borderColor: 'var(--primary-border-color)',
        color: 'var(--custom-color)',
      }}
    >
      {/* Header */}
      <div
        onClick={onToggle}
        className="flex items-center justify-between cursor-pointer px-2 py-1"
      >
        <div className="flex-1 text-center">
          <h3
            className="text-base sm:text-lg font-semibold"
            style={{ color: 'var(--heading-color)' }}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              className="text-xs sm:text-sm mt-1"
              style={{ color: 'var(--heading-color)' }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div className="ml-2" style={{ color: 'var(--bar-axis-color)' }}>
          {isOpen ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
        </div>
      </div>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-300 ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-1 sm:px-2" style={{ color: 'var(--heading-color)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default CollapsibleSection;
