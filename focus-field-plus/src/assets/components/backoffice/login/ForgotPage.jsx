import { useState } from "react";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import { Link } from "react-router";
import FocusNavBar from "../../home/FocusNavBar";
import Footer from "../../home/Footer";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("⚠️ Inserisci un'email valida.");
      return;
    }

    try {
      setIsSending(true);
      const res = await fetch(`${apiUrl}api/focus-field/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Errore durante l'invio della richiesta.");

      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError("❌ Errore durante l'invio. Verifica l'email inserita.");
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <FocusNavBar />
      <Container fluid className="flex-grow-1 d-flex flex-column login-container">
        <Row className="flex-grow-1">
          <Col className="d-flex flex-column justify-content-center align-items-center">
            <div className="mood-section my-3">
              <h2 className="my-2 mood-text mx-4 ps-3 my-3">
                <i className="fas fa-unlock-alt me-2"></i> Recupera Password
              </h2>
              <div className="login-form-container mx-4 mb-4">
                {success ? (
                  <Alert variant="success" className="text-center">
                    ✅ Email di recupero inviata con successo!
                    <br />
                    📧 Controlla la tua casella di posta per il link di reset.
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
                      <Form.Group>
                        <Form.Control
                          type="email"
                          placeholder="Inserisci la tua email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          style={{ marginBottom: "1rem" }}
                          autoComplete="email"
                        />
                      </Form.Group>

                      <button
                        type="submit"
                        className="focusfield-btn mt-2 d-flex align-items-center justify-content-center mx-auto"
                        style={{ width: "16rem" }}
                        disabled={isSending}
                      >
                        {isSending ? "Invio in corso..." : "Invia link di reset"}
                      </button>

                      <Link
                        to="/login"
                        className="focusfield-btn-outline mt-2 mb-3 d-flex align-items-center justify-content-center mx-auto"
                        style={{ width: "16rem", textDecoration: "none" }}
                      >
                        Annulla
                      </Link>
                    </Form>
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

export default ForgotPasswordPage;
