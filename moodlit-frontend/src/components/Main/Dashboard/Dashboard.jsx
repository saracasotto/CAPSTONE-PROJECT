import { Container } from "react-bootstrap";
import SidebarOffcanvas from "../../Layout/Offcanva/Offcanva";
import './Dashboard.css'
import TopNavbar from "../../Layout/Navbar/TopNavbar";
import BottomNavbar from "../../Layout/Navbar/BottomNavbar";
import MoodPhrases from "../../MoodManager/MoodPhrases/MoodPhrases";
import BookList from "../BookManager/BookList/BookList";

function Dashboard() {
    return (
        <Container fluid className="dashboard-container d-block d-md-flex">
            <SidebarOffcanvas />
            <TopNavbar />
            <Container className="content">
                <MoodPhrases />
                <h2 className="text-center m-5">Choose a book to start a new session</h2>
                <BookList />
            </Container>
            <BottomNavbar />
        </Container>
    )
}

export default Dashboard;