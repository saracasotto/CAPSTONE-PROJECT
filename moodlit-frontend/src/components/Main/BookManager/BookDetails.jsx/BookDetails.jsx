import { Col, Container, Row } from "react-bootstrap";
import Notes from '../Notes/Notes';
import Quotes from '../Quotes/Quotes';

const BookDetails = ({ book }) => {
    return (
        <Container className="book-details d-block d-md-flex">
            <Row>
                <Col lg={6}>
                    <div className="left-panel">
                        <img src={book.cover} alt={book.title} />
                        <h3>{book.title}</h3>
                        <Timer bookId={book._id} />
                    </div></Col>

                <Col lg={6}>
                <div className="right-panel">
                    <Notes bookId={book._id} />
                    <Quotes bookId={book._id} />
                </div>
                </Col>
            </Row>
        </Container>
    );
};

export default BookDetails;