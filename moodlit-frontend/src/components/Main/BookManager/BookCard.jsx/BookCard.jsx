import React from 'react';
import { Card } from 'react-bootstrap';

const BookCard = ({ book, onClick }) => {
  return (
    <Card onClick={onClick} className="cursor-pointer">
      <div className="card-img-container">
        <Card.Img
          variant="top"
          src={book.cover || '/path/to/default/image.jpg'}
          alt={book.title}
          className="card-img"
        />
      </div>
      <Card.Body>
        <Card.Title>{book.title}</Card.Title>
        <Card.Text>{book.author}</Card.Text>
        {book.description && <Card.Text>{book.description}</Card.Text>}
      </Card.Body>
    </Card>
  );
};

export default BookCard;
