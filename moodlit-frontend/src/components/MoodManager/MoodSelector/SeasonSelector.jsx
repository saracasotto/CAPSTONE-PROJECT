import React, { useContext } from 'react';
import { MoodContext } from '../../../context/MoodContext.js';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './MoodSelector.css'


const SeasonSelector = () => {
    const { setSelectedSeason } = useContext(MoodContext);
    const navigate = useNavigate(); // Hook per la navigazione
  
    const handleSeasonClick = (season) => {
      setSelectedSeason(season);
      navigate('/dashboard'); // Naviga alla dashboard
    };
  
    return (
      <Container fluid className="season-selector-container">
        <h1 className='title-font'>Select your season</h1>
        <div className="seasons title-font">
          {['Spring', 'Summer', 'Autumn', 'Winter'].map((season) => (
            <button key={season} onClick={() => handleSeasonClick(season)}
            className='interactive-bg'>
              {season}
            </button>
          ))}
        </div>
      </Container>
    );
  };
  

export default SeasonSelector;
