const NotesSection = ({ bookId }) => {
    const [notes, setNotes] = useState([]);
    
    useEffect(() => {
      //QUI FACCIO FETCH NOTE
    }, []);
  
    const addNote = (chapter, content) => {
      // Aggiungi una nota specificando capitolo e contenuto
    };
  
    return (
      <div className="notes-section">
        <h4>Notes</h4>
        {notes.map(note => (
          <div key={note._id}>
            <h5>Chapter {note.chapter}</h5>
            <p>{note.content}</p>
          </div>
        ))}

        <NoteForm addNote={addNote} />
      </div>
    );
  };
  