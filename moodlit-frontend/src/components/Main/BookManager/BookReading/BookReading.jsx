import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Nav, Tab, ProgressBar } from 'react-bootstrap';
import Notes from '../Notes/Notes';
import Quotes from '../Quotes/Quotes';
import Timer from '../../../Timer/Timer';
import './BookReading.css';
import BookCard from '../BookCard/BookCard';

const BookReading = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const API_HOST = process.env.REACT_APP_API_HOST;
    const API_PORT = process.env.REACT_APP_API_PORT;
  
    const fetchBook = useCallback(async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${API_HOST}:${API_PORT}/api/books/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) throw new Error('Error fetching book');
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, [id, API_HOST, API_PORT]);
  
    useEffect(() => {
      fetchBook();
    }, [fetchBook]);
  
    const handleSessionComplete = () => {
      fetchBook();
    };
  
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      );
    }
    
    if (error) {
      return <div className="alert alert-danger" role="alert">{"Book not found"}</div>;
    }
    
    if (!book) {
      return <div className="alert alert-info" role="alert">Book not found</div>;
    }
  
    const percentageCompleted = book.totalPages ? Math.min((book.progress / book.totalPages) * 100, 100) : 0;
    

  return (
    <Container fluid className="book-reading py-4 px-0">
      <Row>
        <Col xs={12} md={4} lg={3} className="mb-4">
          <div className="book-card-container">
            <BookCard book={book} />
          </div>
          <Card className="mt-3 glass-bg timer-card">
            <Card.Body>
              <Timer bookId={id} onSessionComplete={handleSessionComplete} />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={8} lg={9}>
          <Card className="glass-bg mb-3">
            <Card.Body>
              <h5 className="mb-3">Description</h5>
              <p>{book.description || "No description available."}</p>
              <h5 className="mt-4 mb-2">Reading Progress</h5>
              <ProgressBar
                now={percentageCompleted}
                label={`${percentageCompleted.toFixed(1)}%`}
                className="mb-2"
              />
              <small className="text-muted">
                You've read {book.progress} {book.totalPages ? `out of ${book.totalPages}` : ''} pages.
              </small>
            </Card.Body>
          </Card>
          <Card className="glass-bg">
            <Card.Body>
              <Tab.Container defaultActiveKey="notes">
                <Nav variant="tabs" className="mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="notes" className="d-flex align-items-center">
                      <i class="bi bi-journal me-2"></i>
                      Notes
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="quotes" className="d-flex align-items-center">
                      <i class="bi bi-chat-quote me-2"></i>
                      Quotes
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content>
                  <Tab.Pane eventKey="notes">
                    <Notes bookId={id} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="quotes">
                    <Quotes bookId={id} />
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookReading;