import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import "react-h5-audio-player/lib/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { SET_MOOD } from "../../redux/actions";
import SpotifyMoodPlayer from "./SpotifyMoodPlayer";

function MoodPage({ moodName }) {
  const [moodData, setMoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const allMoods = useSelector((state) => state.mood.allMoods);

  useEffect(() => {
    const loadMood = async () => {
      try {
        const res = await fetch("/moods/" + moodName + ".json");
        const data = await res.json();
        setMoodData(data);

        // Cerca il mood completo da allMoods (con colors, icon, ecc.)
        const fullMood = allMoods.find((m) => m.slug === moodName);
        if (fullMood) {
          dispatch({ type: SET_MOOD, payload: fullMood });
        }

        setLoading(false);
      } catch (err) {
        console.error("Errore nel caricamento mood:", err);
        setLoading(false);
      }
    };

    loadMood();
  }, [moodName, dispatch, allMoods]);

  if (loading) return <p>Caricamento in corso...</p>;
  if (!moodData) return <p>Mood non trovato.</p>;

  return (
    <Container
      fluid
      className="mood-page"
      style={{
        backgroundImage: `url(${moodData.environment.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          zIndex: 1,
        }}
      />

      <Container style={{ position: "relative", zIndex: 2 }}>
        {/* Hero */}
        <header className="mood-hero text-white p-5 text-center">
          <h1>{moodData.mood}</h1>
          <p>{moodData.description}</p>
        </header>

        <section className="mood-section music p-4 mt-5 rounded bg-dark">
          <h2 className="text-white mb-3">🎵 Musica</h2>
          <SpotifyMoodPlayer moodData={moodData} />
        </section>

        {/* Breathing Section */}
        <section className="mood-section breathing p-4 mt-5 rounded bg-light text-dark">
          <h2>🧘‍♀️ Respirazione</h2>
          <ul>
            {moodData.breathing.instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </section>

        {/* Journal Section */}
        <section className="mood-section journal p-4 mt-5 rounded bg-white text-dark">
          <h2>✍️ Journal</h2>
          <p>{moodData.journal.prompt}</p>
          <textarea className="form-control" rows="4" placeholder="Scrivi qui..." />
        </section>

        {/* Spiritual Section */}
        {moodData.spiritual?.enabled && (
          <section className="mood-section spiritual p-4 mt-5 rounded bg-light text-dark">
            <h2>🕊️ Spunto spirituale</h2>
            <blockquote className="blockquote">
              <p>{moodData.spiritual.text}</p>
              <footer className="blockquote-footer">{moodData.spiritual.verse}</footer>
            </blockquote>
          </section>
        )}

        {/* Ambient Section */}
        <section className="mood-section ambient p-4 mt-5 rounded bg-white text-dark">
          <h2>🌄 Ambientazione</h2>
          <p>Suoni consigliati: {moodData.environment.soundscape.join(", ")}</p>
        </section>

        {/* Footer CTA */}
        <footer className="p-4 text-center">
          <button className="btn btn-primary btn-lg">{moodData.cta.text}</button>
        </footer>
      </Container>
    </Container>
  );
}

export default MoodPage;
