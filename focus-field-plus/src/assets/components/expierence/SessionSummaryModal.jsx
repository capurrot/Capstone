import { Modal, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { FaRegSadTear, FaRegFrown, FaRegMeh, FaRegSmile, FaRegGrinStars } from "react-icons/fa";
import { decryptContent } from "../../../redux/utils/cryptoWeb";

const faces = [
  { icon: <FaRegSadTear size={28} />, label: "Triste", value: 1 },
  { icon: <FaRegFrown size={28} />, label: "Così così", value: 2 },
  { icon: <FaRegMeh size={28} />, label: "Neutro", value: 3 },
  { icon: <FaRegSmile size={28} />, label: "Bene", value: 4 },
  { icon: <FaRegGrinStars size={28} />, label: "Ottimo!", value: 5 },
];
const password = import.meta.env.VITE_CRYPTO_SECRET;

function SessionSummaryModal({ show, onClose, mood, journalPre, journalPost, duration, userId }) {
  const [rating, setRating] = useState(0);
  const [decryptedPre, setDecryptedPre] = useState(null);
  const [decryptedPost, setDecryptedPost] = useState(null);

  useEffect(() => {
    const decryptAll = async () => {
      if (journalPre) {
        try {
          const result = await decryptContent(journalPre, password);
          setDecryptedPre(result);
        } catch {
          setDecryptedPre("[Errore nella decrittazione]");
        }
      }

      if (journalPost) {
        try {
          const result = await decryptContent(journalPost, password);
          setDecryptedPost(result);
        } catch {
          setDecryptedPost("[Errore nella decrittazione]");
        }
      }
    };

    decryptAll();
  }, [journalPre, journalPost, userId]);

  const handleSubmit = () => {
    console.log("Valutazione inviata:", rating);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Sessione completata – {mood?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="fs-5">Hai concluso la sessione con successo 🎯</p>
        <p>
          <strong>Durata suggerita:</strong> {duration}
        </p>

        {(decryptedPre || decryptedPost) && (
          <>
            <hr />
            <div>
              <p className="fw-semibold">📝 Diario della sessione</p>
              {decryptedPre && (
                <div className="mb-3">
                  <h6 className="text-secondary">Prima della sessione</h6>
                  <blockquote className="bg-light p-3 rounded">{decryptedPre}</blockquote>
                </div>
              )}
              {decryptedPost && (
                <div className="mb-3">
                  <h6 className="text-secondary">Dopo la sessione</h6>
                  <blockquote className="bg-light p-3 rounded">{decryptedPost}</blockquote>
                </div>
              )}
            </div>
          </>
        )}

        <hr />
        <div>
          <p className="mb-2 fw-semibold">Come ti senti ora?</p>
          <div className="d-flex gap-3 flex-wrap justify-content-center">
            {faces.map((f) => (
              <div
                key={f.value}
                className={`p-3 rounded text-center shadow-sm ${
                  rating === f.value ? "bg-primary text-white" : "bg-light"
                }`}
                style={{ cursor: "pointer", minWidth: "80px" }}
                onClick={() => setRating(f.value)}
              >
                {f.icon}
                <div className="mt-1 small">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Chiudi
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={rating === 0}>
          Invia valutazione
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SessionSummaryModal;
