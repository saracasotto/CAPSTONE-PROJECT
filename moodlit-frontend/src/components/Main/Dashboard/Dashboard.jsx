import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import SidebarOffcanvas from "../../Layout/Offcanva/Offcanva";
import './Dashboard.css'
import TopNavbar from "../../Layout/Navbar/TopNavbar";
import BottomNavbar from "../../Layout/Navbar/BottomNavbar";
import MoodPhrases from "../../MoodManager/MoodPhrases/MoodPhrases";
import BookList from "../BookManager/BookList/BookList";
import BookReading from "../BookManager/BookReading/BookReading";
import BookDetails from "../BookManager/BookDetails.jsx/BookDetails";
import CategoryList from "../CategoriesManager/CategoryList/CategoryList";
import Category from "../CategoriesManager/Category/Category";
import Profile from "../../Auth/Profile/Profile";
import ReadingStats from "../Stats/ReadingStats";

const Dashboard = () => {
  return (
    <Container className="dashboard-container text-d d-block d-md-flex p-0">
      <SidebarOffcanvas />
      <TopNavbar />
      <Container className="content">
        <MoodPhrases />  {/* MoodPhrases visibile in ogni pagina */}
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/:id" element={<BookReading />} />
          <Route path="/books/:id/details" element={<BookDetails />} />  {/* Modifico libro */}
          <Route path="/books/add-book" element={<BookDetails />} />
          <Route path="/categories" element={<CategoryList />} />   
          <Route path="/categories/:id" element={<Category />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/statistics" element={<ReadingStats />} />
          <Route path="*" element={<Navigate to="/" />} /> 
        </Routes>
      </Container>
      <BottomNavbar />
    </Container>
  );
}

export default Dashboard;