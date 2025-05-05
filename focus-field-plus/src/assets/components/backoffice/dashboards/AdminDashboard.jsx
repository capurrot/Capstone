import { Container, Row, Col, Card, Button } from "react-bootstrap";

const AdminDashboard = ({ user }) => {
  return (
    <Container fluid className="py-4 bg-white">
      <Container>
        <h1 className="mb-4">Admin Dashboard </h1>
        <Row className="g-4">
          Ciao {user.nome} {user.cognome}
        </Row>
      </Container>
    </Container>
  );
};

export default AdminDashboard;
