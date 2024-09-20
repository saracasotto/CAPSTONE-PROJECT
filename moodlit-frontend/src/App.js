import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap'
import Welcome from './components/WelcomePage/Welcome.jsx';
import './App.css'


function App() {
  return (
    <Container fluid id='app'>
      <Welcome />
    </Container>
  );
}

export default App;
