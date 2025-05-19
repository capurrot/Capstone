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
import { Link } from "react-router";

function MoodPage({ moodName, isModal }) {
  const [moodData, setMoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const allMoods = useSelector((state) => state.mood.allMoods);
  const { t, i18n } = useTranslation(moodName, { keyPrefix: "moodPage" });

  const apiUrl = import.meta.env.VITE_API_URL;
  console.log("Current location in MoodPage (before login):", location);

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
    console.log(location);

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moodName, dispatch, allMoods, i18n.language]);

  if (loading) {
    return (
      <section className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-4" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">{t("loading")}</span>
          </div>
          <p className="fs-5 text-muted">{t("loading", "Caricamento in corso...")}</p>
        </div>
      </section>
    );
  }

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

  if (!hasStarted && !isModal) {
    return (
      <Container
        fluid
        className="mood-page position-relative text-center d-flex align-items-center justify-content-center"
        style={{
          minHeight: "100vh",
          backgroundImage: `url(${moodData?.environment?.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="bg-white bg-opacity-75 p-5 rounded-4 shadow-lg text-start animate__animated animate__fadeIn"
          style={{
            maxWidth: "600px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {user ? (
            <div className="mb-4 p-4 rounded-4 bg-success bg-opacity-10 shadow-sm border border-success-subtle">
              <div className="d-flex align-items-center mb-3">
                <div
                  className="bg-success bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: "42px", height: "42px" }}
                >
                  <i className="bi bi-person-check-fill text-success fs-4"></i>
                </div>
                <div>
                  <h5 className="mb-0 fw-semibold text-success">Ciao{user?.nome ? `, ${user.nome}` : ""} 👋</h5>
                  <small className="text-muted">
                    Il tuo profilo è attivo e i progressi verranno salvati automaticamente.
                  </small>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4 p-3 rounded-3 bg-warning bg-opacity-25 border-start border-warning border-4">
              <div className="d-flex align-items-center mb-1">
                <i className="bi bi-person-plus-fill text-warning me-2 fs-5"></i>
                <span className="fw-semibold text-dark">Prima volta qui?</span>
              </div>
              <p className="mb-1 text-dark" style={{ lineHeight: "1.4" }}>
                Registrati gratuitamente per <strong>salvare i tuoi stati d’animo</strong>, le <strong>sessioni</strong>{" "}
                e i <strong>journaling</strong> così da rendere la tua esperienza unica.
              </p>
              <div className="d-flex flex-column">
                <Link to="/register" className="btn btn-warning fw-semibold mt-2">
                  <i className="bi bi-stars me-1"></i> Registrati ora
                </Link>
                <small className="mt-2 text-muted">
                  Hai già un account?{" "}
                  <Link to="/login" onClick={() => sessionStorage.setItem("redirectAfterLogin", location.pathname)}>
                    Accedi
                  </Link>
                </small>
              </div>
            </div>
          )}

          <div className="d-flex flex-column align-items-center">
            <h1 className="mb-2 fw-bold">{tr("title", moodName)}</h1>
            <p className="lead mb-4">{tr("desc", "")}</p>

            {moodData?.durationSuggestion && (
              <p className="text-muted mb-4">
                ⏱️ {t("durationSuggestionLabel", "Durata suggerita")}: {moodData.durationSuggestion}
              </p>
            )}

            <button className="focusfield-btn fs-5 px-4 py-2 mt-2" onClick={() => setHasStarted(true)}>
              {t("cta.start", "Inizia il percorso")}
            </button>
          </div>
        </div>
      </Container>
    );
  }

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
