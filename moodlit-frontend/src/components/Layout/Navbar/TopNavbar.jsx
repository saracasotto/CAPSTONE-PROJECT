import { Navbar, Nav } from 'react-bootstrap';
import './Navbar.css'
import logo from '../../../assets/logo-small.png';


function TopNavbar() {
  return (
    <>
      <Navbar expand="lg" className="d-md-none fixed-top bg-main">
        <Navbar.Brand href="#">
        <img src={logo} alt="logo" className='logo'/>
        <span className='title-font'>MoodLit</span></Navbar.Brand>
        <Navbar.Toggle aria-controls="profile-navbar" />
        <Navbar.Collapse id="profile-navbar">
          <Nav className="ml-auto">
            <Nav.Link href="#">Profile Settings</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default TopNavbar;
