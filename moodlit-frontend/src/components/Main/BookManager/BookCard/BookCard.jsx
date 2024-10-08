import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col } from 'react-bootstrap';
import "./BookCard.css";

const BookCard = ({ book, isAddCard }) => {
  const navigate = useNavigate();
  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  const handleClick = () => {
    if (isAddCard) {
      navigate("./books/add-book");
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
        console.log('Libro cancellato con successo');
      } else {
        console.error('Errore nella cancellazione del libro');
      }
    } catch (error) {
      console.error('Errore nel fare la richiesta di cancellazione', error);
    }
  };

  return (
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
                  className='bg-l border-0 me-2'
                  onClick={handleDeleteClick}
                >
                  <i className="bi bi-x-square"></i>
                </Button>
                <Button
                  className='bg-l border-0'
                  onClick={handleEditClick}
                >
                  <i className="bi bi-pencil-square"></i>
                </Button>
              </div>
            )}
            <div className="position-absolute bottom-0 start-0 w-100 p-2 text-white book-info">
              <Card.Title>{isAddCard ? "Add a new Book" : book.title}</Card.Title>
              {!isAddCard && <Card.Subtitle>{book.author}</Card.Subtitle>}
            </div>
          </div>
        </Col>
        <Col xs={8} md={12} className="d-md-none">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <Card.Title>{isAddCard ? "Add a new Book" : book.title}</Card.Title>
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
                    className='bg-l border-0'
                    onClick={handleEditClick}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Button>
                </div>
              )}
            </div>
            {!isAddCard && <Card.Text>{book.description}</Card.Text>}
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default BookCard;