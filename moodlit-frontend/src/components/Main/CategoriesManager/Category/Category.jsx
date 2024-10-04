import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import BookCard from '../../BookManager/BookCard.jsx/BookCard';

const Category = () => {
  const { id } = useParams(); // Recupera l'id della categoria dalla URL
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true); // Imposta lo stato di caricamento
  const [error, setError] = useState(null);

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  useEffect(() => {
    const fetchCategory = async () => {
      const token = localStorage.getItem('token'); // Recupera il token JWT dal localStorage

      if (!token) {
        setError('Autenticazione fallita. Per favore, accedi.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_HOST}:${API_PORT}/api/categories/${id}/books`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Errore nel recupero della categoria');
        }

        const data = await response.json();
        console.log("Dati categoria:", data);  // Verifica i dati ricevuti
        setCategory(data);  // Imposta i dati della categoria
        setLoading(false);  // Imposta loading a false dopo il caricamento
      } catch (err) {
        setError(err.message);
        setLoading(false);  // Imposta loading a false anche in caso di errore
      }
    };

    fetchCategory();
  }, [API_HOST, API_PORT, id]);

  // Mostra il messaggio di caricamento fino a quando i dati non sono pronti
  if (loading) return <p>Loading...</p>;

  // Mostra l'errore se c'è
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-center mb-4">{category?.name}</h2>
      <Row className="book-list mt-5">
        {category?.length > 0 ? (
          category.map((book) => (
            <Col key={book._id} xs={12} md={4} lg={3} xl={2} className="mb-4">
              {console.log("Libro passato a BookCard:", book)}  {/* Debug per vedere i dati */}
              <BookCard book={book} />  {/* Passa il libro a BookCard */}
            </Col>
          ))
        ) : (
          <p>No books in this category. Please add one!</p>
        )}
      </Row>
    </div>
  );
};

export default Category;
