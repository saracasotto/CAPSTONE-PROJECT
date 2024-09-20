import { Navbar, Nav } from 'react-bootstrap';
import './Navbar.css'
import logo from '../../../assets/logo-small.png';


function TopNavbar() {
  return (
    <>
      <Navbar bg="light" expand="lg" className="d-md-none fixed-top">
        <Navbar.Brand href="#">
        <img src={logo} alt="logo" className='logo'/>
        <span className='title-font'>MoodLit</span></Navbar.Brand>
        <Navbar.Toggle aria-controls="profile-navbar" />
        <Navbar.Collapse id="profile-navbar">
          <Nav className="ml-auto">
            <Nav.Link href="#">Configurazione</Nav.Link>
            <Nav.Link href="#">Dark/Light Mode</Nav.Link>
            <Nav.Link href="#">Privacy Policy</Nav.Link>
            <Nav.Link href="#">Avviso Legale</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default TopNavbar;
