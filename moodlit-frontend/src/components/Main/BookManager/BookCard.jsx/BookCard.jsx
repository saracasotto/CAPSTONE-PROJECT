import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import "./BookCard.css"


const BookCard = ({ book }) => {

  const navigate = useNavigate();

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;


  // Funzione per gestire il click sull'immagine (naviga ai dettagli del libro con BookItem)
  const handleImageClick = () => {
    navigate(`/dashboard/books/${book._id}`);
  };

  const handleEditClick = (event) => {
    event.stopPropagation(); 
    navigate(`/dashboard/books/${book._id}/details`);
  };

  // Funzione per cancellare il libro
  const handleDeleteClick = async (event) => {
    const token = localStorage.getItem('token');

    event.stopPropagation();
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
    <Card className="book-card text-d glass-bg">
      <div className="card-img-container">
        <Card.Img
          variant="top"
          src={book.cover}
          alt={book.title}
          className="card-img"
          onClick={handleImageClick} 
        />
      </div>
      <Card.Body>
        <Card.Title>{book.title}</Card.Title>
        <Card.Subtitle className='mb-1'>{book.author}</Card.Subtitle>
        <Card.Text className='mb-1 mt-4 book-description'>{book.description}</Card.Text>
        <Card.Text className='mt-0 p-0'>
          <Button 
            className='text-d bg-transparent border-0 float-md-end px-0'
            onClick={handleDeleteClick} // Logica per cancellare il libro
          >
            <i className="bi bi-x-square"></i>
          </Button>
          <Button 
            className='text-d bg-transparent border-0 float-md-end'
            onClick={handleEditClick} // Naviga a BookDetails per l'update
          >
            <i className="bi bi-pencil-square"></i>
          </Button>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};



export default BookCard;
