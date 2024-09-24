import { Container } from "react-bootstrap";
import SidebarOffcanvas from "../../Layout/Offcanva/Offcanva";
import './Dashboard.css'
import TopNavbar from "../../Layout/Navbar/TopNavbar";
import BottomNavbar from "../../Layout/Navbar/BottomNavbar";
import MoodPhrases from "../../MoodManager/MoodPhrases/MoodPhrases";

function Dashboard() {
    return (
        <Container fluid className="dashboard-container d-block d-md-flex">
            <SidebarOffcanvas />
            <TopNavbar />
            <Container className="content d-flex justify-content-center">
            <MoodPhrases />
                QUI CI METTO FOCUS SESSION
                BOOKS
                CATEGORIES 
                ANALISI
            </Container>
            <BottomNavbar />
        </Container>
    )
}

export default Dashboard;