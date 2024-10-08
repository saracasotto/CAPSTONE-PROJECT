import React, { useEffect, useState } from 'react';
import { Col, Row, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Autenticazione fallita. Per favore, accedi.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_HOST}:${API_PORT}/api/categories/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Errore nel recupero delle categorie');
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [API_HOST, API_PORT]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <Row className="category-list mt-5">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Col key={category._id} xs={12} md={4} lg={3} xl={2} className="mb-4">
              <Card className="category-card glass-bg text-d" onClick={() => navigate(`./${category._id}`)}>
                <Card.Body>
                  <Card.Title className="text-center m-0">{category.name}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No categories available. Please add one!</p>
        )}
      </Row>
    </Container>
  );
};

export default CategoryList;
