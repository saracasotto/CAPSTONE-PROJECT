import React from 'react';
import { Card } from 'react-bootstrap';

const BookCard = ({ book, onClick }) => {
  return (
    <Card onClick={onClick} className="book-card cursor-pointer glass-bg">
      <div className="card-img-container">
        <Card.Img
          variant="top"
          src={book.cover}
          alt={book.title}
          className="card-img"
        />
      </div>
      <Card.Body>
        <Card.Title>{book.title}</Card.Title>
        <Card.Text>{book.author}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default BookCard;
