import { useState } from "react";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link } from "react-router";
import FocusNavBar from "../../home/FocusNavBar";
import Footer from "../../home/Footer";
import { registerUser } from "../../../../redux/actions";
import ButtonsLogin from "./ButtonsLogin";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);

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
    const newValue = type === "checkbox" ? checked : value;

    setForm((prev) => {
      const updatedForm = { ...prev, [name]: newValue };

      if (name === "password" || name === "confirmPassword") {
        setPasswordMatchError(
          updatedForm.password && updatedForm.confirmPassword && updatedForm.password !== updatedForm.confirmPassword
        );
      }

      return updatedForm;
    });

    setError("");
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
    setPasswordMatchError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword, nome, cognome, acceptedTerms } = form;

    if (!username || !email || !password || !confirmPassword || !nome || !cognome) {
      setError("⚠️ Tutti i campi sono obbligatori.");
      return;
    }

    if (password !== confirmPassword) {
      setError("❌ Le password non coincidono.");
      return;
    }

    if (!acceptedTerms) {
      setError("❗ Devi accettare i termini e le condizioni.");
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
                    📧 È stata inviata un'email di verifica alla tua casella di posta. Controlla la tua email per
                    attivare l'account.
                    <br />
                    <Link to="/login" className="btn btn-link mt-3">
                      Torna al login
                    </Link>
                  </Alert>
                ) : (
                  <>
                    {error && (
                      <Alert variant="danger" className="text-center">
                        {error}
                      </Alert>
                    )}
                    <Form className="mt-4 w-100 px-4" onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Control
                            className="mb-3"
                            type="text"
                            placeholder="Nome"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Control
                            className="mb-3"
                            type="text"
                            placeholder="Cognome"
                            name="cognome"
                            value={form.cognome}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
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
                        </Col>
                        <Col md={6}>
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
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
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
                        </Col>
                        <Col md={6}>
                          <Form.Control
                            className="mb-1"
                            type="password"
                            placeholder="Conferma Password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            isInvalid={passwordMatchError}
                            required
                          />
                          {passwordMatchError && (
                            <Form.Text className="text-danger mb-3">Le password non corrispondono.</Form.Text>
                          )}
                        </Col>
                      </Row>
                      <Form.Check
                        type="checkbox"
                        label="Accetto i termini e le condizioni"
                        name="acceptedTerms"
                        checked={form.acceptedTerms}
                        onChange={handleChange}
                        className="mb-3"
                        required
                      />
                      <button
                        type="submit"
                        className="focusfield-btn mt-2 d-flex align-items-center justify-content-center mx-auto"
                        style={{ width: "16rem" }}
                        disabled={passwordMatchError}
                      >
                        Registrati
                      </button>

                      <Link
                        to="/login"
                        className="focusfield-btn-outline mt-2 d-flex align-items-center justify-content-center mx-auto"
                        style={{ width: "16rem", textDecoration: "none" }}
                      >
                        Annulla
                      </Link>
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
