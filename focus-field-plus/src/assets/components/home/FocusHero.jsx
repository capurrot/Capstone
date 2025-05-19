import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { SET_MOOD } from "../../../redux/actions";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import FocusHeroModal from "./FocusHeroModal";

const FocusHero = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [moodText, setMoodText] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);

  const selectedMood = useSelector((state) => state.mood.selectedMood);
  const allMoods = useSelector((state) => state.mood.allMoods);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);

    try {
      const response = await fetch(apiUrl + "api/focus-field/openai/classify-mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: moodText }),
      });

      const data = await response.json();
      console.log(data);

      const found = allMoods.find((mood) => mood.slug === data.mood?.toLowerCase());

      if (found) {
        setDetectedMood(found);
        setShowModal(true);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Errore durante la chiamata all'API:", error);
      setNotFound(true);
    }

    setMoodText("");
    setLoading(false);
  };

  const handleConfirmMood = () => {
    dispatch({ type: SET_MOOD, payload: detectedMood });
    setShowModal(false);
    navigate(`/mood/${detectedMood.slug}`);
  };

  const backgroundImage =
    selectedMood?.background || "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=1080&auto=format";

  return (
    <div
      className="hero-section"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "calc(100vh - 66px)",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div className="mt-5">
        <h1 className="display-3 fw-bold">{t("hero.title")}</h1>
        <p className="display-6">{t("hero.subtitle")}</p>

        <Form
          onSubmit={handleSubmit}
          className="mt-4 d-flex align-items-center rounded py-2 px-3"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
        >
          <Form.Control
            type="text"
            placeholder={t("hero.placeholder")}
            value={moodText}
            onChange={(e) => setMoodText(e.target.value)}
            className="bg-transparent border-0 focus-0"
            disabled={loading}
          />
          <Button className="bg-transparent border-0 p-0 m-0" type="submit" disabled={loading}>
            <Search style={{ fontSize: "1.5rem", color: "#000" }} />
          </Button>
        </Form>

        {notFound && (
          <p className="mt-3 fw-bold" style={{ color: "#ffcdd2" }}>
            {t("hero.not_found")}
          </p>
        )}
      </div>

      <FocusHeroModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmMood}
        detectedMood={detectedMood}
        t={t}
      />
    </div>
  );
};

export default FocusHero;
