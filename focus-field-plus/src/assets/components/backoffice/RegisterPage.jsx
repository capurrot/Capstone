import { useState } from "react";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link } from "react-router";
import FocusNavBar from "../home/FocusNavBar";
import Footer from "../home/Footer";
import { registerUser } from "../../../redux/actions";
import ButtonsLogin from "./ButtonsLogin";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    nome: "",
    cognome: "",
    acceptedTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      nome: "",
      cognome: "",
      acceptedTerms: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Le password non coincidono");
      return;
    }
    if (!form.acceptedTerms) {
      alert("Devi accettare i termini");
      return;
    }

    dispatch(registerUser(form));
    setSuccess(true);
    resetForm();
  };

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <FocusNavBar />
      <Container fluid className="flex-grow-1 d-flex flex-column login-container">
        <Row className="flex-grow-1">
          <Col className="d-flex flex-column justify-content-center align-items-center">
            <div className="mood-section my-3">
              <h2 className="my-2 mood-text mx-4 ps-3 my-3">
                <i className="fas fa-user-plus me-2"></i>Register
              </h2>
              <div className="login-form-container mx-4 mb-4">
                {success ? (
                  <Alert variant="success" className="text-center">
                    ✅ Registrazione avvenuta con successo!
                    <br />
                    <Link to="/login" className="btn btn-link mt-3">
                      Torna al login
                    </Link>
                  </Alert>
                ) : (
                  <>
                    <Form className="mt-4 w-100 px-4" onSubmit={handleSubmit}>
                      <Form.Control
                        className="mb-3"
                        type="text"
                        placeholder="Nome"
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control
                        className="mb-3"
                        type="text"
                        placeholder="Cognome"
                        name="cognome"
                        value={form.cognome}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control
                        className="mb-3"
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        autoComplete="username"
                        required
                      />
                      <Form.Control
                        className="mb-3"
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                      />
                      <Form.Control
                        className="mb-3"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                      />
                      <Form.Control
                        className="mb-3"
                        type="password"
                        placeholder="Conferma Password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                      />
                      <Form.Check
                        type="checkbox"
                        label="Accetto i termini e le condizioni"
                        name="acceptedTerms"
                        checked={form.acceptedTerms}
                        onChange={handleChange}
                        className="mb-3"
                      />
                      <button className="focusfield-btn mt-2 w-100">Registrati</button>
                    </Form>

                    <ButtonsLogin />
                  </>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </Container>
  );
};

export default RegisterPage;
