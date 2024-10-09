import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MoodContext = createContext();

const MoodProvider = ({ children }) => {
  const [selectedMood, setSelectedMood] = useState(() => sessionStorage.getItem('selectedMood') || null);
  const [selectedSeason, setSelectedSeason] = useState(() => sessionStorage.getItem('selectedSeason') || 'Spring');

  const location = useLocation();

  // Save mood when it changes
  useEffect(() => {
    if (selectedMood) sessionStorage.setItem('selectedMood', selectedMood);
  }, [selectedMood]);

  // Apply theme when season changes or location changes
  useEffect(() => {
    if (selectedSeason) sessionStorage.setItem('selectedSeason', selectedSeason);

    const dashboardElement = document.querySelector('.dashboard-container');
    
    if (dashboardElement) {
      // Remove previous theme classes
      dashboardElement.classList.remove('spring-theme', 'summer-theme', 'autumn-theme', 'winter-theme');
      
      // Add new class based on selected season
      dashboardElement.classList.add(`${selectedSeason.toLowerCase()}-theme`);
    }
  }, [selectedSeason, location]);

  return (
    <MoodContext.Provider value={{ selectedMood, setSelectedMood, selectedSeason, setSelectedSeason }}>
      {children}
    </MoodContext.Provider>
  );
};

export { MoodContext, MoodProvider };