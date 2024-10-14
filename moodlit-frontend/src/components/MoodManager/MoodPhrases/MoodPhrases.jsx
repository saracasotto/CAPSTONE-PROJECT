import React, { useState, useEffect, useContext } from 'react';
import { MoodContext } from '../../../context/MoodContext.js';
import { Container } from 'react-bootstrap';
import './MoodPhrases.css'


const MoodPhrases = () => {
  const { selectedMood } = useContext(MoodContext);
  const [phrase, setPhrase] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (selectedMood) {
      fetch(`${apiHost}:${apiPort}/api/phrases?mood=${selectedMood}`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setPhrase(data); 
          }
        })
        .catch(error => console.error('Error fetching phrases:', error));
    }
  }, [selectedMood, API_URL]);

  return (
    <Container className="phrase-display glass-bg title-font text-main p-4 mt-md-5">
      {phrase ? (
        <>
          <p>{phrase.text}</p>
          <p>- {phrase.author}</p>
        </>
      ) : (
        <p>Select your mood to see today's phrase 🧡</p>
      )}
    </Container>
  );
};

export default MoodPhrases;
