import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "./CategoryList.css"
import MiniBookCard from './MiniBookCard';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  useEffect(() => {
    const fetchCategoriesWithBooks = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication failed. Please log in.');
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
          throw new Error('Error fetching categories');
        }

        const categoriesData = await response.json();

        // Fetch books for each category
        const categoriesWithBooks = await Promise.all(
          categoriesData.map(async (category) => {
            const booksResponse = await fetch(`${API_HOST}:${API_PORT}/api/categories/${category._id}/books`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });

            if (booksResponse.ok) {
              const books = await booksResponse.json();
              return { ...category, books };
            } else {
              console.error(`Failed to fetch books for category: ${category.name}`);
              return { ...category, books: [] };
            }
          })
        );

        setCategories(categoriesWithBooks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithBooks();
  }, [API_HOST, API_PORT]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container fluid className="library-container mt-5 glass-bg">
     {categories.length > 0 ? (
        <div className="shelves-container">
          {categories.map((category) => (
            <div key={category._id} className="shelf">
              <h3 className="shelf-title mx-3">{category.name}</h3>
              <div className="shelf-board mx-3">
                <Row className="flex-nowrap overflow-auto pb-0 h-100">
                  {category.books && category.books.length > 0 ? (
                    category.books.map((book) => (
                      <Col key={book._id} xs="auto">
                        <MiniBookCard 
                          book={book} 
                          onClick={() => navigate(`/dashboard/books/${book._id}`)}
                        />
                      </Col>
                    ))
                  ) : (
                    <Col><p className="empty-shelf-message">No books in this category</p></Col>
                  )}
                </Row>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No categories available. Please add one!</p>
      )}
    </Container>
  );
};

export default CategoryList;