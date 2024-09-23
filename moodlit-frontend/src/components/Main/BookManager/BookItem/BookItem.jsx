import { Container } from "react-bootstrap";

const BookItem = ({ book }) => {
    return (
      <Container className="book-item" onClick={() => handleBookClick(book._id)}>
        <img src={book.cover} alt={book.title} />
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <p>{book.status}</p>
      </Container>
    );
  };

export default BookItem; 