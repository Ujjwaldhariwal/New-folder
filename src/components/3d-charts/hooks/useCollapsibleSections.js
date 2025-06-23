import { useState, useEffect } from 'react';

export const useCollapsibleSections = (sections) => {
  // Initialize open sections based on defaultOpen property
  const [openSections, setOpenSections] = useState(() => {
    const initialState = {};
    sections.forEach(section => {
      initialState[section.id] = section.defaultOpen || false;
    });
    return initialState;
  });

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const openSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: true
    }));
  };

  const closeSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: false
    }));
  };

  const closeAllSections = () => {
    const closedState = {};
    sections.forEach(section => {
      closedState[section.id] = false;
    });
    setOpenSections(closedState);
  };

  const openAllSections = () => {
    const openedState = {};
    sections.forEach(section => {
      openedState[section.id] = true;
    });
    setOpenSections(openedState);
  };

  const resetToDefaults = () => {
    const defaultState = {};
    sections.forEach(section => {
      defaultState[section.id] = section.defaultOpen || false;
    });
    setOpenSections(defaultState);
  };

  return {
    openSections,
    toggleSection,
    openSection,
    closeSection,
    closeAllSections,
    openAllSections,
    resetToDefaults
  };
};