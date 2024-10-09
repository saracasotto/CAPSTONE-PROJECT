import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Alert } from 'react-bootstrap';
import "./BookCard.css";

const BookCard = ({ book, isAddCard, onDeleteSuccess }) => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  const handleClick = () => {
    if (isAddCard) {
      navigate("/dashboard/books/add-book");
    } else {
      navigate(`/dashboard/books/${book._id}`);
    }
  };

  const handleEditClick = (event) => {
    event.stopPropagation();
    navigate(`/dashboard/books/${book._id}/details`);
  };

  const handleDeleteClick = async (event) => {
    event.stopPropagation();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_HOST}:${API_PORT}/api/books/${book._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setAlertVariant('success');
        setAlertMessage('Book successfully deleted!');
        setShowAlert(true);
        if (onDeleteSuccess) onDeleteSuccess(book._id);
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      } else {
        throw new Error('Error deleting the book');
      }
    } catch (error) {
      setAlertVariant('danger');
      setAlertMessage('An error occurred while deleting the book. Please try again.');
      setShowAlert(true);
    }
  };

  return (
    <>
      {showAlert && (
        <Alert 
          variant={alertVariant} 
          onClose={() => setShowAlert(false)} 
          dismissible
          className="position-fixed top-0 start-50 translate-middle-x mt-3 z-index-1050"
        >
          {alertMessage}
        </Alert>
      )}
      
      <Card className={`book-card text-d glass-bg ${isAddCard ? 'add-card' : ''}`} onClick={handleClick}>
        <Row className="g-0 h-100">
          <Col xs={4} md={12} className="book-image-container">
            {isAddCard ? (
              <div className="card-img add-image text-d d-flex justify-content-center align-items-center h-100">
                <i className="bi bi-plus-circle"></i>
              </div>
            ) : (
              <Card.Img
                src={book.cover}
                alt={book.title}
                className="card-img w-100 h-100 object-fit-cover"
              />
            )}
            <div className="book-overlay d-none d-md-flex">
              {!isAddCard && (
                <div className="position-absolute top-0 end-0 m-2">
                  <Button
                    className='border-0 me-2'
                    onClick={handleDeleteClick}
                  >
                    <i className="bi bi-x-square"></i>
                  </Button>
                  <Button
                    className='border-0'
                    onClick={handleEditClick}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Button>
                </div>
              )}
              <div className="position-absolute bottom-0 start-0 w-100 p-2 text-white book-info">
                <Card.Title>{isAddCard ? "Add a new book" : book.title}</Card.Title>
                {!isAddCard && <Card.Subtitle>{book.author}</Card.Subtitle>}
              </div>
            </div>
          </Col>
          <Col xs={8} md={12} className="d-md-none">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className='pe-2 p-md-0'>
                  <Card.Title>{isAddCard ? "Add a new book" : book.title}</Card.Title>
                  {!isAddCard && <Card.Subtitle>{book.author}</Card.Subtitle>}
                </div>
                {!isAddCard && (
                  <div className='btn-wrapper'>
                    <Button
                      className='bg-l border-0 px-0 me-2'
                      onClick={handleDeleteClick}
                    >
                      <i className="bi bi-x-square"></i>
                    </Button>
                    <Button
                      className='border-0'
                      onClick={handleEditClick}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                  </div>
                )}
              </div>
              {!isAddCard && <Card.Text className='book-description'>{book.description}</Card.Text>}
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default BookCard;