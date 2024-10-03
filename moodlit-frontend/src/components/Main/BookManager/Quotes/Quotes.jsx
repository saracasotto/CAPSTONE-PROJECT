import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardBody, CardSubtitle, CardTitle, Form, ListGroup, ListGroupItem } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Quotes = ({ bookId }) => {
    const [quotes, setQuotes] = useState([]);
    const [currentQuote, setCurrentQuote] = useState({ content: '', shared: false, sharePlatform: 'other' });
    const [isEditing, setIsEditing] = useState(false);
    const [quoteId, setQuoteId] = useState(null);
    const [selectedQuote, setSelectedQuote] = useState(null);

    const API_HOST = process.env.REACT_APP_API_HOST;
    const API_PORT = process.env.REACT_APP_API_PORT;

    // Funzione per recuperare le citazioni relative al libro specificato da bookId
    const fetchQuotes = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_HOST}:${API_PORT}/api/quotes/${bookId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Errore nel recupero delle citazioni');
            }

            const data = await response.json();
            setQuotes(data);
        } catch (error) {
            console.error(error);
        }
    }, [API_HOST, API_PORT, bookId]);

    // useEffect per chiamare fetchQuotes al montaggio del componente
    useEffect(() => {
        fetchQuotes();
    }, [fetchQuotes]);

    // Funzione per creare o modificare una citazione
    const handleCreateQuote = async () => {
        const token = localStorage.getItem('token');
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing
            ? `${API_HOST}:${API_PORT}/api/quotes/${quoteId}`
            : `${API_HOST}:${API_PORT}/api/quotes/${bookId}/addquote`;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(currentQuote),
            });

            if (!response.ok) {
                throw new Error('Errore nel salvataggio della citazione');
            }

            fetchQuotes();
            resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    // Funzione per cancellare una citazione
    const handleDeleteQuote = async (quoteId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_HOST}:${API_PORT}/api/quotes/${quoteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Errore nella cancellazione della citazione');
            }

            fetchQuotes();
        } catch (error) {
            console.error(error);
        }
    };

    // Funzione per caricare una citazione nel form per la modifica
    const handleEditQuote = (quote) => {
        setCurrentQuote({
            content: quote.content,
            shared: quote.shared,
            sharePlatform: quote.sharePlatform || 'other',
        });
        setQuoteId(quote._id);
        setIsEditing(true);
    };

    // Funzione per resettare il form
    const resetForm = () => {
        setCurrentQuote({ content: '', shared: false, sharePlatform: 'other' });
        setIsEditing(false);
        setQuoteId(null);
    };

    return (
        <>
            <h3 className='title-font text-center'>Quotes archive</h3>
            <ListGroup>
                {quotes.length > 0 ? (
                    quotes.map((quote) => (
                        <ListGroup.Item key={quote._id}
                            onClick={() => setSelectedQuote(quote)}
                            className="quote-list mb-3 d-flex justify-content-between align-items-center">
                            <div>
                                <b><span className='title-font'>{quote.content}</span></b>
                            </div>
                            <div>
                                <Button className="text-d bg-transparent border-0" onClick={() => handleEditQuote(quote)}><i className="bi bi-pencil-square"></i></Button>
                                <Button className="text-d bg-transparent border-0 ml-2" onClick={() => handleDeleteQuote(quote._id)}><i className="bi bi-x-square"></i></Button>
                            </div>
                        </ListGroup.Item>
                    ))
                ) : (
                    <p>There are no quotes for this book.</p>
                )}
            </ListGroup>

            <h3 className='title-font text-center'>{isEditing ? 'Edit' : 'Write a new quote'}</h3>
            <Form className='mb-3'>
                <Form.Group controlId="formQuoteContent">
                    <ReactQuill
                        className="quote-content"
                        value={currentQuote.content}
                        onChange={(content) => setCurrentQuote({ ...currentQuote, content })}
                        placeholder="Write your quote..."
                    />
                </Form.Group>

                <Form.Group controlId="formQuoteShared">
                    <Form.Check
                        type="checkbox"
                        label="Share this quote"
                        checked={currentQuote.shared}
                        onChange={(e) => setCurrentQuote({ ...currentQuote, shared: e.target.checked })}
                    />
                </Form.Group>

                {currentQuote.shared && (
                    <Form.Group controlId="formSharePlatform">
                        <Form.Label>Select platform</Form.Label>
                        <Form.Control
                            as="select"
                            value={currentQuote.sharePlatform}
                            onChange={(e) => setCurrentQuote({ ...currentQuote, sharePlatform: e.target.value })}
                        >
                            <option value="facebook">Facebook</option>
                            <option value="twitter">Twitter</option>
                            <option value="instagram">Instagram</option>
                            <option value="other">Other</option>
                        </Form.Control>
                    </Form.Group>
                )}

                <Button className='accent-bg' onClick={handleCreateQuote}>
                    {isEditing ? 'Save' : 'Add'}
                </Button>
                {isEditing && <Button className="accent-bg ml-2" onClick={resetForm}>Cancel</Button>}
            </Form>

            {selectedQuote && (
                <div className="quote-details mt-5">
                    <h3 className='title-font text-center'>Read selected quote</h3>
                    <Card>
                        <CardBody>
                            <CardTitle className='title-font'>{selectedQuote.content}</CardTitle>
                            {selectedQuote.shared && <CardSubtitle>Shared on: {selectedQuote.sharePlatform}</CardSubtitle>}
                            <ListGroup>
                                <ListGroupItem className='bg-l'>
                                    <div dangerouslySetInnerHTML={{ __html: selectedQuote.content }} /> {/* Mostra il contenuto HTML */}
                                </ListGroupItem>
                            </ListGroup>
                        </CardBody>
                    </Card>
                </div>
            )}
        </>
    );
};

export default Quotes;
