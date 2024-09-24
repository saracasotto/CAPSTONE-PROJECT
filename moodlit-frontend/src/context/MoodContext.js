import React, { createContext, useState, useEffect } from 'react';

const MoodContext = createContext();

const MoodProvider = ({ children }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState('Spring');

  // Recupera il mood e la stagione salvati dalla sessione
  useEffect(() => {
    const savedMood = sessionStorage.getItem('selectedMood');
    const savedSeason = sessionStorage.getItem('selectedSeason');

    if (savedMood) setSelectedMood(savedMood);
    if (savedSeason) setSelectedSeason(savedSeason);
  }, []);

  // Salva il mood e la stagione quando cambiano
  useEffect(() => {
    if (selectedMood) sessionStorage.setItem('selectedMood', selectedMood);
  }, [selectedMood]);

  useEffect(() => {  
    if (selectedSeason) sessionStorage.setItem('selectedSeason', selectedSeason);
    
    // Seleziona l'elemento con la classe "dashboard-container"
    const dashboardElement = document.querySelector('.dashboard-container');
    
    if (dashboardElement) {
      // Rimuovi le classi tema precedenti
      dashboardElement.classList.remove('spring-theme', 'summer-theme', 'autumn-theme', 'winter-theme');
      
      // Aggiungi la nuova classe in base alla stagione selezionata
      dashboardElement.classList.add(`${selectedSeason.toLowerCase()}-theme`);
    }
  }, [selectedSeason]);

  return (
    <MoodContext.Provider value={{ selectedMood, setSelectedMood, selectedSeason, setSelectedSeason }}>
      {children}
    </MoodContext.Provider>
  );
};

export { MoodContext, MoodProvider };
