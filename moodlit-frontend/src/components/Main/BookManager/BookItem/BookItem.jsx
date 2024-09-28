import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import BookCard from '../BookCard.jsx/BookCard';
import './BookItem.css'
import Notes from '../Notes/Notes';

const BookItem = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`${API_HOST}:${API_PORT}/api/books/getWithoutAuth/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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
        
        <Col xs={12} md={3} className='left-side mb-3'>
          <BookCard book={book} />
          <Button className='accent-bg start-button mt-3'>Start session</Button>
        </Col>


        <Col xs={12} md={9} className='right-side'>
          <Row>
            <Col xs={12} className="mb-3">
              <Card className='notes-container glass-bg'>
                <Card.Body>
                  <Notes />
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12}>
              <Card className='quotes-container glass-bg'>
                <Card.Body>
                  <Card.Title>
                    QUI CI VADO A METTERE LE CITAZIONI
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
