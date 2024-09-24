import React, { useState } from 'react';
import { Offcanvas, Button, Nav, Col } from 'react-bootstrap';
import './Offcanva.css'
import logo from '../../../assets/logo-small.png';


function SidebarOffcanvas() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className='d-none d-md-block fixed'>
      <Col>
        <Button
          onClick={handleShow}
          className="btn-offcanva accent-txt">
          <i className="bi bi-list"></i>
        </Button>
      </Col>


      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton >
          <Offcanvas.Title>
            {/* Navbar Brand */}
            <a className="navbar-brand" href="http://localhost:3000">
              <img src={logo} alt="logo" className='logo'/>
              <span className='title-font'>MoodLit</span>
            </a>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body >
          {/* Sezione Profile */}
          <div className="mb-4">
            <h5>Profile</h5>
            <Nav className="flex-column">
              <Nav.Link href="#">Configurazione</Nav.Link>
              <Nav.Link href="#">Dark/Light Mode</Nav.Link>
              <Nav.Link href="#">Privacy Policy</Nav.Link>
              <Nav.Link href="#">Avviso Legale</Nav.Link>
            </Nav>
          </div>

          {/* Link Sezioni */}
          <div>
            <h5>Sezioni</h5>
            <Nav className="flex-column">
              <Nav.Link href="#">Books</Nav.Link>
              <Nav.Link href="#">Categories</Nav.Link>
              <Nav.Link href="#">Moods</Nav.Link>
              <Nav.Link href="#">Analytics</Nav.Link>
            </Nav>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default SidebarOffcanvas;

