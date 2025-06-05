import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { EmojiSmile } from "react-bootstrap-icons";
import { SET_MOOD } from "../../../redux/actions";
import MoodPage from "../expierence/MoodPage";

const FocusHeroModal = ({ show, onClose, onConfirm, detectedMood, t }) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      setVisible(false);
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1000);
      setTimeout(() => {
        dispatch({ type: SET_MOOD, payload: detectedMood });
      }, 2500);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const hasMood = detectedMood && detectedMood.slug;

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      dialogClassName="modal-xl"
      contentClassName="border-0 rounded-5 overflow-hidden shadow"
      backdropClassName="bg-dark bg-opacity-75"
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.4)",
          padding: "2rem 2.5rem",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="text-center mb-3">
          <div className="mb-3">
            <EmojiSmile size={64} className="text-primary" />
          </div>
          <h2 className="fw-bold mb-2">{t("hero.modal_title")}</h2>
          <p className="text-muted fs-5">
            {t("hero.modal_text")} <strong className="text-dark">{detectedMood?.label || detectedMood?.slug}</strong>
          </p>
        </div>

        {hasMood && (
          <div className="position-relative mt-4">
            {!visible && (
              <div className="d-flex justify-content-center align-items-center w-100 h-100 position-absolute top-0 start-0 z-2">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}

            <div
              className="bg-white rounded-4 shadow-sm overflow-hidden"
              style={{
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? "auto" : "none",
                transition: "opacity 0.3s ease",
                height: "320px",
              }}
            >
              <MoodPage moodName={detectedMood.slug} isModal={true} />
            </div>
          </div>
        )}

        <div className="text-center mt-4">
          <Button className="focusfield-btn" onClick={onConfirm}>
            {t("hero.modal_button")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FocusHeroModal;
