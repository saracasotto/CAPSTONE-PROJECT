import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardBody, CardSubtitle, CardTitle, Form, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import './Notes.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Notes = ({ bookId }) => {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState({ title: '', chapter: '', content: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [noteId, setNoteId] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const [showModal, setShowModal] = useState(false);


    const API_URL = process.env.REACT_APP_API_URL;

    const fetchNotes = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/notes/${bookId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Errore nel recupero delle note');
            }

            const data = await response.json();
            setNotes(data);
        } catch (error) {
            console.error(error);
        }
    }, [API_URL, bookId]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const openModal = () => {
        setCurrentNote({ title: '', chapter: '', content: '' });
        setIsEditing(false);
        setNoteId(null);
        setShowModal(true);
    };

    const handleCreateNote = async () => {
        const token = localStorage.getItem('token');
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing
            ? `${API_URL}/api/notes/${noteId}`
            : `${API_URL}/api/notes/${bookId}/addnote`;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(currentNote),
            });

            if (!response.ok) {
                throw new Error('Errore nel salvataggio della nota');
            }

            await fetchNotes();
            resetForm();
            setShowModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteNote = async (id, event) => {
        event.stopPropagation();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/notes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Errore nella cancellazione della nota');
            }

            await fetchNotes();

            if (selectedNote && selectedNote._id === id) {
                setSelectedNote(null);
            }
            
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditNote = (note, event) => {
        event.stopPropagation();
        setCurrentNote({
            title: note.title,
            chapter: note.chapter,
            content: note.content,
        });
        setNoteId(note._id);
        setIsEditing(true);
        setShowModal(true);
    };

    const resetForm = () => {
        setCurrentNote({ title: '', chapter: '', content: '' });
        setIsEditing(false);
        setNoteId(null);
    };

    return (
        <>
            <ListGroup className='mb-3'>
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <ListGroup.Item key={note._id}
                            onClick={() => setSelectedNote(note)}
                            className="note-list d-flex justify-content-between align-items-center accent-border">
                            <div>
                                <b><span>{note.title}</span></b> - {note.chapter}
                            </div>
                            <div>
                                <Button className="text-d bg-transparent border-0 px-3" onClick={(e) => handleEditNote(note, e)}><i className="bi bi-pencil-square"></i></Button>
                                <Button className="text-d bg-transparent border-0 px-1 ml-2" onClick={(e) => handleDeleteNote(note._id, e)}><i className="bi bi-x-square"></i></Button>
                            </div>
                        </ListGroup.Item>
                    ))
                ) : (
                    <p>There are no notes for this book.</p>
                )}
            </ListGroup>

            <Button className='accent-bg' onClick={openModal}>
            Add
            </Button>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header 
                closeButton
                className='bg-l'>
                    <Modal.Title>{isEditing ? 'Edit Note' : 'Add New Note'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                                onChange={(content) => setCurrentNote({ ...currentNote, content })}
                                placeholder="Write your thoughts..."
                            />
                        </Form.Group>

                        <Button className='accent-bg me-2' onClick={handleCreateNote}>
                            {isEditing ? 'Save' : 'Add'}
                        </Button>
                        {isEditing && <Button className="bg-d border-0 ml-2" onClick={resetForm}>Cancel</Button>}
                    </Form>
                </Modal.Body>
            </Modal>

            {selectedNote && (
                <div className="note-details accent-border mt-5">
                    <Card>
                        <CardBody>
                            <CardTitle>{selectedNote.title}</CardTitle>
                            <CardSubtitle>{selectedNote.chapter}</CardSubtitle>
                            <ListGroup>
                                <ListGroupItem className='bg-l'>
                                    <div dangerouslySetInnerHTML={{ __html: selectedNote.content }} />
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