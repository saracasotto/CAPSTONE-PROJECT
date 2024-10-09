import { Navbar, Nav } from 'react-bootstrap';
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import logo from '../../../assets/logo-small.png';


const TopNavbar = ()=>{
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <>
      <Navbar expand="lg" className="d-md-none fixed-top bg-d">
        <Navbar.Brand href="#">
        <img src={logo} alt="logo" className='logo'/> 
        <span className='title-font'>MoodLit</span></Navbar.Brand>
        <Navbar.Toggle aria-controls="profile-navbar">
        <i class="bi bi-list"></i>
        </Navbar.Toggle>
        <Navbar.Collapse id="profile-navbar">
          <Nav className="ml-auto">
          <Nav.Link as={Link} to="/dashboard/profile">Profile Settings</Nav.Link>
          <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default TopNavbar;
