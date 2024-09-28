import React, { useEffect, useState } from 'react';
import { Col, Row, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BookCard from '../BookCard.jsx/BookCard';
import './BookList.css';
import AddBook from '../../../../assets/add-book.png'

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
  }, [API_HOST, API_PORT]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Row className="book-list mt-5">
        
        <Col xs={12} md={3} className="mb-4">
          <Card
            className="book-card cursor-pointer glass-bg"
            onClick={() => navigate('./books/add-book')}
          >
            <div className="card-img-container">
              <Card.Img 
              src={AddBook}
              variant='top'
              className='card-img add-image'
              alt='add-image' />
            </div>
            <Card.Body>
              <Card.Title>Add New Book</Card.Title>
            </Card.Body>
          </Card>
        </Col>

        {books.length > 0 ? (
          books.map((book) => (
            <Col key={book._id} xs={12} md={3} className="mb-4">
              <BookCard
                book={book}
                onClick={() => navigate(`./books/${book._id}`)}
              />
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
