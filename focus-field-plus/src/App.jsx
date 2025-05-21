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
import { fetchAllMoods, setMood } from "./redux/actions/index.js";
import { Routes, Route } from "react-router";
import MoodPageWrapper from "./assets/components/expierence/MoodPageWrapper.jsx";
import Login from "./assets/components/backoffice/login/Login.jsx";
import DashboardWrapper from "./assets/components/backoffice/dashboards/DashboardWrapper.jsx";
import RegisterPage from "./assets/components/backoffice/login/RegisterPage.jsx";

function App() {
  const dispatch = useDispatch();
  const mood = useSelector((state) => state.mood.selectedMood);
  const allMoods = useSelector((state) => state.mood.allMoods);

  useEffect(() => {
    dispatch(fetchAllMoods());
  }, [dispatch]);

  useEffect(() => {
    if (!mood && allMoods.length > 0) {
      const defaultMood = allMoods.find((m) => m.slug === "standard") || allMoods[0];
      dispatch(setMood(defaultMood));
    }
  }, [dispatch, mood, allMoods]);

  useEffect(() => {
    if (!mood) return;

    const root = document.documentElement;
    const colors = mood.colors?.length === 12 ? mood.colors : new Array(12).fill("#ffffff");

    colors.forEach((color, i) => {
      root.style.setProperty(`--mood-color-${i + 1}`, color);
    });

    root.style.setProperty("--mood-opacity", mood.opacity || 0.5);
  }, [mood]);

  // Imposta il colore del browser mobile
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && mood?.colors?.[0]) {
      meta.setAttribute("content", mood.colors[0]);
    }
  }, [mood]);

  const slug = mood?.slug || "standard";

  return (
    <div className={`main-container mood-${slug} d-flex flex-column min-vh-100`}>
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
