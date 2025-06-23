import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = false, 
  icon,
  subtitle 
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 mb-4">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
        onClick={toggleOpen}
      >
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
              <span className="text-blue-700 text-lg">{icon}</span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-black">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-800 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            className="p-1 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              toggleOpen();
            }}
          >
            {isOpen ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-800" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 pt-0 border-t border-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}

export default CollapsibleSection;
