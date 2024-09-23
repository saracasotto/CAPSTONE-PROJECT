import { Container } from "react-bootstrap";

const BookList = ({ books }) => {
    return (
      <Container className="book-list">
        {books.length > 0 ? (
          books.map(book => (
            <BookItem key={book._id} book={book} />
          ))
        ) : (
          <p>No books available. Please add one!</p>
        )}
      </Container>
    );
  };

export default BookList; 