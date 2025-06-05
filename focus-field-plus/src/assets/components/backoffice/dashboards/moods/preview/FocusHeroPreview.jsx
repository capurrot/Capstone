import { Button, Container, Form } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";

const FocusHeroPreview = ({ mood }) => {
  return (
    <div
      className="hero-section"
      style={{
        backgroundImage: `url(${mood?.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "14rem",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div className="mt-1 position-relative z-index-1">
        <h1 className="display-3 fw-bold" style={{ fontSize: "1.5rem" }}>
          Ritrova il tuo equilibrio mentale
        </h1>
        <p className="display-6" style={{ fontSize: "0.9rem" }}>
          Scrivi come ti senti. FocusField+ farà il resto.
        </p>
      </div>
    </div>
  );
};

export default FocusHeroPreview;
