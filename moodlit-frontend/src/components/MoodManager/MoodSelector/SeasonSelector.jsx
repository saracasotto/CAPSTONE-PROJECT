import React, { useContext } from 'react';
import { MoodContext } from '../../../context/MoodContext.js';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './MoodSelector.css';

const SeasonSelector = () => {
  const { setSelectedSeason } = useContext(MoodContext);
  const navigate = useNavigate();

  const handleSeasonClick = (season) => {
    setSelectedSeason(season);
    navigate('/dashboard'); // Naviga alla dashboard
  };

  return (
    <Container fluid className="season-selector-container bg-main">
      <h1 className='title-font'>Select your season</h1>
      <div className="seasons">
        {['Spring', 'Summer', 'Autumn', 'Winter'].map((season) => (
          <button key={season} onClick={() => handleSeasonClick(season)}
          className='accent-bg'>
            {season}
          </button>
        ))}
      </div>
    </Container>
  );
};

export default SeasonSelector;
