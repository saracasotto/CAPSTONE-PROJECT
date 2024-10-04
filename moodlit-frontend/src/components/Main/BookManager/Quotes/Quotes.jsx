import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardBody, CardSubtitle, Form, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../Notes/Notes.css';
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share';

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

            fetchQuotes();
            resetForm();
            setShowModal(false);
        } catch (error) {
            console.error(error);
        }
    };

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

            if (selectedQuote && selectedQuote._id === quoteId) {
                setSelectedQuote(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditQuote = (quote) => {
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

    const handleShareClick = (platform, quote) => {
        setCurrentQuote({ ...quote, shared: true, sharePlatform: platform });
    };

    const stripHtmlTags = (html) => {
        return html.replace(/<\/?[^>]+(>|$)/g, ""); // Rimuove tutti i tag HTML
    };



    return (
        <>
            <h3 className='title-font'>Your quotes</h3>
            <ListGroup>
                {quotes.length > 0 ? (
                    quotes.map((quote) => (
                        <ListGroup.Item key={quote._id}
                            onClick={() => setSelectedQuote(quote)}
                            className="quote-list mb-3 d-flex justify-content-between align-items-center">
                            <div>
                                <span className='title-font' dangerouslySetInnerHTML={{ __html: quote.content }}></span>
                            </div>
                            <div className="d-flex align-items-center">
                                {/* Pulsanti di condivisione con il contenuto della quote e riferimento a MoodLit */}
                                <FacebookShareButton
                                    url={"http://saracasotto.com"}
                                    quote={`${stripHtmlTags(quote.content)} - Shared via MoodLit App`}
                                    className="mr-2"
                                    onClick={() => handleShareClick('facebook', quote)}  // Imposta Facebook come piattaforma di condivisione

                                >
                                    <FacebookIcon size={32} round={true} />
                                </FacebookShareButton>

                                <TwitterShareButton
                                    url={"http://saracasotto.com"}
                                    title={`${stripHtmlTags(quote.content)} - Shared via MoodLit App`}
                                    className="mr-2"
                                    onClick={() => handleShareClick('twitter', quote)}  // Imposta Facebook come piattaforma di condivisione

                                >
                                    <TwitterIcon size={32} round={true} />
                                </TwitterShareButton>
                                {/* Pulsanti di edit e delete */}
                                <Button className="text-d bg-transparent border-0" onClick={() => handleEditQuote(quote)}>
                                    <i className="bi bi-pencil-square"></i>
                                </Button>
                                <Button className="text-d bg-transparent border-0 ml-2" onClick={() => handleDeleteQuote(quote._id)}>
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
                <i className="bi bi-plus-circle"></i>
            </Button>

            {/* Modal per l'aggiunta o modifica delle citazioni */}
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

                        <Button className='accent-bg' onClick={handleCreateQuote}>
                            {isEditing ? 'Save' : 'Add'}
                        </Button>
                        {isEditing && <Button className="accent-bg ml-2" onClick={resetForm}>Cancel</Button>}
                    </Form>
                </Modal.Body>
            </Modal>

            {selectedQuote && (
                <div className="quote-details mt-5">
                    <h3 className='title-font text-center'>Read selected quote</h3>
                    <Card>
                        <CardBody>
                            {selectedQuote.shared && <CardSubtitle>Shared on: {selectedQuote.sharePlatform}</CardSubtitle>}
                            <ListGroup>
                                <ListGroupItem className='bg-l'>
                                    <div dangerouslySetInnerHTML={{ __html: selectedQuote.content }} />
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
