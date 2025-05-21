import { useState } from "react";
import { Container, Row, Col, Form, Alert, Tooltip } from "react-bootstrap";
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
  const [isUsernameExists, setIsUsernameExists] = useState(null);
  const [isEmailExists, setIsEmailExists] = useState(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [showTooltipUsername, setShowTooltipUsername] = useState(false);
  const [showTooltipEmail, setShowTooltipEmail] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    nome: "",
    cognome: "",
    acceptedTerms: false,
  });

  const checkUsernameExists = async (username) => {
    try {
      setIsCheckingUsername(true);
      const res = await fetch(`${apiUrl}api/focus-field/users/username?username=${encodeURIComponent(username)}`);
      if (!res.ok) throw new Error("Errore nella richiesta");
      const text = await res.text();
      setIsUsernameExists(text === "true");
    } catch (error) {
      console.error("Errore nel controllo username:", error);
      setIsUsernameExists(false);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const checkEmailExists = async (email) => {
    try {
      setIsCheckingEmail(true);
      const res = await fetch(`${apiUrl}api/focus-field/users/email?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error("Errore nella richiesta");
      const text = await res.text();
      setIsEmailExists(text === "true");
    } catch (error) {
      console.error("Errore nel controllo email:", error);
      setIsEmailExists(false);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleChange = async (e) => {
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

    if (name === "username") {
      checkUsernameExists(value.trim());
    }

    if (name === "email" && value !== "" && value.includes("@")) {
      checkEmailExists(value.trim());
    }
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
    setIsUsernameExists(null);
    setIsEmailExists(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword, nome, cognome, acceptedTerms } = form;

    if (isCheckingUsername || isCheckingEmail) {
      setError("⏳ Attendi il completamento della verifica di username e email.");
      return;
    }

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

    if (isUsernameExists || isEmailExists) {
      setError("⚠️ Username o email già in uso.");
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
                    📧 È stata inviata un'email di verifica alla tua casella di posta.
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
                            style={{ marginBottom: "1rem" }}
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
                            style={{ marginBottom: "1rem" }}
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
                          <Form.Group>
                            <div className="position-relative">
                              <Form.Control
                                style={{ marginBottom: "1rem" }}
                                type="text"
                                placeholder="Username"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                isInvalid={form.username.length > 0 && isUsernameExists === true}
                                isValid={form.username.length > 0 && isUsernameExists === false}
                                autoComplete="new-username"
                                required
                              />

                              {form.username.length > 0 && isUsernameExists === true && (
                                <div
                                  className="position-absolute end-0 top-50 translate-middle-y me-3 text-danger"
                                  onMouseEnter={() => setShowTooltipUsername(true)}
                                  onMouseLeave={() => setShowTooltipUsername(false)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <i className="bi bi-x-circle-fill" style={{ opacity: 0 }} />
                                  {showTooltipUsername && (
                                    <div
                                      className="bg-danger text-white p-1 rounded shadow-sm"
                                      style={{
                                        position: "absolute",
                                        top: "120%",
                                        right: -50,
                                        whiteSpace: "nowrap",
                                        zIndex: 10,
                                        fontSize: "0.9rem",
                                      }}
                                    >
                                      Username già registrato
                                    </div>
                                  )}
                                </div>
                              )}

                              {form.username.length > 0 && isUsernameExists === false && (
                                <span className="position-absolute end-0 top-50 translate-middle-y me-3 text-success">
                                  <i className="bi bi-check-circle-fill" style={{ cursor: "pointer", opacity: 0 }} />
                                </span>
                              )}
                            </div>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <div className="position-relative">
                              <Form.Control
                                style={{ marginBottom: "1rem" }}
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                isInvalid={
                                  form.email.length > 0 &&
                                  (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || isEmailExists === true)
                                }
                                isValid={
                                  form.email.length > 0 &&
                                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
                                  isEmailExists === false
                                }
                                autoComplete="new-email"
                                required
                              />

                              {form.email.length > 0 &&
                                (isEmailExists === true || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) && (
                                  <div
                                    className="position-absolute end-0 top-50 translate-middle-y me-3 text-danger"
                                    onMouseEnter={() => setShowTooltipEmail(true)}
                                    onMouseLeave={() => setShowTooltipEmail(false)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <i className="bi bi-x-circle-fill" style={{ opacity: 0 }} />
                                    {showTooltipEmail && (
                                      <div
                                        className="bg-danger text-white p-1 rounded shadow-sm"
                                        style={{
                                          position: "absolute",
                                          top: "120%",
                                          right: -50,
                                          whiteSpace: "nowrap",
                                          zIndex: 10,
                                          fontSize: "0.9rem",
                                        }}
                                      >
                                        {isEmailExists ? "Email già registrata" : "Formato email non valido"}
                                      </div>
                                    )}
                                  </div>
                                )}

                              {form.email.length > 0 &&
                                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
                                isEmailExists === false && (
                                  <span className="position-absolute end-0 top-50 translate-middle-y me-3 text-success">
                                    <i className="bi bi-check-circle-fill" style={{ opacity: 0 }} />
                                  </span>
                                )}
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Control
                            style={{ marginBottom: "1rem" }}
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
                            style={{ marginBottom: "1rem" }}
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
                        disabled={
                          passwordMatchError ||
                          isUsernameExists === true ||
                          isEmailExists === true ||
                          isCheckingUsername ||
                          isCheckingEmail
                        }
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
