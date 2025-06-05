import { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { ClockHistory, GearFill, ArrowLeftCircle } from "react-bootstrap-icons";
import UserStats from "./stats/UserStats";
import { FaUser } from "react-icons/fa";
import UserProfile from "./profile/UserProfile";
/* import MoodHistory from "./user/MoodHistory";
import UserPreferences from "./user/UserPreferences"; */

const UserDashboard = ({ user }) => {
  const [view, setView] = useState("dashboard");

  return (
    <Container fluid className="px-0 d-flex flex-column">
      <div className="p-4 shadow-sm border-0 bg-light" style={{ minHeight: "calc(100vh - 11rem)" }}>
        <Container>
          {view === "dashboard" && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold">Dashboard</h1>
                <span>{user?.email}</span>
              </div>
              <h5 className="mb-4">Benvenuto, {user?.nome + " " + user?.cognome || "Utente"}!</h5>
              <Row className="mb-5">
                <Col lg={4}>
                  <Card className="text-center border-1 shadow-sm">
                    <Card.Body>
                      <FaUser size={48} className="mb-3" />
                      <Card.Title>Profilo Utente</Card.Title>
                      <Card.Text>Visualizza o aggiorna il tuo profilo</Card.Text>
                      <Button variant="primary" style={{ width: "10rem" }} onClick={() => setView("profile")}>
                        Vai
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card className="text-center border-1 shadow-sm">
                    <Card.Body>
                      <ClockHistory size={48} className="mb-3" />
                      <Card.Title>Storico Sessioni</Card.Title>
                      <Card.Text>Rivedi le sessioni passate</Card.Text>
                      <Button variant="primary" style={{ width: "10rem" }} onClick={() => setView("history")}>
                        Vai
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card className="text-center border-1 shadow-sm">
                    <Card.Body>
                      <GearFill size={48} className="mb-3" />
                      <Card.Title>Preferenze</Card.Title>
                      <Card.Text>Gestisci le tue preferenze personali</Card.Text>
                      <Button variant="primary" style={{ width: "10rem" }} onClick={() => setView("preferences")}>
                        Vai
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}

          {view === "profile" && (
            <>
              <div className="d-flex align-items-center mb-4">
                <h2 className="fw-bold">Il tuo Profilo</h2>
                <Button
                  variant="link"
                  className="mb-3 ms-auto text-decoration-none d-flex align-items-center"
                  onClick={() => setView("dashboard")}
                >
                  <ArrowLeftCircle size={20} className="me-2" />
                  Torna alla Dashboard
                </Button>
              </div>
              <UserProfile />
            </>
          )}

          {view === "history" && (
            <>
              <div className="d-flex align-items-center mb-4">
                <h2 className="fw-bold">Storico Sessioni</h2>
                <Button
                  variant="link"
                  className="mb-3 ms-auto text-decoration-none d-flex align-items-center"
                  onClick={() => setView("dashboard")}
                >
                  <ArrowLeftCircle size={20} className="me-2" />
                  Torna alla Dashboard
                </Button>
              </div>
              <UserStats />
            </>
          )}

          {view === "preferences" && (
            <>
              <div className="d-flex align-items-center mb-4">
                <h2 className="fw-bold">Preferenze</h2>
                <Button
                  variant="link"
                  className="mb-3 ms-auto text-decoration-none d-flex align-items-center"
                  onClick={() => setView("dashboard")}
                >
                  <ArrowLeftCircle size={20} className="me-2" />
                  Torna alla Dashboard
                </Button>
              </div>
              {/*   <UserPreferences /> */}
            </>
          )}
        </Container>
      </div>
    </Container>
  );
};

export default UserDashboard;
