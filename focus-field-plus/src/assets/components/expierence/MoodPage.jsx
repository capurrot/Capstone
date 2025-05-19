import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { SET_MOOD } from "../../../redux/actions";
import FocusPlayer from "./FocusPlayer";
import BreathingExercise from "./BreathingExercise";
import RelaxBodyExercises from "./RelaxBodyExercises";
import FocusMoodInfoModal from "./FocusMoodInfoModal";
import FocusJournal from "./FocusJournal";
import FocusGoals from "./FocusGoals";
import FocusSoundScape from "./FocusSoundScape";
import FocusMentalCoach from "./FocusMentalCoach";
import { MdAutoStories } from "react-icons/md";

function MoodPage({ moodName }) {
  const [moodData, setMoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const dispatch = useDispatch();
  const allMoods = useSelector((state) => state.mood.allMoods);
  const { t, i18n } = useTranslation(moodName, { keyPrefix: "moodPage" });

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const lang = i18n.language?.split("-")[0] || "it";
        const res = await fetch(`${apiUrl}api/focus-field/mood/${moodName}/${lang}`);
        const json = await res.json();

        if (!res.ok || json?.error || !json?.environment) {
          console.warn("Mood non trovato o incompleto:", json);
          setMoodData(null);
        } else {
          setMoodData(json);
        }

        const fullMood = allMoods.find((m) => m.slug === moodName);
        if (fullMood) {
          dispatch({ type: SET_MOOD, payload: fullMood });
        }
      } catch (error) {
        console.error("Errore nel caricamento dati del mood:", error);
        setMoodData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moodName, dispatch, allMoods, i18n.language]);

  if (loading) return <p>{t("loading")}</p>;
  if (!moodData) {
    return (
      <Container className="text-center py-5 bg-light">
        <h2>{t("notFound", "Mood non disponibile")}</h2>
        <p>{t("translationMissing", "Questo mood non è ancora disponibile nella lingua selezionata.")}</p>

        <button className="focusfield-btn mt-4" onClick={() => window.history.back()}>
          ⬅️ {t("goBack", "Torna indietro")}
        </button>
      </Container>
    );
  }

  const tr = (key, fallback) => {
    const keys = key.split(".");
    let value = moodData;
    for (let k of keys) {
      if (value?.[k] !== undefined) {
        value = value[k];
      } else {
        return fallback;
      }
    }
    return value;
  };

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
            <h1 className="display-1">{tr("name", moodName)}</h1>
            <i
              className="bi bi-question-circle-fill ms-3"
              style={{ cursor: "pointer", fontSize: "1.5rem" }}
              onClick={() => setShowInfoModal(true)}
              title={t("infoModal.title")}
            />
          </div>
          <p className="lead mt-3">{tr("description", "")}</p>
        </header>

        <section className="mood-section music py-4 px-lg-4 rounded">
          <h2 className="mood-text mb-3 ps-3">
            <i className="fas fa-music me-1"></i> - {t("sections.music")}
          </h2>
          <FocusPlayer playlistUrl={moodData.music.playlistUrl} moodName={moodName} />
        </section>

        {moodData.journalGoals?.enabled && (
          <section className="mood-section journal py-4 px-lg-4 rounded mt-4">
            <h2 className="mood-text mb-3 ps-3">
              <i className="fas fa-pencil-alt me-1"></i> - {t("sections.goals")}
            </h2>
            <FocusGoals goals={moodData.journalGoals} moodName={moodName} />
          </section>
        )}

        {moodData.journalPre?.enabled && (
          <section className="mood-section journal p-4 rounded mt-4">
            <h2 className="mood-text mb-3 ps-3">
              <i className="fas fa-pencil-alt me-1"></i> - {t("sections.preJournal")}
            </h2>
            <FocusJournal journal={moodData.journalPre} moodName={moodName} />
          </section>
        )}

        <Row className="mt-4">
          <Col xs={12} md={6} xl={4}>
            {moodData.breathing?.enabled && (
              <section className="mood-section breathing p-4">
                <h2 className="mood-text mb-3 ps-3">
                  <i className="fas fa-lungs me-1"></i> - {t("sections.breathing")}
                </h2>
                <BreathingExercise config={moodData.breathing} moodName={moodName} />
              </section>
            )}
          </Col>
          <Col xs={12} md={6} xl={4}>
            {moodData.relaxBody?.enabled && (
              <section className="mood-section relax-body p-4 mt-4 mt-md-0">
                <h2 className="mood-text mb-3 ps-3">
                  <i className="fas fa-running me-1"></i> - {t("sections.relaxBody")}
                </h2>
                <RelaxBodyExercises config={moodData.relaxBody} moodName={moodName} />
              </section>
            )}
          </Col>
          <Col xs={12} md={6} xl={4}>
            {moodData.coach?.enabled && (
              <section className="mood-section mental-coach p-4 mt-4 mt-md-0">
                <h2 className="mood-text mb-3 ps-3">
                  <i className="fas fa-brain me-1"></i> - {t("sections.coach")}
                </h2>
                <FocusMentalCoach coach={moodData.coach} moodName={moodName} />
              </section>
            )}
          </Col>
        </Row>

        <section className="mood-section ambient p-4 mt-4">
          <h2 className="mood-text mb-3 ps-3">
            <i className="fas fa-leaf"></i> - {t("sections.ambient")}
          </h2>
          <FocusSoundScape
            soundScape={moodData.environment.soundscape}
            backgroundVideo={moodData.environment.backgroundVideo}
            audioSrc={moodData.environment.audioSrc}
            suggestion={moodData.environment.suggestion}
            duration={moodData.environment.duration}
            moodName={moodName}
          />
        </section>

        {moodData.spiritual?.enabled && (
          <section className="mood-section spiritual p-4 mt-4">
            <h2 className="mood-text mb-3 ps-3">
              <MdAutoStories /> - {t("sections.spiritual")}
            </h2>
            <div className="reflection-container p-3 d-flex flex-column">
              <p className="fs-4">{moodData.spiritual.text}</p>
              <cite className="ms-auto fs-4">{moodData.spiritual.verse}</cite>
            </div>
          </section>
        )}

        {moodData.journalPost?.enabled && (
          <section className="mood-section journal p-4 rounded mt-4">
            <h2 className="mood-text mb-3 ps-3">
              <i className="fas fa-pencil-alt me-1"></i> - {t("sections.postJournal")}
            </h2>
            <FocusJournal journal={moodData.journalPost} />
          </section>
        )}

        <footer className="p-4 text-center">
          <button className="focusfield-btn fs-4">{moodData.cta?.text || t("cta.default")}</button>
        </footer>

        <FocusMoodInfoModal show={showInfoModal} handleClose={() => setShowInfoModal(false)} mood={moodData} />
      </Container>
    </Container>
  );
}

export default MoodPage;
