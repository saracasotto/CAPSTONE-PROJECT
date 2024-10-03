import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import BookCard from '../BookCard.jsx/BookCard';
import './BookReading.css'
import Notes from '../Notes/Notes';
import Quotes from '../Quotes/Quotes';

const BookItem = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  useEffect(() => {
    const fetchBook = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_HOST}:${API_PORT}/api/books/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error('Errore nel recupero del libro');
        }

        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, API_HOST, API_PORT]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <Container className="book-item mt-5">
      <Row>

        <Col xs={12} className='left-side mb-3'>
          <BookCard book={book} />
        </Col>


        <Col xs={12} className='right-side'>
          <Row>
            <Col xs={12} className="mb-3">
              <Button className='accent-bg start-button mb-3'>Start session</Button>
              <Card className='notes-container glass-bg'>
                <Card.Body>
                    <Notes bookId={id} />
             </Card.Body>
              </Card>
            </Col>
            <Col xs={12}>
              <Card className='quotes-container glass-bg'>
                <Card.Body>
                  <Card.Title>
                    <Quotes bookId={id} />
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default BookItem;
