import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, ListGroup, Modal, Card, CardBody } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../Notes/Notes.css';
import { TwitterShareButton, TwitterIcon } from 'react-share';

const Quotes = ({ bookId }) => {
    const [quotes, setQuotes] = useState([]);
    const [currentQuote, setCurrentQuote] = useState({ content: '', shared: false, sharePlatform: 'other' });
    const [isEditing, setIsEditing] = useState(false);
    const [quoteId, setQuoteId] = useState(null);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const API_HOST = process.env.REACT_APP_API_HOST;
    const API_PORT = process.env.REACT_APP_API_PORT;

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

    useEffect(() => {
        fetchQuotes();
    }, [fetchQuotes]);

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

            await fetchQuotes();
            resetForm();
            setShowModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteQuote = async (quoteId, event) => {
        event.stopPropagation(); // Previene la selezione della citazione
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

            await fetchQuotes();

            if (selectedQuote && selectedQuote._id === quoteId) {
                setSelectedQuote(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditQuote = (quote, event) => {
        event.stopPropagation(); // Previene la selezione della citazione
        setCurrentQuote({
            content: quote.content,
            shared: quote.shared,
            sharePlatform: quote.sharePlatform || 'other',
        });
        setQuoteId(quote._id);
        setIsEditing(true);
        setShowModal(true);
    };

    const resetForm = () => {
        setCurrentQuote({ content: '', shared: false, sharePlatform: 'other' });
        setIsEditing(false);
        setQuoteId(null);
    };

    const handleShareClick = (platform, quote, event) => {
        event.stopPropagation(); // Previene la selezione della citazione
        setCurrentQuote({ ...quote, shared: true, sharePlatform: platform });
    };

    const stripHtmlTags = (html) => {
        return html.replace(/<\/?[^>]+(>|$)/g, "");
    };

    return (
        <>
                    <ListGroup className='mb-3'>
                {quotes.length > 0 ? (
                    quotes.map((quote) => (
                        <ListGroup.Item key={quote._id}
                            onClick={() => setSelectedQuote(quote)}
                            className="quote-list  d-flex justify-content-between align-items-center accent-border">
                            <div>
                                <span className='title-font' dangerouslySetInnerHTML={{ __html: quote.content }}></span>
                            </div>
                            <div className="d-flex align-items-center">
                                <TwitterShareButton
                                    url={"http://saracasotto.com"}
                                    title={`${stripHtmlTags(quote.content)} - Shared via MoodLit App`}
                                    className="mr-2 px-2"
                                    onClick={(event) => handleShareClick('twitter', quote, event)}
                                >
                                    <TwitterIcon size={32} round={true} />
                                </TwitterShareButton>
                                <Button className="text-d bg-transparent border-0 px-2" onClick={(event) => handleEditQuote(quote, event)}>
                                    <i className="bi bi-pencil-square"></i>
                                </Button>
                                <Button className="text-d bg-transparent border-0 px-1 ml-2" onClick={(event) => handleDeleteQuote(quote._id, event)}>
                                    <i className="bi bi-x-square"></i>
                                </Button>
                            </div>
                        </ListGroup.Item>
                    ))
                ) : (
                    <p>There are no quotes for this book.</p>
                )}
            </ListGroup>

            <Button className='accent-bg' onClick={() => setShowModal(true)}>
                Add
            </Button>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Quote' : 'Add New Quote'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className='mb-3'>
                        <Form.Group controlId="formQuoteContent">
                            <ReactQuill
                                className="quote-content"
                                value={currentQuote.content}
                                onChange={(content) => setCurrentQuote({ ...currentQuote, content })}
                                placeholder="Write your quote..."
                            />
                        </Form.Group>

                        <Button className='accent-bg me-2' onClick={handleCreateQuote}>
                            {isEditing ? 'Save' : 'Add'}
                        </Button>
                        {isEditing && <Button className="bg-d border-0 ml-2" onClick={resetForm}>Cancel</Button>}
                    </Form>
                </Modal.Body>
            </Modal>

            {selectedQuote && (
                <div className="quote-details mt-5">
                    <Card>
                        <CardBody className='bg-l accent-border'>
                            <div dangerouslySetInnerHTML={{ __html: selectedQuote.content }} />
                        </CardBody>
                    </Card>
                </div>
            )}
        </>
    );
};

export default Quotes;