import React, { useEffect, useState } from 'react';
import { Col, Row, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BookCard from '../BookCard.jsx/BookCard';
import './BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem('token'); // Recupera il token JWT dal localStorage

      if (!token) {
        setError('Autenticazione fallita. Per favore, accedi.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_HOST}:${API_PORT}/api/books/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Aggiungi il token nell'intestazione Authorization
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
  }, [API_HOST, API_PORT]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Row className="book-list mt-5">
        <Col xs={12} md={4} lg={3} xl={2} className="mb-4">
          <Card className="book-card glass-bg add-card">
            <div className="card-img-container position-relative">
              <div
                onClick={() => navigate(`./books/add-book`)}
                className="card-img card-img-top 
                add-image text-d d-flex 
                justify-content-center 
                align-items-center"
                alt="add-image"
              >
                <i class="bi bi-plus-circle"></i>
              </div>
              <div className="overlay"></div>
            </div>
            <Card.Body>
              <Card.Title className="text-center">Add a new Book</Card.Title>
            </Card.Body>
          </Card>
        </Col>

        {books.length > 0 ? (
          books.map((book) => (
            <Col key={book._id} xs={12} md={4} lg={3} xl={2} className="mb-4">
              <BookCard book={book} />
            </Col>
          ))
        ) : (
          <p>No books available. Please add one!</p>
        )}
      </Row>
    </>
  );
};

export default BookList;
