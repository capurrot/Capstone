import { Modal, Container, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useMemo, useState } from "react";

const FocusMoodModal = ({ show, onHide }) => {
  const { t } = useTranslation();
  const moods = useSelector((state) => state.mood.allMoods);
  const [hoveredMood, setHoveredMood] = useState(null);

  const shuffledMoods = useMemo(() => {
    return [...moods].sort(() => Math.random() - 0.5);
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      contentClassName="focusfield-modal-content"
      dialogClassName="focusfield-modal-dialog"
      backdropClassName="focusfield-backdrop"
    >
      <Modal.Header className="border-0 pb-0 flex-column align-items-center">
        <Modal.Title className="w-100 text-center fs-1 fw-bold text-focusfield" style={{ fontFamily: "Fjalla One" }}>
          {t("try.modalTitle")}
        </Modal.Title>
        <Button
          variant="close"
          onClick={onHide}
          className="btn-close-focusfield btn btn-close position-absolute top-0 end-0 p-4"
        />
      </Modal.Header>

      <Modal.Body className="bg-transparent">
        <div className="mood-preview-container text-center mb-3">
          <img
            key={hoveredMood?.image || "placeholder"}
            src={hoveredMood?.image || "/images/placeholder_mood.png"}
            alt={hoveredMood ? t(`mood.${hoveredMood.slug}`) : "Mood preview"}
            className="mood-preview-image fade-image"
          />
        </div>
        <Container className="d-flex flex-wrap justify-content-center gap-3 py-3">
          {shuffledMoods.map((mood) => (
            <Button
              key={mood.slug}
              as={Link}
              to={`/mood/${mood.slug}`}
              onClick={onHide}
              onMouseEnter={() => {
                if (hoveredMood?.slug !== mood.slug) {
                  setHoveredMood(mood);
                }
              }}
              onMouseLeave={() => setHoveredMood(null)}
              className="focusfield-btn-modal fw-semibold"
              style={{
                minWidth: "160px",
                backgroundColor: mood.colors?.[0] || "#ffffff",
                color: mood.colors?.[1] || "#fff",
              }}
            >
              {t(`mood.${mood.slug}`)} <i className={`bi ${mood.icon}`}></i>
            </Button>
          ))}
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default FocusMoodModal;
