import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { SET_MOOD } from "../../redux/actions";
import FocusPlayer from "./FocusPlayer";

function MoodPage({ moodName }) {
  const [moodData, setMoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const allMoods = useSelector((state) => state.mood.allMoods);

  useEffect(() => {
    const loadMood = async () => {
      try {
        const res = await fetch(`/moods/${moodName}.json`);
        const data = await res.json();
        setMoodData(data);

        // Cerca il mood completo da allMoods (con colori, icone, ecc.)
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
        backgroundAttachment: "fixed",
      }}
    >
      <Container>
        <header className="mood-hero text-white p-5 text-center">
          <h1 className="display-1">{moodData.mood}</h1>
          <p className="lead">{moodData.description}</p>
        </header>

        <section className="mood-section music py-4 px-lg-4 mt-5 rounded">
          <h2 className="mood-text mb-3 ps-3">🎵 Musica</h2>
          <FocusPlayer playlistUrl={moodData.music.playlistUrl} />
        </section>

        <section className="mood-section breathing p-4">
          <h2 className="mood-text mb-3 ps-3">🧘‍♀️ Respirazione</h2>
          <ul>
            {moodData.breathing.instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </section>

        <section className="mood-section journal p-4">
          <h2>✍️ Journal</h2>
          <p>{moodData.journal.prompt}</p>
          <textarea className="form-control" rows="4" />
        </section>

        {moodData.spiritual?.enabled && (
          <section className="mood-section spiritual p-4 bg-light">
            <h2>🕊️ Spunto spirituale</h2>
            <blockquote>
              <p>{moodData.spiritual.text}</p>
              <cite>{moodData.spiritual.verse}</cite>
            </blockquote>
          </section>
        )}

        <section className="mood-section ambient p-4">
          <h2>🌄 Ambientazione</h2>
          <p>Suoni: {moodData.environment.soundscape.join(", ")}</p>
        </section>

        <footer className="p-4 text-center">
          <button className="btn btn-primary btn-lg">{moodData.cta.text}</button>
        </footer>
      </Container>
    </Container>
  );
}

export default MoodPage;
