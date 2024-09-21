import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoodContext } from '../../../context/MoodContext.js';
import { Container } from 'react-bootstrap';
import './MoodSelector.css'

const MoodSelector = () => {
  const { setSelectedMood } = useContext(MoodContext);
  const navigate = useNavigate(); 

  const handleMoodClick = (mood) => {
    setSelectedMood(mood);
    navigate('/season-selection'); 
  };

  return (
    <Container fluid className="mood-selector-container">
      <h1 className='title-font'>Select your mood</h1>
      <div className="moods title-font">
        {['nostalgic', 'cosy', 'focused', 'motivated', 'energetic', 'inspirational', 'relaxed', 'grateful'].map((mood) => (
          <button key={mood} onClick={() => handleMoodClick(mood)}
          className='interactive-bg'>
            {mood}
          </button>
        ))}
      </div>
    </Container>
  );
};

export default MoodSelector;
