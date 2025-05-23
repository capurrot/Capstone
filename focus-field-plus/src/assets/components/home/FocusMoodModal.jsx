import { Modal, Container, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const FocusMoodModal = ({ show, onHide }) => {
  const { t } = useTranslation();
  const moods = useSelector((state) => state.mood.allMoods);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      contentClassName="focusfield-modal-content"
      dialogClassName="focusfield-modal-dialog"
      backdropClassName="focusfield-backdrop"
    >
      <Modal.Header className="border-0 pb-0">
        <Modal.Title className="w-100 text-center fs-1 fw-bold text-focusfield" style={{ fontFamily: "Fjalla One" }}>
          {t("try.modalTitle", "Scegli un Mood")}
        </Modal.Title>
        <Button variant="close" onClick={onHide} className="btn-close-focusfield" style={{ alignSelf: "baseline" }} />
      </Modal.Header>
      <Modal.Body className="bg-transparent">
        <Container className="d-flex flex-wrap justify-content-center gap-3 py-3">
          {moods.map((mood) => (
            <Button
              key={mood.slug}
              as={Link}
              to={`/mood/${mood.slug}`}
              onClick={onHide}
              className="focusfield-btn fw-semibold"
              style={{
                minWidth: "160px",
                backgroundColor: `${mood.colors?.[0] || "#ffffff"}`,
                color: mood.colors?.[1] || "#fff",
              }}
            >
              {t(`mood.${mood.slug}`)}
            </Button>
          ))}
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default FocusMoodModal;
