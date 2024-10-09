import React, { useEffect, useState, useCallback } from 'react';
import { Col, Row, Alert } from 'react-bootstrap';
import BookCard from '../BookCard/BookCard';
import './BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  const fetchBooks = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Authentication failed. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_HOST}:${API_PORT}/api/books/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error retrieving data');
      }

      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_HOST, API_PORT]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleDeleteSuccess = (deletedBookId) => {
    setBooks(prevBooks => prevBooks.filter(book => book._id !== deletedBookId));
    setAlertMessage('Book successfully deleted!');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {showAlert && (
        <Alert className='accent-bg p-3 my-2' onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
      )}
      <Row className="book-list mt-5">
        <Col xs={12} md={4} lg={3} xl={2} className="mb-4">
          <BookCard isAddCard={true} />
        </Col>

        {books.length > 0 ? (
          books.map((book) => (
            <Col key={book._id} xs={12} md={4} lg={3} xl={2} className="mb-4">
              <BookCard book={book} onDeleteSuccess={handleDeleteSuccess} />
            </Col>
          ))
        ) : (
          <Col>
            <p>No books available. Please add one!</p>
          </Col>
        )}
      </Row>
    </>
  );
};

export default BookList;