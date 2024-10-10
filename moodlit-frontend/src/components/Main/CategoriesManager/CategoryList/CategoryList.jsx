import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
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

  const fetchCategoriesWithBooks = useCallback(async () => {
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
  }, [API_HOST, API_PORT]);

  useEffect(() => {
    fetchCategoriesWithBooks();
  }, [fetchCategoriesWithBooks]);

  const handleDeleteCategory = async (categoryId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Authentication failed. Please log in.');
      return;
    }

    try {
      const response = await fetch(`${API_HOST}:${API_PORT}/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error deleting category');
      }

      // Remove the deleted category from the state
      setCategories(categories.filter(category => category._id !== categoryId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container fluid className="library-container mt-5">
      <h3 className='title-font mt-0 mb-4 p-0 text-center'>Your Library</h3>
      {categories.length > 0 ? (
        <div className="shelves-container">
          {categories.map((category) => (
            <div key={category._id} className="shelf">
              <div className="shelf-header">
                <h4 className="shelf-title mx-3">{category.name}</h4>
                <Button 
                  size="sm" 
                  onClick={() => handleDeleteCategory(category._id)}
                  className="delete-shelf-btn bg-transparent text-d border-0 my-1"
                >
                  Delete Shelf
                </Button>
              </div>
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
                    <Col><p className="empty-shelf-message">No books in this shelf</p></Col>
                  )}
                </Row>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No shelves available. Please add one!</p>
      )}
    </Container>
  );
};

export default CategoryList;