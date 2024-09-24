import React, { useState, useEffect, useContext } from 'react';
import { MoodContext } from '../../../context/MoodContext.js';
import { Container } from 'react-bootstrap';


const MoodPhrases = () => {
  const { selectedMood } = useContext(MoodContext);
  const [phrase, setPhrase] = useState(null);

  const apiHost = process.env.REACT_APP_API_HOST;
  const apiPort = process.env.REACT_APP_API_PORT;

  useEffect(() => {
    if (selectedMood) {
      fetch(`${apiHost}:${apiPort}/api/phrases?mood=${selectedMood}`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setPhrase(data); 
          }
        })
        .catch(error => console.error('Errore nel recupero della frase:', error));
    }
  }, [selectedMood, apiHost, apiPort]);

  return (
    <Container fluid className="phrase-display title-font mt-5 mb-5">
      {phrase ? (
        <>
          <h4><i>{phrase.text}</i></h4>
          <p>- {phrase.author}</p>
        </>
      ) : (
        <p>Select your mood to see today's phrase 🧡</p>
      )}
    </Container>
  );
};

export default MoodPhrases;
