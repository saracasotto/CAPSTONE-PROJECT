import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom'

const BottomNavbar = () => {
  return (
    <>
      <Navbar className="d-md-none fixed-bottom bg-d">
        <Nav className="justify-content-around w-100">
          <Nav.Link as={Link} to="/dashboard/booklist"><i className="bi bi-book-half"></i></Nav.Link>
          <Nav.Link as={Link} to="/dashboard/categories"><i className="bi bi-tag-fill"></i></Nav.Link>
          <Nav.Link as={Link} to="/mood-selection"><i className="bi bi-palette"></i></Nav.Link>
          <Nav.Link href="#"><i class="bi bi-bar-chart-fill"></i></Nav.Link>
        </Nav>
      </Navbar>
    </>
  );
}

export default BottomNavbar;
