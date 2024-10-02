import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardBody, CardSubtitle, CardTitle, Form, ListGroup, ListGroupItem } from 'react-bootstrap';
import './Notes.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Notes = ({ bookId }) => {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState({ title: '', chapter: '', content: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [noteId, setNoteId] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);


    const API_HOST = process.env.REACT_APP_API_HOST;
    const API_PORT = process.env.REACT_APP_API_PORT;

    // Funzione per recuperare le note relative al libro specificato da bookId
    const fetchNotes = useCallback(async () => {
        const token = localStorage.getItem('token'); // Recupera il token dal localStorage
        try {
            const response = await fetch(`${API_HOST}:${API_PORT}/api/notes/${bookId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Usa il token direttamente
                },
            });

            if (!response.ok) {
                throw new Error('Errore nel recupero delle note');
            }

            const data = await response.json();
            setNotes(data); // Imposta le note recuperate
        } catch (error) {
            console.error(error);
        }
    }, [API_HOST, API_PORT, bookId]);

    // useEffect per chiamare fetchNotes al montaggio del componente
    useEffect(() => {
        fetchNotes(); // Chiama fetchNotes quando il componente viene montato
    }, [fetchNotes]);

    // Funzione per creare o modificare una nota
    const handleCreateNote = async () => {
        const token = localStorage.getItem('token'); // Recupera il token dal localStorage
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing
            ? `${API_HOST}:${API_PORT}/api/notes/${noteId}` // PUT per aggiornare una nota esistente
            : `${API_HOST}:${API_PORT}/api/notes/${bookId}/addnote`; // POST per creare una nuova nota

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Usa il token direttamente
                },
                body: JSON.stringify(currentNote), // Invia la nota come JSON
            });

            if (!response.ok) {
                throw new Error('Errore nel salvataggio della nota');
            }

            fetchNotes(); // Richiama fetchNotes dopo la creazione o modifica
            resetForm(); // Reset del form dopo l'operazione
        } catch (error) {
            console.error(error);
        }
    };

    // Funzione per cancellare una nota
    const handleDeleteNote = async (id) => {
        const token = localStorage.getItem('token'); // Recupera il token dal localStorage
        try {
            const response = await fetch(`${API_HOST}:${API_PORT}/api/notes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`, // Usa il token direttamente
                },
            });

            if (!response.ok) {
                throw new Error('Errore nella cancellazione della nota');
            }

            fetchNotes(); // Richiama fetchNotes dopo la cancellazione
        } catch (error) {
            console.error(error);
        }
    };

    // Funzione per caricare una nota nel form per la modifica
    const handleEditNote = (note) => {
        setCurrentNote({
            title: note.title,
            chapter: note.chapter,
            content: note.content,
        });
        setNoteId(note._id);
        setIsEditing(true);
    };

    // Funzione per aggiornare il contenuto del Quill
    const handleChange = (content) => {
        setCurrentNote({ ...currentNote, content });
    };

    // Funzione per resettare il form
    const resetForm = () => {
        setCurrentNote({ title: '', chapter: '', content: '' });
        setIsEditing(false);
        setNoteId(null);
    };

    return (
        <>
            <h3 className='title-font text-center'>Notes archive</h3>
            <ListGroup>
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <ListGroup.Item key={note._id}
                            onClick={() => setSelectedNote(note)}
                            className="note-list mb-3 d-flex justify-content-between align-items-center">
                            <div>
                                <b><span className='title-font'>{note.title}</span></b> - {note.chapter}
                            </div>
                            <div>
                                <Button className="text-d bg-transparent border-0 " onClick={() => handleEditNote(note)}><i className="bi bi-pencil-square"></i></Button>
                                <Button className="text-d bg-transparent border-0  ml-2" onClick={() => handleDeleteNote(note._id)}><i className="bi bi-x-square"></i></Button>
                            </div>
                        </ListGroup.Item>
                    ))
                ) : (
                    <p>There are no notes for this book.</p>
                )}
            </ListGroup>

            <h3 className='title-font text-center'>{isEditing ? 'Edit' : 'Write a new note'}</h3>
            <Form className='mb-3'>
                <Form.Group controlId="formNoteTitle">
                    <Form.Control
                        type="text"
                        className='note-title'
                        placeholder="Title"
                        value={currentNote.title}
                        onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                    />
                </Form.Group>

                <Form.Group controlId="formNoteChapter">
                    <Form.Control
                        type="text"
                        className='note-chapter'
                        placeholder="Chapter name or number"
                        value={currentNote.chapter}
                        onChange={(e) => setCurrentNote({ ...currentNote, chapter: e.target.value })}
                    />
                </Form.Group>

                <Form.Group controlId="formNoteContent">
                    <ReactQuill
                        className="note-content"
                        value={currentNote.content}
                        onChange={handleChange}
                        placeholder="Write your thoughts..."
                    />
                </Form.Group>

                <Button className='accent-bg' onClick={handleCreateNote}>
                    {isEditing ? 'Save' : 'Add'}
                </Button>
                {isEditing && <Button className="accent-bg ml-2" onClick={resetForm}>Cancel</Button>}
            </Form>

            {selectedNote && (
                <div className="note-details mt-5">
                    <h3 className='title-font text-center'>Read selected</h3>
                    <Card>
                        <CardBody>
                            <CardTitle className='title-font'>{selectedNote.title}</CardTitle>
                            <CardSubtitle>{selectedNote.chapter}</CardSubtitle>
                            <ListGroup>
                                <ListGroupItem className='bg-l'>
                                <div dangerouslySetInnerHTML={{ __html: selectedNote.content }} /> {/* Mostra il contenuto HTML */}
                                </ListGroupItem>
                            </ListGroup>
                        </CardBody>
                    </Card>
                </div>
            )}
        </>
    );
};

export default Notes;
