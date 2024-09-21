import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./components/WelcomePage/Welcome.jsx";
import "./App.css";
import Dashboard from "./components/Main/Dashboard/Dashboard.jsx";
import MoodSelector from "./components/MoodManager/MoodSelector/MoodSelector.jsx";
import SeasonSelector from "./components/MoodManager/MoodSelector/SeasonSelector.jsx";
import { MoodProvider } from "./context/MoodContext.js";

function App() {
  return (
    <Container fluid id="app">
      <MoodProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/mood-selection" element={<MoodSelector />} />
            <Route path="/season-selection" element={<SeasonSelector />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </MoodProvider>
    </Container>
  );
}

export default App;
