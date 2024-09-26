import React, { useState, useEffect } from 'react';
import { Button, Form, ListGroup} from 'react-bootstrap';
import './Notes.css'

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState({ title: '', chapter: '', content: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [noteId, setNoteId] = useState(null);

    // Funzione per recuperare tutte le note
    const fetchNotes = async () => {
        const response = await fetch('/api/notes/allnotes'); // End-point per tutte le note
        const data = await response.json();
        setNotes(data);
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    // Funzione per creare una nuova nota
    const handleCreateNote = async () => {
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `/api/notes/${noteId}` : '/api/notes';
        await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentNote),
        });
        fetchNotes();
        resetForm();
    };

    // Funzione per cancellare una nota
    const handleDeleteNote = async (id) => {
        await fetch(`/api/notes/${id}`, { method: 'DELETE' });
        fetchNotes();
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

    // Funzione per resettare il form
    const resetForm = () => {
        setCurrentNote({ title: '', chapter: '', content: '' });
        setIsEditing(false);
        setNoteId(null);
    };

    return (
        <>
            <h2>Notes</h2>
            <ListGroup>
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <ListGroup.Item key={note._id} className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{note.title}</strong> - Chapter {note.chapter}
                            </div>
                            <div>
                                <Button variant="warning" size="sm" onClick={() => handleEditNote(note)}>Edit</Button>
                                <Button variant="danger" size="sm" className="ml-2" onClick={() => handleDeleteNote(note._id)}>Delete</Button>
                            </div>
                        </ListGroup.Item>
                    ))
                ) : (
                    <p>There are no notes for this book.</p>
                )}
            </ListGroup>
            <h2>{isEditing ? 'Edit' : 'New'}</h2>
            <Form>
                <Form.Group controlId="formNoteTitle">
                    <Form.Control
                        type="text"
                        placeholder="Title"
                        value={currentNote.title}
                        onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                    />
                </Form.Group>

                <Form.Group controlId="formNoteChapter">
                    <Form.Control
                        type="text"
                        placeholder="Chapter name or number"
                        value={currentNote.chapter}
                        onChange={(e) => setCurrentNote({ ...currentNote, chapter: e.target.value })}
                    />
                </Form.Group>

                <Form.Group controlId="formNoteContent">
                    <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Write your thoughts"
                        value={currentNote.content}
                        onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                    />
                </Form.Group>

                <Button variant="primary" onClick={handleCreateNote}>
                    {isEditing ? 'Save' : 'Add'}
                </Button>
                {isEditing && <Button variant="secondary" className="ml-2" onClick={resetForm}>Cancel</Button>}
            </Form>
        </>
    );
};

export default Notes;
