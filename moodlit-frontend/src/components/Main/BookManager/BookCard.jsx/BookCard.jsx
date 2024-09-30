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
    navigate(`./books/${book._id}`);
  };

  // Funzione per modificare il libro (naviga alla pagina di BookDetails per l'update)
  const handleEditClick = (event) => {
    event.stopPropagation(); // Impedisce la propagazione del click alla card
    navigate(`./books/${book._id}/details`); // Naviga a BookDetails per l'update
  };

  // Funzione per cancellare il libro
  const handleDeleteClick = async (event) => {
    event.stopPropagation(); // Impedisce la propagazione del click alla card
    try {
      // Effettua la chiamata API per cancellare il libro
      const response = await fetch(`${API_HOST}:${API_PORT}/api/books/deleteWithoutAuth/${book._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Libro cancellato con successo');
        //AGGIUNGERE QUI LOGICA MODIFICA UI CON MODALE
      } else {
        console.error('Errore nella cancellazione del libro');
      }
    } catch (error) {
      console.error('Errore nel fare la richiesta di cancellazione', error);
    }
  };

  return (
    <Card className="book-card glass-bg">
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
        <Card.Text className='mb-1'>{book.author}</Card.Text>
        <Card.Text className='mt-0 p-0'>
          <Button 
            className='text-main bg-transparent border-0 float-md-end'
            onClick={handleDeleteClick} // Logica per cancellare il libro
          >
            <i className="bi bi-x-square"></i>
          </Button>
          <Button 
            className='text-main bg-transparent border-0 float-md-end'
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
