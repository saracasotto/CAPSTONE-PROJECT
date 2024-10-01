import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MoodContext = createContext();

const MoodProvider = ({ children }) => {
  const [selectedMood, setSelectedMood] = useState(() => sessionStorage.getItem('selectedMood') || null);
  const [selectedSeason, setSelectedSeason] = useState(() => sessionStorage.getItem('selectedSeason') || 'Spring');

  // Ottieni la posizione corrente con React Router
  const location = useLocation();

  // Salva il mood quando cambia
  useEffect(() => {
    if (selectedMood) sessionStorage.setItem('selectedMood', selectedMood);
  }, [selectedMood]);

  // Applica il tema quando cambia la stagione o cambia la posizione (cioè viene eseguito il redirect)
  useEffect(() => {
    if (selectedSeason) sessionStorage.setItem('selectedSeason', selectedSeason);

    const dashboardElement = document.querySelector('.dashboard-container');
    
    if (dashboardElement) {
      // Rimuovi le classi tema precedenti
      dashboardElement.classList.remove('spring-theme', 'summer-theme', 'autumn-theme', 'winter-theme');
      
      // Aggiungi la nuova classe in base alla stagione selezionata
      dashboardElement.classList.add(`${selectedSeason.toLowerCase()}-theme`);
    }
  }, [selectedSeason, location]); // Rerun when the season or route changes

  return (
    <MoodContext.Provider value={{ selectedMood, setSelectedMood, selectedSeason, setSelectedSeason }}>
      {children}
    </MoodContext.Provider>
  );
};

export { MoodContext, MoodProvider };
