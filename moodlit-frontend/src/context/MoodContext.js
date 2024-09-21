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
  }, [selectedSeason]);

  return (
    <MoodContext.Provider value={{ selectedMood, setSelectedMood, selectedSeason, setSelectedSeason }}>
      {children}
    </MoodContext.Provider>
  );
};

export { MoodContext, MoodProvider };

