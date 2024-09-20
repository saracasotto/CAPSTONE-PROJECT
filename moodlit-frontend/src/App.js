import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./components/WelcomePage/Welcome.jsx";
import "./App.css";
import Dashboard from "./components/Main/Dashboard/Dashboard.jsx";
import MoodSelector from "./components/MoodManager/MoodSelector/MoodSelector.jsx";

function App() {
  return (
    <Container fluid id="app">
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/moodselection" element={<MoodSelector />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </Container>
  );
}

export default App;
