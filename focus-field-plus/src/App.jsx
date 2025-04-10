import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import Focusfield from "./assets/components/Focusfield.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_ALL_MOODS, SET_MOOD } from "./redux/actions/index.js";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import MoodPageWrapper from "./assets/components/MoodPageWrapper.jsx";
import SpotifyAuth from "./assets/components/SpotifyAuth.jsx";

function App() {
  const dispatch = useDispatch();
  const mood = useSelector((state) => state.mood.selectedMood);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await fetch("/moods.json");
        const data = await response.json();
        dispatch({ type: SET_ALL_MOODS, payload: data });
      } catch (error) {
        console.error("Errore nel caricamento dei mood:", error);
      }
    };

    fetchMoods();
  }, [dispatch]);

  useEffect(() => {
    if (mood === null) {
      dispatch({ type: SET_MOOD, payload: "focus" });
    }
  }, [dispatch, mood]);

  const colors = mood?.colors || ["#4e495d", "#ffffff", "#6c5ce7", "#ffffff", "#ffffff", "#ffffff"];
  const slug = mood?.slug || "standard";

  return (
    <div
      className={`main-container mood-${slug}`}
      style={{
        "--mood-bg": colors[0],
        "--mood-text": colors[1],
        "--mood-accent": colors[2],
        "--mood-text-card": colors[3],
        "--mood-text-1": colors[4],
        "--mood-text-2": colors[5],
      }}
    >
      <Routes>
        <Route path="/" element={<Focusfield />} />
        <Route path="/callback" element={<SpotifyAuth />} />
        <Route path="/mood/:moodName" element={<MoodPageWrapper />} />
      </Routes>
    </div>
  );
}

export default App;
