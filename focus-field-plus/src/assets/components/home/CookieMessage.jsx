import { useState, useEffect } from "react";
import { Container, Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const CookieMessage = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "all");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "none");
    setVisible(false);
  };

  const handlePreferencesSave = () => {
    // Qui puoi salvare preferenze dettagliate se vuoi
    localStorage.setItem("cookieConsent", "custom");
    setShowPreferences(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      <div className="cookie-message position-fixed bottom-0 w-100 bg-dark text-white py-3 z-3">
        <Container className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div>
            <h5 className="mb-2">{t("cookie.title")}</h5>
            <p className="mb-0">
              {t("cookie.message")}{" "}
              <a href={t("cookie.linkUrl")} className="text-white text-decoration-underline">
                {t("cookie.linkText")}
              </a>
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <Button variant="light" onClick={handleAccept}>
              {t("cookie.buttons.accept")}
            </Button>
            <Button variant="outline-light" onClick={handleReject}>
              {t("cookie.buttons.reject")}
            </Button>
            <Button variant="outline-light" onClick={() => setShowPreferences(true)}>
              {t("cookie.buttons.manage")}
            </Button>
          </div>
        </Container>
      </div>

      {/* Modal per gestire le preferenze */}
      <Modal show={showPreferences} onHide={() => setShowPreferences(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("cookie.buttons.manage")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>⚙️ (Sezione preferenze avanzate in sviluppo...)</p>
          <p>Qui potresti permettere di scegliere quali cookie abilitare: funzionali, analitici, marketing, ecc.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreferences(false)}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={handlePreferencesSave}>
            Salva preferenze
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CookieMessage;
