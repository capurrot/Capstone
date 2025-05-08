import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import FocusField from "./assets/components/FocusField.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_ALL_MOODS, SET_MOOD } from "./redux/actions/index.js";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import MoodPageWrapper from "./assets/components/expierence/MoodPageWrapper.jsx";
import Login from "./assets/components/backoffice/Login.jsx";
import DashboardWrapper from "./assets/components/backoffice/DashboardWrapper.jsx";
import RegisterPage from "./assets/components/backoffice/RegisterPage.jsx";

function App() {
  const dispatch = useDispatch();
  const mood = useSelector((state) => state.mood.selectedMood);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/focus-field/moods");
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const colors = mood?.colors || ["#4e495d", "#ffffff", "#6c5ce7", "#ffffff", "#ffffff", "#ffffff"];
  const slug = mood?.slug || "standard";
  const opacity = mood?.opacity || 0.5;

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    const primaryColor = colors[0];
    if (meta && primaryColor) {
      meta.setAttribute("content", primaryColor);
    }
  }, [colors]);

  return (
    <div
      className={`main-container mood-${slug} d-flex flex-column min-vh-100`}
      style={{
        "--mood-color-1": colors[0],
        "--mood-color-2": colors[1],
        "--mood-color-3": colors[2],
        "--mood-color-4": colors[3],
        "--mood-color-5": colors[4],
        "--mood-color-6": colors[5],
        "--mood-color-7": colors[6],
        "--mood-color-8": colors[7],
        "--mood-color-9": colors[8],
        "--mood-color-10": colors[9],
        "--mood-color-11": colors[10],
        "--mood-color-12": colors[11],
        "--mood-opacity": opacity,
      }}
    >
      <Routes>
        <Route path="/" element={<FocusField />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mood/:moodName" element={<MoodPageWrapper />} />
        <Route path="/dashboard" element={<DashboardWrapper />} />
      </Routes>
    </div>
  );
}

export default App;
