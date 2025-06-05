import { Container } from "react-bootstrap";

const FocusCardsPreview = ({ colors }) => {
  return (
    <Container fluid className="mt-3 pb-5">
      <h2 className="text-center mb-2 fw-bold fs-1" style={{ color: colors[1] }}>
        Colore del testo
      </h2>
    </Container>
  );
};

export default FocusCardsPreview;
