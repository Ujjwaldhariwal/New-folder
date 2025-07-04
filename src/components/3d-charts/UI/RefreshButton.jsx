import React, { useState } from 'react';
import { RefreshCw, Check, X } from 'lucide-react';

function RefreshButton({ onClick, loading }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleClick = async (e) => {
    e.stopPropagation();
    
    if (isLoading || showSuccess || showError) return; // Prevent multiple clicks
    
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      if (onClick) {
        await onClick(); // Wait for the data to be fetched
      }
      
      // Ensure minimum 6-7 seconds spinning time
      const elapsedTime = Date.now() - startTime;
      const minSpinTime = 6500; // 6.5 seconds
      
      if (elapsedTime < minSpinTime) {
        // Wait for remaining time to complete 6.5 seconds
        await new Promise(resolve => setTimeout(resolve, minSpinTime - elapsedTime));
      }
      
      // Show success state
      setIsLoading(false);
      setShowSuccess(true);
      
      // Reset to normal state after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      
    } catch (error) {
      // Handle error case - still respect minimum spin time
      const elapsedTime = Date.now() - startTime;
      const minSpinTime = 6500;
      
      if (elapsedTime < minSpinTime) {
        await new Promise(resolve => setTimeout(resolve, minSpinTime - elapsedTime));
      }
      
      setIsLoading(false);
      setShowError(true);
      
      // Reset to normal state after 2 seconds
      setTimeout(() => {
        setShowError(false);
      }, 2000);
      
      console.error('Refresh failed:', error);
    }
  };

  const getButtonClasses = () => {
    const baseClasses = "p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95";
    
    if (showSuccess) {
      return `${baseClasses} text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 focus:ring-green-500 refresh-glow-success`;
    }
    
    if (showError) {
      return `${baseClasses} text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:ring-red-500 refresh-glow-error`;
    }
    
    if (isLoading) {
      return `${baseClasses} text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 focus:ring-indigo-500 refresh-glow`;
    }
    
    return `${baseClasses} text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 focus:ring-indigo-500`;
  };

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .refresh-spin {
          animation: spin 1s linear infinite;
        }
        
        .refresh-glow {
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
        }
        
        .refresh-glow-success {
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
        }
        
        .refresh-glow-error {
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
        }
      `}</style>
      
      <button
        onClick={handleClick}
        disabled={isLoading || showSuccess || showError}
        className={getButtonClasses()}
        title={showSuccess ? "Refreshed successfully" : showError ? "Refresh failed" : isLoading ? "Refreshing..." : "Refresh"}
      >
        {showSuccess ? (
          <Check size={16} className="animate-pulse" />
        ) : showError ? (
          <X size={16} className="animate-pulse" />
        ) : (
          <RefreshCw 
            size={16} 
            className={isLoading ? "refresh-spin" : ""} 
          />
        )}
      </button>
    </>
  );
}

export default RefreshButton;