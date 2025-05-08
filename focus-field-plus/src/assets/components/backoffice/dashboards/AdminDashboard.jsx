import { useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import {
  PeopleFill,
  Headphones,
  BarChart,
  LockFill,
  FileEarmarkText,
  FileEarmarkSpreadsheet,
  ArrowLeftCircle,
} from "react-bootstrap-icons";
import ListUsers from "./users/ListUsers";

const AdminDashboard = ({ user }) => {
  const [view, setView] = useState("dashboard");

  return (
    <Container fluid className="px-0 d-flex flex-column">
      <div className="p-4 shadow-sm border-0 bg-light">
        <Container>
          {view === "dashboard" && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold">Dashboard</h1>
                <span>{user?.email || "admin@example.com"}</span>
              </div>
              <h5 className="mb-4">Benvenuto, {user?.nome + " " + user?.cognome || "admin"}!</h5>
              <Row className="mb-5">
                <Col lg={4}>
                  <Card className="text-center border-1 shadow-sm">
                    <Card.Body>
                      <PeopleFill size={48} className="mb-3" />
                      <Card.Title>Gestione Utenti</Card.Title>
                      <Card.Text>Visualizza e gestisci utenti</Card.Text>
                      <Button variant="primary" style={{ width: "10rem" }} onClick={() => setView("users")}>
                        Vai
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card className="text-center border-1 shadow-sm">
                    <Card.Body>
                      <Headphones size={48} className="mb-3" />
                      <Card.Title>Gestione Mood</Card.Title>
                      <Card.Text>Crea e aggiorna mood</Card.Text>
                      <Button variant="primary" style={{ width: "10rem" }}>
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
                      <Card.Text>Dati utilizzo e performance</Card.Text>
                      <Button variant="primary" style={{ width: "10rem" }}>
                        Vai
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <h5 className="mb-3">Attività Recenti</h5>
              <ListGroup className="mb-5">
                <ListGroup.Item className="text-black">👤 Utente "mariorossi" registrato</ListGroup.Item>
                <ListGroup.Item className="text-black">🛠️ Mood "Energetico" aggiornato</ListGroup.Item>
                <ListGroup.Item className="text-black">👤 Mood "Calma" utilizzato da 12 utenti oggi</ListGroup.Item>
              </ListGroup>

              <Row>
                <Col lg={2}>
                  <Card className="text-center border-0 shadow-sm">
                    <Card.Body>
                      <LockFill size={48} className="mb-3" />
                      <Card.Title>Gestione Ruoli</Card.Title>
                      <Button variant="primary">Vai</Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={2}>
                  <Card className="text-center border-0 shadow-sm">
                    <Card.Body>
                      <FileEarmarkText size={48} className="mb-3" />
                      <Card.Title>Log di Sistema</Card.Title>
                      <Button variant="primary">Vai</Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={2}>
                  <Card className="text-center border-0 shadow-sm">
                    <Card.Body>
                      <FileEarmarkSpreadsheet size={48} className="mb-3" />
                      <Card.Title>Esporta CSV</Card.Title>
                      <Button variant="primary">Vai</Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}

          {view === "users" && (
            <>
              <div className="d-flex align-items-center mb-4">
                <h2 className="fw-bold">Gestione Utenti</h2>
                {/* Link per tornare indietro */}
                <Button
                  variant="link"
                  className="mb-3 ms-auto text-decoration-none d-flex align-items-center"
                  onClick={() => setView("dashboard")}
                >
                  <ArrowLeftCircle size={20} className="me-2" />
                  Torna alla Dashboard
                </Button>
              </div>
              <ListUsers />
            </>
          )}

          {view === "moods" && (
            <>
              <div className="d-flex align-items-center mb-4">
                <h2 className="fw-bold">Gestione Mood</h2>
                {/* Link per tornare indietro */}
                <Button
                  variant="link"
                  className="mb-3 ms-auto text-decoration-none d-flex align-items-center"
                  onClick={() => setView("dashboard")}
                >
                  <ArrowLeftCircle size={20} className="me-2" />
                  Torna alla Dashboard
                </Button>
              </div>
              <ListMoods />
            </>
          )}
        </Container>
      </div>
    </Container>
  );
};

export default AdminDashboard;
