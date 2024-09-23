import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Definisci la URL dell'API utilizzando le variabili d'ambiente
  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;
  const API_URL = `${API_HOST}:${API_PORT}/api/books`;

 
  const fetchBooks = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        throw new Error('Errore');
      }

      const data = await response.json();
      setBooks(data); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(); //CHIAMO AL CARICAMENTO
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container className="book-list">
      {books.length > 0 ? (
        books.map(book => (
          <div key={book._id}>
            <img src={book.cover} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.author}</p>
          </div>
        ))
      ) : (
        <p>No books available. Please add one!</p>
      )}
    </Container>
  );
};

export default BookList;
