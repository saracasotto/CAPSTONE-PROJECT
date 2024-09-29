import React from 'react';
import { Button, Card } from 'react-bootstrap';
import "./BookCard.css"
const BookCard = ({ book, onClick }) => {
  return (
    <Card onClick={onClick} className="book-card glass-bg">
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
        <Card.Text className='mb-1'>{book.author}</Card.Text>
        <Card.Text className='mt-0 p-0'>
          <Button className='text-main bg-transparent border-0 float-md-end'><i class="bi bi-x-square"></i></Button>
          <Button className='text-main bg-transparent border-0 float-md-end'><i class="bi bi-pencil-square"></i></Button>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default BookCard;
