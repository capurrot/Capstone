import { useEffect, useState } from "react";

function MoodPage({ moodName }) {
  const [moodData, setMoodData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/moods/" + moodName + ".json")
      .then((res) => res.json())
      .then((data) => {
        setMoodData(data);
        setLoading(false);
      });
  }, [moodName]);

  if (loading) return <p>Caricamento in corso...</p>;
  if (!moodData) return <p>Mood non trovato.</p>;

  return (
    <div className="mood-page">
      <header
        className="mood-hero text-white p-5"
        style={{
          backgroundImage: `url(/assets/bg/${moodData.environment.backgroundImage})`,
          backgroundSize: "cover",
        }}
      >
        <h1>{moodData.mood}</h1>
        <p>{moodData.description}</p>
      </header>

      <section className="mood-section music bg-light p-4">
        <h2>🎵 Musica</h2>
        <p>{moodData.music.title}</p>
        <audio controls src={moodData.music.playlistUrl}></audio>
      </section>

      <section className="mood-section breathing p-4">
        <h2>🧘‍♀️ Respirazione</h2>
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
    </div>
  );
}

export default MoodPage;
