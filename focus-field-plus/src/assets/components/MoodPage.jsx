import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { SET_MOOD } from "../../redux/actions";
import FocusPlayer from "./FocusPlayer";
import BreathingExercise from "./BreathingExercise";
import RelaxBodyExercises from "./RelaxBodyExercises";
import FocusMoodInfoModal from "./FocusMoodInfoModal";
import FocusJournal from "./FocusJournal";
import FocusGoals from "./FocusGoals";
import FocusSoundScape from "./FocusSoundScape";

function MoodPage({ moodName }) {
  const [moodData, setMoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const dispatch = useDispatch();
  const allMoods = useSelector((state) => state.mood.allMoods);

  useEffect(() => {
    const loadMood = async () => {
      try {
        const res = await fetch(`/moods/${moodName}.json`);
        const data = await res.json();
        setMoodData(data);

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
      className="mood-page px-0"
      style={{
        backgroundImage: `url(${moodData.environment.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Container>
        <header className="mood-header text-white p-5 text-center position-relative">
          <div className="d-flex flex-row">
            <h1 className="display-1">{moodData.mood}</h1>
            <i
              className="bi bi-question-circle-fill ms-3"
              style={{ cursor: "pointer", fontSize: "1.5rem", verticalAlign: "middle" }}
              onClick={() => setShowInfoModal(true)}
              title="Scopri cosa puoi fare in questa sessione"
            />
          </div>

          <p className="lead mt-3">{moodData.description}</p>
        </header>

        <section className="mood-section music py-4 px-lg-4 rounded">
          <h2 className="mood-text mb-3 ps-3">
            <i className="fas fa-music me-1"></i>
            <span> - Musica</span>
          </h2>
          <FocusPlayer playlistUrl={moodData.music.playlistUrl} />
        </section>

        {moodData.journalGoals?.enabled && (
          <section className="mood-section journal py-4 px-lg-4 rounded mt-4">
            <h2 className="mood-text mb-3 ps-3">
              <i className="fas fa-pencil-alt me-1"></i>
              <span> - Definisci gli obiettivi</span>{" "}
            </h2>
            <FocusGoals goals={moodData.journalGoals} />
          </section>
        )}

        {moodData.journalPre?.enabled && (
          <section className="mood-section journal p-4 rounded mt-4">
            <h2 className="mood-text mb-3 ps-3">
              <i className="fas fa-pencil-alt me-1"></i>
              <span> - Stato di partenza</span>{" "}
            </h2>
            <FocusJournal journal={moodData.journalPre} />
          </section>
        )}

        <Row className="mt-4">
          <Col xs={12} md={6} xl={4}>
            {moodData.breathing?.enabled && (
              <section className="mood-section breathing p-4">
                <h2 className="mood-text mb-3 ps-3">
                  <i className="fas fa-lungs me-1"></i> <span> - Respirazione</span>
                </h2>
                <BreathingExercise config={moodData.breathing} />
              </section>
            )}
          </Col>
          <Col xs={12} md={6} xl={4}>
            {moodData.relaxBody?.enabled && (
              <section className="mood-section relax-body p-4 mt-4 mt-md-0">
                <h2 className="mood-text mb-3 ps-3">
                  <i className="fas fa-running me-1"></i>
                  <span> - Attività motoria</span>{" "}
                </h2>
                <RelaxBodyExercises config={moodData.relaxBody} />
              </section>
            )}
          </Col>
          <Col xs={12} md={6} xl={4}></Col>
        </Row>

        <section className="mood-section ambient p-4 mt-4">
          <h2 className="mood-text mb-3 ps-3">
            <i className="fas fa-leaf"></i>
            <span> - Ambientazione</span>{" "}
          </h2>
          <FocusSoundScape
            soundScape={moodData.environment.soundscape}
            backgroundVideo={moodData.environment.backgroundVideo}
            audioSrc={moodData.environment.audioSrc}
            suggestion={moodData.environment.suggestion}
            duration={moodData.environment.duration}
          />
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

        {moodData.journalPost?.enabled && (
          <section className="mood-section journal p-4 rounded mt-4">
            <h2 className="mood-text mb-3 ps-3">
              <i className="fas fa-pencil-alt me-1"></i>
              <span> - Stato di arrivo</span>{" "}
            </h2>
            <FocusJournal journal={moodData.journalPost} />
          </section>
        )}

        <footer className="p-4 text-center">
          <button className="btn btn-primary btn-lg">{moodData.cta.text}</button>
        </footer>

        <FocusMoodInfoModal show={showInfoModal} handleClose={() => setShowInfoModal(false)} mood={moodData} />
      </Container>
    </Container>
  );
}

export default MoodPage;
