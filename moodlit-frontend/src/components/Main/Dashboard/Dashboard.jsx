import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import SidebarOffcanvas from "../../Layout/Offcanva/Offcanva";
import './Dashboard.css'
import TopNavbar from "../../Layout/Navbar/TopNavbar";
import BottomNavbar from "../../Layout/Navbar/BottomNavbar";
import MoodPhrases from "../../MoodManager/MoodPhrases/MoodPhrases";
import BookList from "../BookManager/BookList/BookList";
import BookItem from "../BookManager/BookItem/BookItem";
import BookDetails from "../BookManager/BookDetails.jsx/BookDetails";

function Dashboard() {
  return (
    <Container fluid className="dashboard-container d-block d-md-flex p-0">
      <SidebarOffcanvas />
      <TopNavbar />
      <Container className="content">
        <MoodPhrases />  {/* MoodPhrases visibile in ogni pagina */}
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/:id" element={<BookItem />} />
          <Route path="/books/:id/details" element={<BookDetails />} />  {/* Modifico libro */}
          <Route path="/books/add-book" element={<BookDetails />} />  {/* Aggiungo libro */}
        </Routes>
      </Container>
      <BottomNavbar />
    </Container>
  );
}

export default Dashboard;