import { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Headphones, BarChart, GearFill, ArrowLeftCircle } from "react-bootstrap-icons";

const SellerDashboard = ({ user }) => {
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
              <h5 className="mb-4">Benvenuto, {user?.nome + " " + user?.cognome || "Venditore"}!</h5>
              <Row className="mb-5">
                <Col lg={4}>
                  <Card className="text-center border-1 shadow-sm">
                    <Card.Body>
                      <Headphones size={48} className="mb-3" />
                      <Card.Title>I tuoi Mood</Card.Title>
                      <Card.Text>Gestisci i mood che hai creato</Card.Text>
                      <Button variant="primary" style={{ width: "10rem" }} onClick={() => setView("moods")}>
                        Vai
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card className="text-center border-1 shadow-sm">
                    <Card.Body>
                      <BarChart size={48} className="mb-3" />
                      <Card.Title>Statistiche</Card.Title>
                      <Card.Text>Consulta dati e performance dei tuoi contenuti</Card.Text>
                      <Button variant="primary" style={{ width: "10rem" }} onClick={() => setView("stats")}>
                        Vai
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card className="text-center border-1 shadow-sm">
                    <Card.Body>
                      <GearFill size={48} className="mb-3" />
                      <Card.Title>Impostazioni</Card.Title>
                      <Card.Text>Gestisci il tuo profilo venditore</Card.Text>
                      <Button variant="primary" style={{ width: "10rem" }} onClick={() => setView("settings")}>
                        Vai
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}

          {view === "moods" && (
            <>
              <div className="d-flex align-items-center mb-4">
                <h2 className="fw-bold">I tuoi Mood</h2>
                <Button
                  variant="link"
                  className="mb-3 ms-auto text-decoration-none d-flex align-items-center"
                  onClick={() => setView("dashboard")}
                >
                  <ArrowLeftCircle size={20} className="me-2" />
                  Torna alla Dashboard
                </Button>
              </div>
            </>
          )}

          {view === "stats" && (
            <>
              <div className="d-flex align-items-center mb-4">
                <h2 className="fw-bold">Statistiche di utilizzo</h2>
                <Button
                  variant="link"
                  className="mb-3 ms-auto text-decoration-none d-flex align-items-center"
                  onClick={() => setView("dashboard")}
                >
                  <ArrowLeftCircle size={20} className="me-2" />
                  Torna alla Dashboard
                </Button>
              </div>
            </>
          )}

          {view === "settings" && (
            <>
              <div className="d-flex align-items-center mb-4">
                <h2 className="fw-bold">Impostazioni Account</h2>
                <Button
                  variant="link"
                  className="mb-3 ms-auto text-decoration-none d-flex align-items-center"
                  onClick={() => setView("dashboard")}
                >
                  <ArrowLeftCircle size={20} className="me-2" />
                  Torna alla Dashboard
                </Button>
              </div>
            </>
          )}
        </Container>
      </div>
    </Container>
  );
};

export default SellerDashboard;
