import { Navbar, Nav } from 'react-bootstrap';

function BottomNavbar() {
  return (
    <>
      <Navbar className="d-md-none fixed-bottom bg-main">
        <Nav className="justify-content-around w-100">
          <Nav.Link href="#"><i class="bi bi-book-half"></i></Nav.Link>
          <Nav.Link href="#"><i class="bi bi-tag-fill"></i></Nav.Link>
          <Nav.Link href="#"><i class="bi bi-palette"></i></Nav.Link>
          <Nav.Link href="#"><i class="bi bi-bar-chart-fill"></i></Nav.Link>
        </Nav>
      </Navbar>
    </>
  );
}

export default BottomNavbar;
