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
import NotFound from "./assets/components/home/NotFound.jsx";
import ForgotPasswordPage from "./assets/components/backoffice/login/ForgotPage.jsx";

function App() {
  const dispatch = useDispatch();
  const mood = useSelector((state) => state.mood.selectedMood);

  const defaultMood = {
    slug: "standard",
    name: "Standard",
    description: "Mood di default",
    background: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=1080&auto=format",
    image: "",
    icon: "bi-stars",
    opacity: 0.9,
    tag: "neutro",
    colors: [
      "#4e495d",
      "#ffffff",
      "#773923",
      "#c7c4b7",
      "#773923",
      "#4e495d",
      "#E3D6A5",
      "#FFE1B5",
      "#8FC6D5",
      "#5F95B7",
      "#4e495d",
      "#4e495d",
      "#ffffff",
      "#ffffff",
      "#ffffff",
    ],
  };

  useEffect(() => {
    dispatch(fetchAllMoods());
  }, [dispatch]);

  useEffect(() => {
    if (!mood) {
      dispatch(setMood(defaultMood));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, mood]);

  useEffect(() => {
    if (!mood) return;

    const root = document.documentElement;
    const colors = mood.colors || defaultMood.colors;

    colors.forEach((color, i) => {
      root.style.setProperty(`--mood-color-${i + 1}`, color);
    });

    root.style.setProperty("--mood-opacity", mood.opacity || defaultMood.opacity || 0.5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood]);

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && mood?.colors?.[0]) {
      meta.setAttribute("content", mood.colors[0]);
    }
  }, [mood]);

  const slug = mood?.slug || defaultMood.slug;

  return (
    <div className={`main-container mood-${slug} d-flex flex-column min-vh-100`}>
      <Routes>
        <Route path="/" element={<FocusField />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/mood/:moodName" element={<MoodPageWrapper />} />
        <Route path="/dashboard" element={<DashboardWrapper />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
