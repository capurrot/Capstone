import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { SET_MOOD } from "../../../redux/actions";
import { useTranslation } from "react-i18next";

const FocusHero = () => {
  const { t } = useTranslation();
  const [moodText, setMoodText] = useState("");
  const [notFound, setNotFound] = useState(false);

  const dispatch = useDispatch();
  const selectedMood = useSelector((state) => state.mood.selectedMood);
  const allMoods = useSelector((state) => state.mood.allMoods);

  const handleSubmit = (e) => {
    e.preventDefault();
    const lowerText = moodText.toLowerCase();

    const detectedMood = allMoods.find((mood) => mood.tag?.some((tag) => lowerText.includes(tag.toLowerCase())));

    if (detectedMood) {
      dispatch({ type: SET_MOOD, payload: detectedMood });
      setNotFound(false);
    } else {
      setNotFound(true);
    }

    setMoodText("");
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
        height: "calc(100vh - 76px)",
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
          style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
        >
          <Form.Control
            type="text"
            placeholder={t("hero.placeholder")}
            value={moodText}
            onChange={(e) => setMoodText(e.target.value)}
            className="bg-transparent border-0 focus-0"
          />
          <Button className="bg-transparent border-0 p-0 m-0" type="submit">
            <Search style={{ fontSize: "1.5rem" }} />
          </Button>
        </Form>

        {notFound && (
          <p className="mt-3 fw-bold" style={{ color: "#ffcdd2" }}>
            {t("hero.not_found")}
          </p>
        )}
      </div>
    </div>
  );
};

export default FocusHero;
