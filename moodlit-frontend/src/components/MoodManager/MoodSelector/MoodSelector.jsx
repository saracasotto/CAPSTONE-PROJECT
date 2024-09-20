
function MoodSelector(){
  return (
    <div className="app-container">
      <h2>Seleziona Mood e Stagione</h2>

      {/* Dropdown per la selezione del mood */}
      <label htmlFor="mood">Mood:</label>
      <select id="mood" >
        <option value="nostalgic">Nostalgic</option>
        <option value="cosy">Cosy</option>
        <option value="focus">Focus</option>
        <option value="energetic">Energetic</option>
        <option value="inspirational">Inspirational</option>
        <option value="relaxed">Relaxed</option>
        <option value="grateful">Grateful</option>
      </select>

      {/* Dropdown per la selezione della stagione */}
      <label htmlFor="season">Season:</label>
      <select id="season">
        <option value="spring">Spring</option>
        <option value="summer">Summer</option>
        <option value="autumn">Autumn</option>
        <option value="winter">Winter</option>
      </select>


        <div className="phrase-display">
          <p>ciao</p>
          <p>ciao</p>
        </div>
      
    </div>
  );
};

export default MoodSelector;
