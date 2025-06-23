import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme === 'dark' ? true : false;  // Default to light mode
  });

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
      localStorage.setItem('theme', 'light');  // Ensure default is stored as light
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };
  
  return (
    <>
      <label className="toggle-label mr-5">
        <input className="toggle-checkbox input" type="checkbox" onClick={toggleTheme} 
          checked={isDarkMode}
          readOnly />
        <div className="toggle-slot">
          <div className="sun-icon-wrapper">
            <FiSun className="sun-icon" />
          </div>
          <div className="toggle-button"></div>
          <div className="moon-icon-wrapper">
            <FiMoon className="moon-icon" />
          </div>
        </div>
      </label>
    </>
  );
};

export default ThemeToggle;
