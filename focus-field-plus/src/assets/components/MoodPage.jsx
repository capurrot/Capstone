import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { SET_MOOD } from "../../redux/actions";
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
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const dispatch = useDispatch();
  const allMoods = useSelector((state) => state.mood.allMoods);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const lang = i18n.language || "it";

        // Carica il contenuto del mood
        const moodRes = await fetch(`/locales/${lang}/${moodName}.json`);
        const moodJson = await moodRes.json();

        // Carica la traduzione del mood
        const transRes = await fetch(`/locales/${lang}/${moodName}.json`);
        const transJson = await transRes.json();

        setMoodData(moodJson);
        setTranslations(transJson);

        const fullMood = allMoods.find((m) => m.slug === moodName);
        if (fullMood) {
          dispatch({ type: SET_MOOD, payload: fullMood });
        }
      } catch (error) {
        console.error("Errore nel caricamento dati del mood:", error);
        setMoodData(null);
        setTranslations({});
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [moodName, dispatch, allMoods, i18n.language]);

  if (loading) return <p>{t("moodPage.loading")}</p>;
  if (!moodData) return <p>{t("moodPage.notFound")}</p>;

  const tr = (key, fallback) => translations[key] || fallback;

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
            <h1 className="display-1">{t("name", moodData.name)}</h1>
            <i
              className="bi bi-question-circle-fill ms-3"
              style={{ cursor: "pointer", fontSize: "1.5rem" }}
              onClick={() => setShowInfoModal(true)}
              title={t("moodPage.infoModal.title")}
            />
          </div>
          <p className="lead mt-3">{t("description", moodData.description)}</p>
        </header>

        <section className="mood-section music py-4 px-lg-4 rounded">
          <h2 className="mood-text mb-3 ps-3">
            <i className="fas fa-music me-1"></i> - {t("moodPage.sections.music")}
          </h2>
          <FocusPlayer playlistUrl={moodData.music.playlistUrl} />
        </section>

        {moodData.journalGoals?.enabled && (
          <section className="mood-section journal py-4 px-lg-4 rounded mt-4">
            <h2 className="mood-text mb-3 ps-3">
              <i className="fas fa-pencil-alt me-1"></i> - {t("moodPage.sections.goals")}
            </h2>
            <FocusGoals goals={moodData.journalGoals} />
          </section>
        )}

        {moodData.journalPre?.enabled && (
          <section className="mood-section journal p-4 rounded mt-4">
            <h2 className="mood-text mb-3 ps-3">
              <i className="fas fa-pencil-alt me-1"></i> - {t("moodPage.sections.preJournal")}
            </h2>
            <FocusJournal
              journal={{ ...moodData.journalPre, prompt: tr("journalPre.prompt", moodData.journalPre.prompt) }}
            />
          </section>
        )}

        <Row className="mt-4">
          <Col xs={12} md={6} xl={4}>
            {moodData.breathing?.enabled && (
              <section className="mood-section breathing p-4">
                <h2 className="mood-text mb-3 ps-3">
                  <i className="fas fa-lungs me-1"></i> - {t("moodPage.sections.breathing")}
                </h2>
                <BreathingExercise config={moodData.breathing} moodName={moodName} />
              </section>
            )}
          </Col>
          <Col xs={12} md={6} xl={4}>
            {moodData.relaxBody?.enabled && (
              <section className="mood-section relax-body p-4 mt-4 mt-md-0">
                <h2 className="mood-text mb-3 ps-3">
                  <i className="fas fa-running me-1"></i> - {t("moodPage.sections.relaxBody")}
                </h2>
                <RelaxBodyExercises config={moodData.relaxBody} translations={translations.relaxBody} />
              </section>
            )}
          </Col>
          <Col xs={12} md={6} xl={4}>
            {moodData.coach?.enabled && (
              <section className="mood-section mental-coach p-4 mt-4 mt-md-0">
                <h2 className="mood-text mb-3 ps-3">
                  <i className="fas fa-brain me-1"></i> - {t("moodPage.sections.coach")}
                </h2>
                <FocusMentalCoach coach={moodData.coach} translations={translations.coach} />
              </section>
            )}
          </Col>
        </Row>

        <section className="mood-section ambient p-4 mt-4">
          <h2 className="mood-text mb-3 ps-3">
            <i className="fas fa-leaf"></i> - {t("moodPage.sections.ambient")}
          </h2>
          <FocusSoundScape
            soundScape={moodData.environment.soundscape}
            backgroundVideo={moodData.environment.backgroundVideo}
            audioSrc={moodData.environment.audioSrc}
            suggestion={tr("environment.suggestion", moodData.environment.suggestion)}
            duration={moodData.environment.duration}
          />
        </section>

        {moodData.spiritual?.enabled && (
          <section className="mood-section spiritual p-4 mt-4">
            <h2 className="mood-text mb-3 ps-3">
              <MdAutoStories /> - {t("moodPage.sections.spiritual")}
            </h2>
            <div className="reflection-container p-3 d-flex flex-column">
              <p className="fs-4">{tr("spiritual.text", moodData.spiritual.text)}</p>
              <cite className="ms-auto fs-4">{moodData.spiritual.verse}</cite>
            </div>
          </section>
        )}

        {moodData.journalPost?.enabled && (
          <section className="mood-section journal p-4 rounded mt-4">
            <h2 className="mood-text mb-3 ps-3">
              <i className="fas fa-pencil-alt me-1"></i> - {t("moodPage.sections.postJournal")}
            </h2>
            <FocusJournal
              journal={{ ...moodData.journalPost, prompt: tr("journalPost.prompt", moodData.journalPost.prompt) }}
            />
          </section>
        )}

        <footer className="p-4 text-center">
          <button className="focusfield-btn fs-4">
            {tr("cta.text", moodData.cta?.text) || t("moodPage.cta.default")}
          </button>
        </footer>

        <FocusMoodInfoModal show={showInfoModal} handleClose={() => setShowInfoModal(false)} mood={moodData} />
      </Container>
    </Container>
  );
}

export default MoodPage;
