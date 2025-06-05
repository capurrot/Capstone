import { useEffect, useState } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { Link, useLocation } from "react-router";
import FocusNavBar from "../../home/FocusNavBar";
import Footer from "../../home/Footer";

const VerifyEmailPage = () => {
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [message, setMessage] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const query = new URLSearchParams(useLocation().search);
  const token = query.get("code");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus("error");
        setMessage("❌ Codice mancante. Verifica il link.");
        return;
      }

      try {
        const res = await fetch(`${apiUrl}api/focus-field/auth/verify-email?code=${encodeURIComponent(token)}`);
        if (!res.ok) throw new Error("Verifica fallita");

        setVerificationStatus("success");
        setMessage("✅ Email verificata con successo! Ora puoi accedere.");
      } catch (err) {
        console.error("Errore verifica email:", err);
        setVerificationStatus("error");
        setMessage("❌ Errore durante la verifica. Il link potrebbe essere scaduto o non valido.");
      }
    };

    verifyEmail();
  }, [token, apiUrl]);

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <FocusNavBar />
      <Container fluid className="flex-grow-1 d-flex flex-column login-container">
        <Row className="flex-grow-1">
          <Col className="d-flex flex-column justify-content-center align-items-center text-center">
            <div className="mood-section my-3">
              <h2 className="my-2 mood-text mx-4 ps-3 my-3">
                <i className="fas fa-envelope-open-text me-2"></i> Verifica Email
              </h2>
              <div className="login-form-container mx-4 mb-4">
                {verificationStatus === "pending" ? (
                  <Spinner animation="border" variant="primary" />
                ) : (
                  <Alert variant={verificationStatus === "success" ? "success" : "danger"} className="mt-3">
                    {message}
                    {verificationStatus === "success" && (
                      <div className="mt-3">
                        <Link
                          to="/login"
                          className="focusfield-btn-outline d-inline-block"
                          style={{ textDecoration: "none", width: "16rem" }}
                        >
                          Vai al login
                        </Link>
                      </div>
                    )}
                  </Alert>
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

export default VerifyEmailPage;
