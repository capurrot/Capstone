import { Container, Row, Col, Card, Button } from "react-bootstrap";

const AdminDashboard = ({ user }) => {
  return (
    <Container fluid className="py-4 bg-white text-black">
      <Container>
        <h1>Admin Dashboard </h1>
        <Row className="g-4">
          <p>
            Ciao, {user.nome} {user.cognome}
          </p>
        </Row>
      </Container>
    </Container>
  );
};

export default AdminDashboard;
