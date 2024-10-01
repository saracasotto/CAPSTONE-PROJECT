import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Welcome from "./components/WelcomePage/Welcome.jsx";
import "./App.css";
import Dashboard from "./components/Main/Dashboard/Dashboard.jsx";
import MoodSelector from "./components/MoodManager/MoodSelector/MoodSelector.jsx";
import SeasonSelector from "./components/MoodManager/MoodSelector/SeasonSelector.jsx";
import { MoodProvider } from "./context/MoodContext.js";
import { AuthProvider } from "./context/AuthContext.js";
import PrivateRoute from "./components/Auth/PrivateRoute.jsx";

function App() {
  return (
    <Container fluid className="app">
      <Router>
        <AuthProvider>
          <MoodProvider>
            <Routes>
              {/* La rotta principale '/' è pubblica */}
              <Route path="/" element={<Welcome />} />

              {/* Tutte le altre rotte sono protette */}
              <Route
                path="/mood-selection"
                element={<PrivateRoute element={<MoodSelector />} />}
              />
              <Route
                path="/season-selection"
                element={<PrivateRoute element={<SeasonSelector />} />}
              />
              <Route
                path="/dashboard/*"
                element={<PrivateRoute element={<Dashboard />} />}
              />

              {/* Se l'utente va su una rotta non valida, reindirizza alla dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </MoodProvider>
        </AuthProvider>
      </Router>
    </Container>
  );
}

export default App;
