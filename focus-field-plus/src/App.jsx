import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import Focusfield from "./assets/components/Focusfield.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_ALL_MOODS, SET_MOOD } from "./redux/actions/index.js";

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

  // imposto un mood per test
  useEffect(() => {
    if (mood === null) {
      dispatch({ type: SET_MOOD, payload: "focus" });
    }
  }, [dispatch, mood]);

  // fallback ai colori standard
  const colors = mood?.colors || ["#4e495d", "#ffffff", "#6c5ce7"];
  const slug = mood?.slug || "standard";

  return (
    <div
      className={`main-container mood-${slug}`}
      style={{
        "--mood-bg": colors[0],
        "--mood-text": colors[1],
        "--mood-accent": colors[2],
        "--mood-text-card": colors[3],
      }}
    >
      <Focusfield />
    </div>
  );
}

export default App;
