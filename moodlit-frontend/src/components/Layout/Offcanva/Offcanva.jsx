import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Offcanvas, Button, Nav, Col } from 'react-bootstrap';
import './Offcanva.css'
// import logo from '../../../assets/logo-small.png';
import { AuthContext } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';


const SidebarOffcanvas = () => {
  const [show, setShow] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <div className='d-none d-md-block fixed'>
      <Col>
        <Button
          onClick={handleShow}
          className="btn-offcanva accent-txt">
          <i className="bi bi-list"></i>
        </Button>
      </Col>


      <Offcanvas show={show} onHide={handleClose} placement="start"
        className="bg-d">
        <Offcanvas.Header closeButton >
          <Offcanvas.Title>
            {/* Navbar Brand */}
            <a className="navbar-brand" href="http://localhost:3000">
              {/*<img src={logo} alt="logo" className='logo'/>*/}
              <span className='title-font'>MoodLit</span>
            </a>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body >
          <div className="mb-4">
            <Nav className="flex-column">
            <Nav.Link as={Link} to="/dashboard/profile">Profile Settings</Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          </div>

          <div>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/dashboard/booklist">Books</Nav.Link>
              <Nav.Link as={Link} to="/dashboard/categories">Categories</Nav.Link>
              <Nav.Link as={Link} to="/mood-selection">Moods</Nav.Link>
              <Nav.Link href="#">Analytics</Nav.Link>
            </Nav>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default SidebarOffcanvas;

