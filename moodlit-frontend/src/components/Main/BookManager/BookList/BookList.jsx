import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import './BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${API_HOST}:${API_PORT}/api/books/getWithoutAuth`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Errore nel recupero dei dati');
        }

        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [API_HOST, API_PORT]); // Aggiungi API_HOST e API_PORT come dipendenze

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {books.length > 0 ? (
        <Row className="book-list mt-5">
          {books.map((book) => (
            <Col key={book._id} xs={12} md={4} xl={2} className="mb-4">
              <Card>
                <div className="card-img-container">
                  <Card.Img
                    variant="top"
                    src={book.cover || '/path/to/default/image.jpg'}
                    alt={book.title}
                    className="card-img"
                  />
                </div>
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Text>{book.author}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No books available. Please add one!</p>
      )}
      </>
  );
};

export default BookList;
