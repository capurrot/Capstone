import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, Form, Image, Row, Spinner } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import IconPicker from "./IconPicker";
import cloneDeep from "lodash/cloneDeep";
import {
  fetchMood,
  SAVE_MOOD_RESET,
  SAVE_MOOD_START,
  SAVE_MOOD_SUCCESS,
  saveMoodAndTranslation,
  SET_DASHBOARD_MOOD_ERROR,
  setDashboardMoodField,
} from "../../../../../redux/actions";
import FocusNavBarPreview from "./preview/FocusNavBarPreview";
import FocusHeroPreview from "./preview/FocusHeroPreview";
import FocusCardsPreview from "./preview/FocusCardsPreview";

const SingleMood = ({ mood }) => {
  const dispatch = useDispatch();
  const {
    dashboardMood,
    dashboardMoodLoading,
    dashboardMoodError,
    dashboardMoodInfo,
    saveMoodLoading,
    saveMoodSuccess,
    saveMoodError,
  } = useSelector((state) => state?.mood);
  const data = dashboardMood;
  const instructions = data?.breathing?.phases || [];
  const relaxExercises = data?.relaxBody?.exercises || [];
  const coachSteps = data?.coach?.steps || [];

  const [selectedLang, setSelectedLang] = useState("it");
  const [translation, setTranslation] = useState(null);

  const [tags, setTags] = useState(mood.tag.join(", "));
  const [opacity, setOpacity] = useState(mood.opacity);
  const [colors, setColors] = useState(mood.colors);

  const [cardImage, setCardImage] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [iconMood, setIconMood] = useState("");

  const [phaseTemplates, setPhaseTemplates] = useState([]);
  const [breathingModes, setBreathingModes] = useState([]);

  const token = useSelector((state) => state.auth.token);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    loadTranslation("it");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTranslation = async (lang) => {
    dispatch({ type: SAVE_MOOD_RESET });
    dispatch({ type: SET_DASHBOARD_MOOD_ERROR, payload: null });
    setSelectedLang(lang);

    try {
      // Carica traduzione mood
      await dispatch(fetchMood(mood?.slug, lang));
      setTranslation(data);
      setCardImage(mood?.image || "");
      setHeroImage(mood?.background || "");
      setIconMood(mood?.icon || "");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const [resPhases, resModes] = await Promise.all([
        fetch(`${apiUrl}api/focus-field/breathing-phases?lang=${lang}`, { headers }),
        fetch(`${apiUrl}api/focus-field/breathing-modes?lang=${lang}`, { headers }),
      ]);

      if (!resPhases.ok) {
        const errText = await resPhases.text(); // <-- stampa l'errore reale del backend
        console.error("Errore fasi:", resPhases.status, errText);
        throw new Error("Errore nel caricamento delle fasi");
      }

      if (!resModes.ok) {
        const errText = await resModes.text(); // <-- stampa l'errore reale del backend
        console.error("Errore modes:", resModes.status, errText);
        throw new Error("Errore nel caricamento dei modes");
      }

      const dataPhases = await resPhases.json();
      const dataModes = await resModes.json();

      setPhaseTemplates(dataPhases);
      setBreathingModes(dataModes);
    } catch (err) {
      console.error(err);
      dispatch({
        type: SET_DASHBOARD_MOOD_ERROR,
        payload: "Traduzione o dati non disponibili. " + err.message,
      });
    }
  };

  const handleColorChange = (index, value) => {
    const updated = [...colors];
    updated[index] = value;
    setColors(updated);
  };

  const handleInstructionDrag = (result) => {
    if (!result?.destination) return;

    const updated = [...instructions];
    const [removed] = updated.splice(result?.source.index, 1);
    updated.splice(result?.destination.index, 0, removed);

    dispatch(setDashboardMoodField("breathing.phases", updated));
  };

  const handleSave = async () => {
    if (!translation) return;

    dispatch({ type: SAVE_MOOD_START });

    const moodListNew = {
      slug: mood.slug,
      image: cardImage,
      background: heroImage,
      tag: tags.split(",").map((t) => ({
        tag: t.trim(),
      })),
      colors: colors.map((c) => ({
        color: typeof c === "string" ? c.trim() : c.color,
      })),
      opacity: opacity,
      icon: iconMood,
    };

    const moodRequest = {
      slug: mood.slug,
      lang: selectedLang,
      name: data.name,
      description: data.description,
      imagine: data.imagine,
      helpYou: data.helpYou,
      durationSuggestion: data.durationSuggestion,
      music: {
        title: data.music.title,
        playlistUrl: data.music.playlistUrl,
        tags: data.music.tags,
        scope: data.music.scope,
      },
      breathing: {
        enabled: data.breathing.enabled,
        technique: data.breathing.technique,
        totalDuration: data.breathing.totalDuration,
        phases: data.breathing.phases,
        rounds: data.breathing.rounds,
        scope: data.breathing.scope,
        start: data.breathing.start,
        stop: data.breathing.stop,
        techniqueLabel: data.breathing.techniqueLabel,
        totalDurationLabel: data.breathing.totalDurationLabel,
      },
      relaxBody: {
        enabled: data.relaxBody.enabled,
        description: data.relaxBody.description,
        pauseDuration: data.relaxBody.pauseDuration,
        exercises: data.relaxBody.exercises,
        title: data.relaxBody.title,
        scrollDown: data.relaxBody.scrollDown,
        scrollUp: data.relaxBody.scrollUp,
        completed: data.relaxBody.completed,
        repeatIn: data.relaxBody.repeatIn,
        start: data.relaxBody.start,
        stop: data.relaxBody.stop,
        pause: data.relaxBody.pause,
        pauseText: data.relaxBody.pauseText,
        duration: data.relaxBody.duration,
      },
      journalPre: {
        enabled: data.journalPre.enabled,
        prompt: data.journalPre.prompt,
        placeholder: data.journalPre.placeholder,
        save: data.journalPre.save,
        optional: data.journalPre.optional,
      },
      journalPost: {
        enabled: data.journalPost.enabled,
        prompt: data.journalPost.prompt,
        placeholder: data.journalPost.placeholder,
        save: data.journalPost.save,
        optional: data.journalPost.optional,
      },
      spiritual: {
        enabled: data.spiritual.enabled,
        type: data.spiritual.type,
        verse: data.spiritual.verse,
        text: data.spiritual.text,
      },
      coach: {
        enabled: data.coach.enabled,
        intro: data.coach.intro,
        obstacle: data.coach.obstacle,
        situation: data.coach.situation,
        feedback: data.coach.feedback,
        next: data.coach.next,
        finished: data.coach.finished,
        noSteps: data.coach.noSteps,
        steps: data.coach.steps,
      },
      environment: {
        enabled: data.environment.enabled,
        title: data.environment.title,
        suggestion: data.environment.suggestion,
        duration: data.environment.duration,
        suggestedDuration: data.environment.suggestedDuration,
        backgroundImage: data.environment.backgroundImage,
        backgroundVideo: data.environment.backgroundVideo,
        audioSrc: data.environment.audioSrc,
        soundscape: Array.isArray(data.environment.soundscape)
          ? data.environment.soundscape
          : (data.environment.soundscape || "")
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
        start: data.environment.start,
        stop: data.environment.stop,
        mute: data.environment.mute,
        unmute: data.environment.unmute,
        fullscreen: data.environment.fullscreen,
        exitFullscreen: data.environment.exitFullscreen,
      },
      moodModal: {
        loading: data.moodModal.loading,
        notFound: data.moodModal.notFound,
        infoModal: {
          title: data.moodModal.infoModal.title,
        },
        ctaModal: {
          defaultText: data.moodModal.ctaModal.defaultText,
        },
        title: {
          calm: data.moodModal.title.calm,
        },
        desc: {
          calm: data.moodModal.desc.calm,
        },
        sections: data.moodModal.sections,
      },
      cta: {
        actionCta: data.cta.actionCta,
        text: data.cta.text,
      },
      moodListId: mood.id,
    };

    dispatch(saveMoodAndTranslation(mood.id, moodListNew, moodRequest, token, selectedLang)).then(() => {
      dispatch({ type: SAVE_MOOD_SUCCESS });
    });
  };

  return (
    <Container className="my-5 px-0">
      <Card className="px-4 px-md-4 py-4  shadow-lg rounded-4 bg-light text-muted">
        {dashboardMoodLoading && (
          <div className="text-center my-5">
            <Spinner animation="border" />
            <p className="mt-2 text-muted">Caricamento della traduzione...</p>
          </div>
        )}
        {dashboardMoodInfo && (
          <Alert variant="info" className="text-center">
            <i className="bi bi-info-circle-fill me-2"></i>
            {dashboardMoodInfo}
          </Alert>
        )}
        <Row className="align-items-center ">
          <Col md={6}>
            <h4 className="text-capitalize d-flex align-items-center gap-2 fw-semibold display-6">
              <i className={`bi ${mood?.icon} fs-4 text-secondary`}></i>
              {mood.slug}
              <Badge bg="secondary" className="ms-2">{`#${mood?.id}`}</Badge>
            </h4>
          </Col>
          <Col md={6} className="text-end">
            {["it", "en", "fr", "es", "de"].map((lang) => (
              <Button
                key={lang}
                variant={selectedLang === lang ? "primary" : "outline-primary"}
                className="me-2"
                size="sm"
                onClick={() => loadTranslation(lang)}
              >
                {
                  {
                    it: "🇮🇹",
                    en: "🇬🇧",
                    fr: "🇫🇷",
                    es: "🇪🇸",
                    de: "🇩🇪",
                  }[lang]
                }
              </Button>
            ))}
          </Col>
        </Row>
        <hr />
        <h5 className="mb-4 fs-2">
          <i className="bi bi-card-list me-2"></i> Generali
        </h5>

        {translation && (
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formName">
                  <Form.Label className="fw-bold">Nome</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.name}
                    onChange={(e) => dispatch(setDashboardMoodField("name", e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formDurationSuggestion">
                  <Form.Label className="fw-bold">Durata suggerita</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.durationSuggestion}
                    onChange={(e) => dispatch(setDashboardMoodField("durationSuggestion", e.target.value))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formDescription">
                  <Form.Label className="fw-bold">Descrizione</Form.Label>
                  <Form.Control
                    as="textarea"
                    style={{ height: "115px" }}
                    value={data?.description}
                    onChange={(e) => dispatch(setDashboardMoodField("description", e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formOpacity" className="mb-2">
                  <Form.Label className="fw-bold">Trasparenza</Form.Label>
                  <Form.Control type="number" step="0.1" value={opacity} onChange={(e) => setOpacity(e.target.value)} />
                </Form.Group>
                <IconPicker iconMood={iconMood} setIconMood={setIconMood} />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formImagine">
                  <Form.Label className="fw-bold">Immagina</Form.Label>
                  <Form.Control
                    as="textarea"
                    style={{ height: "115px" }}
                    value={data?.imagine}
                    onChange={(e) => dispatch(setDashboardMoodField("imagine", e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formHelpYou">
                  <Form.Label className="fw-bold">Aiuto</Form.Label>
                  <Form.Control
                    as="textarea"
                    style={{ height: "115px" }}
                    value={data?.helpYou}
                    onChange={(e) => dispatch(setDashboardMoodField("helpYou", e.target.value))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4" controlId="formTags">
              <Form.Label className="fw-bold">Tags (separati da virgola)</Form.Label>
              <Form.Control type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
            </Form.Group>
            <hr />

            <hr />
            <h5 className="mb-4 fs-2">
              <i className="bi bi-ui-checks-grid me-2"></i> Modale informativo
            </h5>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Testo "Loading..."</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.moodModal?.loading}
                    onChange={(e) => dispatch(setDashboardMoodField("moodModal.loading", e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Testo "Non trovato"</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.moodModal?.notFound}
                    onChange={(e) => dispatch(setDashboardMoodField("moodModal.notFound", e.target.value))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Titolo finestra informativa</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.moodModal?.title?.calm}
                    onChange={(e) => dispatch(setDashboardMoodField("moodModal.title.calm", e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Testo predefinito pulsante CTA</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.moodModal?.ctaModal?.defaultText}
                    onChange={(e) => dispatch(setDashboardMoodField("moodModal.ctaModal.defaultText", e.target.value))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              {/*               <Col md={6}>
                <Form.Group>
                  <Form.Label>Titolo (specifico per {mood.slug})</Form.Label>
                  <Form.Control type="text" value={modalTitle} onChange={(e) => setModalTitle(e.target.value)} />
                </Form.Group>
              </Col> */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Descrizione (specifica per {mood?.slug})</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.moodModal?.desc?.calm}
                    onChange={(e) => dispatch(setDashboardMoodField("moodModal.desc.calm", e.target.value))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h6 className="fw-bold mt-4 mb-3">Etichette sezioni</h6>
            {Object.entries(data?.moodModal?.sections).map(
              ([key, value]) =>
                key !== "id" && (
                  <Form.Group key={key} className="mb-2">
                    <Form.Label>{key}</Form.Label>
                    <Form.Control
                      type="text"
                      value={value}
                      onChange={(e) => dispatch(setDashboardMoodField(`moodModal.sections.${key}`, e.target.value))}
                    />
                  </Form.Group>
                )
            )}

            <hr />

            <h5 className="mb-4 fs-2">
              <i className="bi bi-palette me-2"></i> Paletta dei colori
            </h5>
            <Row className="mb-4">
              <Col md={2}>
                {colors?.map((color, i) => (
                  <Row key={i} className="mb-2 text-center align-items-center">
                    <Col xs={12} className="d-flex align-items-center justify-content-between">
                      <Form.Label className="fw-semibold mb-0" style={{ minWidth: "3rem" }}>
                        #{i + 1}
                      </Form.Label>
                      <div className="d-flex align-items-center gap-2 w-100">
                        <Form.Control
                          type="color"
                          value={color}
                          onChange={(e) => handleColorChange(i, e.target.value)}
                          title={`Seleziona colore ${i + 1}`}
                        />
                        <Form.Control
                          type="text"
                          value={color}
                          onChange={(e) => handleColorChange(i, e.target.value)}
                          placeholder="#RRGGBB"
                          className="text-center"
                        />
                      </div>
                    </Col>
                  </Row>
                ))}
              </Col>
              <Col md={5}>
                <div className="border rounded-3 shadow-sm p-2 bg-white">
                  <div className="d-flex align-items-center mb-1 ms-0">
                    <Form.Control
                      type="color"
                      value={colors[0]}
                      onChange={(e) => handleColorChange(0, e.target.value)}
                      style={{ pointerEvents: "none", padding: "0" }}
                    />
                    <Form.Label className="fw-bold mb-0 ms-2">#1</Form.Label>
                  </div>

                  <div
                    className="p-0 border rounded-3 shadow-sm"
                    style={{
                      background: `linear-gradient(
        135deg,
        ${colors[0]} 0%,      
        ${colors[0]} 30%,     
        ${colors[2]} 70%,    
        ${colors[2]} 100%     
      )`,
                      transform: "scale(1)",
                      transformOrigin: "top center",
                      width: "100%",
                      height: "36rem",
                      overflow: "hidden",
                    }}
                  >
                    <FocusNavBarPreview mood={mood} colors={colors} />
                    <FocusHeroPreview mood={mood} colors={colors} />
                    <FocusCardsPreview colors={colors} />
                  </div>

                  <div className="d-flex align-items-center mt-1">
                    <Form.Label className="fw-bold mb-0 ms-auto">#3</Form.Label>
                    <Form.Control
                      type="color"
                      value={colors[2]}
                      onChange={(e) => handleColorChange(2, e.target.value)}
                      style={{ pointerEvents: "none", padding: "0" }}
                      className="ms-2"
                    />
                  </div>
                </div>
              </Col>
            </Row>

            <hr />
            <h5 className="mb-4 fs-2">
              <i className="bi bi-images me-2"></i> Immagini
            </h5>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Immagine mood card</Form.Label>
                  <Form.Control type="text" value={cardImage} onChange={(e) => setCardImage(e.target.value)} />
                  <a href={cardImage} target="_blank" rel="noreferrer" className="d-block mt-2">
                    {cardImage}
                  </a>
                  <Image src={cardImage} thumbnail className="mt-2 mx-auto" style={{ maxHeight: "26rem" }} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Immagine sezione hero</Form.Label>
                  <Form.Control type="text" value={heroImage} onChange={(e) => setHeroImage(e.target.value)} />
                  <a href={heroImage} target="_blank" rel="noreferrer" className="d-block mt-2">
                    {heroImage}
                  </a>
                  <Image src={heroImage} thumbnail className="mt-2 mx-auto" style={{ maxHeight: "26rem" }} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        )}

        <hr />

        {translation?.music && (
          <>
            <h5 className="mb-4 fs-2">
              <i className="bi bi-music-note-beamed me-2"></i> Musica consigliata
            </h5>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Titolo Playlist</Form.Label>
              <Form.Control
                type="text"
                value={data?.music?.title}
                onChange={(e) => dispatch(setDashboardMoodField("music.title", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">URL Playlist</Form.Label>
              <Form.Control
                type="text"
                value={data?.music?.playlistUrl}
                onChange={(e) => dispatch(setDashboardMoodField("music.playlistUrl", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Tag musicali</Form.Label>
              <Form.Control
                type="text"
                value={data?.music?.tags}
                onChange={(e) =>
                  dispatch(
                    setDashboardMoodField(
                      "music.tags",
                      e.target.value.split(",").map((t) => t.trim())
                    )
                  )
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Scopo della musica</Form.Label>
              <Form.Control
                type="text"
                value={data?.music?.scope}
                onChange={(e) => dispatch(setDashboardMoodField("music.scope", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Etichetta Audius</Form.Label>
              <Form.Control
                type="text"
                value={data?.music?.audius}
                onChange={(e) => dispatch(setDashboardMoodField("music.audius", e.target.value))}
              />
            </Form.Group>
          </>
        )}

        <hr />
        {translation?.breathing && (
          <>
            <h5 className="mb-4 fs-2">
              <i className="bi bi-lungs-fill me-2"></i> Respirazione
            </h5>
            <Form.Check
              type="switch"
              id="enabledBreathing"
              label="Abilitato"
              checked={data?.breathing?.enabled}
              onChange={(e) => dispatch(setDashboardMoodField("breathing.enabled", e.target.checked))}
              className="mb-2"
            />
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="technique">
                  <Form.Label className="fw-bold">Tecnica</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.breathing?.technique}
                    onChange={(e) => dispatch(setDashboardMoodField("breathing.technique", e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="duration">
                  <Form.Label className="fw-bold">Durata (secondi)</Form.Label>
                  <Form.Control
                    type="number"
                    value={data?.breathing?.totalDuration}
                    onChange={(e) => dispatch(setDashboardMoodField("breathing.totalDuration", e.target.value))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="rounds">
                  <Form.Label className="fw-bold">Round</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.breathing?.rounds}
                    onChange={(e) => dispatch(setDashboardMoodField("breathing.rounds", e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="scope">
                  <Form.Label className="fw-bold">Scopo</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.breathing?.scope}
                    onChange={(e) => dispatch(setDashboardMoodField("breathing.scope", e.target.value))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="startLabel">
                  <Form.Label className="fw-bold">Etichetta Avvio</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.breathing?.start}
                    onChange={(e) => dispatch(setDashboardMoodField("breathing.start", e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="stopLabel">
                  <Form.Label className="fw-bold">Etichetta Ferma</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.breathing?.stop}
                    onChange={(e) => dispatch(setDashboardMoodField("breathing.stop", e.target.value))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="startLabel">
                  <Form.Label className="fw-bold">Etichetta Durata</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.breathing?.totalDuration}
                    onChange={(e) => dispatch(setDashboardMoodField("breathing.totalDuration", e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="stopLabel">
                  <Form.Label className="fw-bold">Etichetta "Tecnica"</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.breathing?.techniqueLabel}
                    onChange={(e) => dispatch(setDashboardMoodField("breathing.techniqueLabel", e.target.value))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="p-3 bg-white border rounded-4 shadow-sm">
              <Form.Label className="fw-bold d-block mb-2 text-center">
                Fasi della respirazione (trascinabili)
              </Form.Label>

              <DragDropContext onDragEnd={handleInstructionDrag}>
                <Droppable droppableId="instructions-droppable">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {instructions.map((phase, idx) => (
                        <Draggable key={idx} draggableId={`instruction-${idx}`} index={idx}>
                          {(provided) => (
                            <Row
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="align-items-center py-2 mb-2 border-bottom mx-5"
                            >
                              <Col xs={1} className="text-center">
                                <i className="bi bi-grip-vertical text-muted"></i>
                              </Col>
                              <Col md={4}>
                                <Form.Select
                                  value={phase.phase}
                                  onChange={(e) => {
                                    const selectedPhase = e.target.value;
                                    const selectedLabel =
                                      phaseTemplates.find((p) => p.phase === selectedPhase)?.phaseLabel || "";

                                    const updated = cloneDeep(instructions);
                                    updated[idx].phase = selectedPhase;
                                    updated[idx].phaseLabel = selectedLabel;

                                    dispatch(setDashboardMoodField("breathing.phases", updated));
                                  }}
                                >
                                  <option value="">Seleziona una fase</option>
                                  {phaseTemplates.map((template, i) => (
                                    <option key={i} value={template.phase}>
                                      {template.phaseLabel}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Col>
                              <Col md={2}>
                                <Form.Control
                                  type="number"
                                  value={phase.duration}
                                  onChange={(e) => {
                                    const updated = cloneDeep(instructions);
                                    updated[idx].duration = parseInt(e.target.value);
                                    dispatch(setDashboardMoodField("breathing.phases", updated));
                                  }}
                                />
                              </Col>
                              <Col md={4}>
                                <Form.Select
                                  value={phase.mode}
                                  onChange={(e) => {
                                    const updated = cloneDeep(instructions);
                                    updated[idx].mode = e.target.value;
                                    dispatch(setDashboardMoodField("breathing.phases", updated));
                                  }}
                                >
                                  <option value="">Seleziona una modalità</option>
                                  {breathingModes.map((mode, i) => (
                                    <option key={i} value={mode.name}>
                                      {mode.name}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Col>
                              <div className="col-1 text-center">
                                <Button
                                  variant="danger"
                                  className="fs-3 rounded-circle d-inline-flex align-items-center justify-content-center"
                                  style={{ width: 25, height: 25 }}
                                  onClick={() => {
                                    const updated = cloneDeep(instructions);
                                    updated.splice(idx, 1);
                                    dispatch(setDashboardMoodField("breathing.phases", updated));
                                  }}
                                >
                                  <i className="fas fa-minus fs-6"></i>
                                </Button>
                              </div>
                            </Row>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <div className="text-end mt-3">
                <Button
                  variant="success"
                  className="fs-1 rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ width: 40, height: 40 }}
                  onClick={() => {
                    const updated = [...instructions, { phaseLabel: "", duration: 0, mode: "" }];
                    dispatch(setDashboardMoodField("breathing.phases", updated));
                  }}
                >
                  <i className="fas fa-plus fs-4"></i>
                </Button>
              </div>
            </div>
          </>
        )}
        <hr />

        {translation?.relaxBody && (
          <>
            <hr />
            <h5 className="mb-4 fs-2">
              <i className="bi bi-person-arms-up me-2"></i> Rilassamento fisico
            </h5>

            <Form.Check
              type="switch"
              id="enabledRelaxBody"
              label="Abilitato"
              checked={data?.relaxBody?.enabled}
              onChange={(e) => dispatch(setDashboardMoodField("relaxBody.enabled", e.target.checked))}
              className="mb-2"
            />

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Titolo</Form.Label>
              <Form.Control
                type="text"
                value={data?.relaxBody?.title}
                onChange={(e) => dispatch(setDashboardMoodField("relaxBody.title", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={data?.relaxBody?.description}
                onChange={(e) => dispatch(setDashboardMoodField("relaxBody.description", e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Scorri verso il basso</Form.Label>
              <Form.Control
                type="text"
                value={data?.relaxBody?.scrollDown}
                onChange={(e) => dispatch(setDashboardMoodField("relaxBody.scrollDown", e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Torna su</Form.Label>
              <Form.Control
                type="text"
                value={data?.relaxBody?.scrollUp}
                onChange={(e) => dispatch(setDashboardMoodField("relaxBody.scrollUp", e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Messaggio completato</Form.Label>
              <Form.Control
                type="text"
                value={data?.relaxBody?.completed}
                onChange={(e) => dispatch(setDashboardMoodField("relaxBody.completed", e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Ripeti tra</Form.Label>
              <Form.Control
                type="text"
                value={data?.relaxBody?.repeatIn}
                onChange={(e) => dispatch(setDashboardMoodField("relaxBody.repeatIn", e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Testo "Durata:"</Form.Label>
              <Form.Control
                type="text"
                value={data?.relaxBody?.duration}
                onChange={(e) => dispatch(setDashboardMoodField("relaxBody.duration", e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Etichetta "Start"</Form.Label>
              <Form.Control
                type="text"
                value={data?.relaxBody?.start}
                onChange={(e) => dispatch(setDashboardMoodField("relaxBody.start", e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Etichetta "Stop"</Form.Label>
              <Form.Control
                type="text"
                value={data?.relaxBody?.stop}
                onChange={(e) => dispatch(setDashboardMoodField("relaxBody.stop", e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Etichetta "Pause"</Form.Label>
              <Form.Control
                type="text"
                value={data?.relaxBody?.pause}
                onChange={(e) => dispatch(setDashboardMoodField("relaxBody.pause", e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Testo periodo di pausa</Form.Label>
              <Form.Control
                type="text"
                value={data?.relaxBody?.pauseText}
                onChange={(e) => dispatch(setDashboardMoodField("relaxBody.pauseText", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Durata pausa tra esercizi (secondi)</Form.Label>
              <Form.Control
                type="number"
                value={data?.relaxBody?.pauseDuration}
                onChange={(e) => dispatch(setDashboardMoodField("relaxBody.pauseDuration", e.target.value))}
              />
            </Form.Group>

            <Form.Label className="fw-bold mt-4 mb-2">Esercizi</Form.Label>

            {relaxExercises.map((exercise, index) => (
              <Card className="mb-3 p-3 shadow-sm text-muted" key={index}>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="position-absolute top-0 end-0 m-2"
                  onClick={() => {
                    const updated = relaxExercises.filter((_, i) => i !== index);
                    dispatch(setDashboardMoodField("relaxBody.exercises", updated));
                  }}
                >
                  <i className="bi bi-trash"></i>
                </Button>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label className="fw-bold">Nome</Form.Label>
                      <Form.Control
                        type="text"
                        value={exercise.name}
                        onChange={(e) => {
                          const updated = [...relaxExercises];
                          updated[index] = { ...updated[index], name: e.target.value };
                          dispatch(setDashboardMoodField("relaxBody.exercises", updated));
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="fw-bold">Istruzioni</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={exercise.instructions}
                        onChange={(e) => {
                          const updated = [...relaxExercises];
                          updated[index] = { ...updated[index], instructions: e.target.value };
                          dispatch(setDashboardMoodField("relaxBody.exercises", updated));
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="fw-bold">Durata (secondi)</Form.Label>
                      <Form.Control
                        type="number"
                        value={exercise.duration}
                        onChange={(e) => {
                          const updated = [...relaxExercises];
                          updated[index] = { ...updated[index], duration: parseInt(e.target.value) };
                          dispatch(setDashboardMoodField("relaxBody.exercises", updated));
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="text-center">
                    <Form.Group>
                      <Form.Label className="fw-bold">Immagine</Form.Label>
                      <Form.Control
                        type="text"
                        value={exercise.image}
                        onChange={(e) => {
                          const updated = [...relaxExercises];
                          updated[index] = { ...updated[index], image: e.target.value };
                          dispatch(setDashboardMoodField("relaxBody.exercises", updated));
                        }}
                      />
                      <a href={exercise.image} target="_blank" rel="noreferrer" className="d-block mt-2">
                        {exercise.image}
                      </a>
                      <Image
                        src={exercise.image}
                        thumbnail
                        className="mt-2 bg-secondary"
                        style={{ maxWidth: "11rem" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
            ))}

            <div className="text-end mt-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => {
                  const updated = [...relaxExercises, { name: "", instructions: "", duration: 0, image: "" }];
                  dispatch(setDashboardMoodField("relaxBody.exercises", updated));
                }}
              >
                + Aggiungi un esercizio
              </Button>
            </div>
          </>
        )}

        {translation?.journalPre && (
          <>
            <hr />
            <h5 className="mb-4 fs-2">
              <i className="bi bi-journal-text me-2"></i> Diario – Prima della sessione
            </h5>

            <Form.Check
              type="switch"
              id="enabledJournalPre"
              label="Abilitato"
              checked={data?.journalPre?.enabled}
              onChange={(e) => dispatch(setDashboardMoodField("journalPre.enabled", e.target.checked))}
              className="mb-2"
            />

            <Form.Group className="mb-3">
              <Form.Label>Prompt</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={data?.journalPre?.prompt}
                onChange={(e) => dispatch(setDashboardMoodField("journalPre.prompt", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Placeholder</Form.Label>
              <Form.Control
                type="text"
                value={data?.journalPre?.placeholder}
                onChange={(e) => dispatch(setDashboardMoodField("journalPre.placeholder", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etichetta Salvataggio</Form.Label>
              <Form.Control
                type="text"
                value={data?.journalPre?.save}
                onChange={(e) => dispatch(setDashboardMoodField("journalPre.save", e.target.value))}
              />
            </Form.Group>

            <Form.Check
              type="switch"
              id="optionalJournalPre"
              label="Facoltativo"
              checked={data?.journalPre?.optional}
              onChange={(e) => dispatch(setDashboardMoodField("journalPre.optional", e.target.checked))}
            />
          </>
        )}

        {translation?.journalGoals && (
          <>
            <hr />
            <h5 className="mb-4 fs-2">
              <i className="bi bi-bullseye me-2"></i> Obiettivi del Giorno
            </h5>

            <Form.Check
              type="switch"
              id="enabledJournalGoals"
              label="Abilitato"
              checked={data?.journalGoals?.enabled}
              onChange={(e) => dispatch(setDashboardMoodField("journalGoals.enabled", e.target.checked))}
              className="mb-2"
            />

            <Form.Group className="mb-3">
              <Form.Label>Prompt</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={data?.journalGoals?.prompt}
                onChange={(e) => dispatch(setDashboardMoodField("journalGoals.prompt", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Placeholder</Form.Label>
              <Form.Control
                type="text"
                value={data?.journalGoals?.placeholder}
                onChange={(e) => dispatch(setDashboardMoodField("journalGoals.placeholder", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etichetta Salvataggio</Form.Label>
              <Form.Control
                type="text"
                value={data?.journalGoals?.save}
                onChange={(e) => dispatch(setDashboardMoodField("journalGoals.save", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etichetta Obiettivo (es. "Obiettivo n. {"{{index}}"}")</Form.Label>
              <Form.Control
                type="text"
                value={data?.journalGoals?.goalLabel}
                onChange={(e) => dispatch(setDashboardMoodField("journalGoals.goalLabel", e.target.value))}
              />
            </Form.Group>

            <Form.Check
              type="switch"
              id="optionalJournalGoals"
              label="Facoltativo"
              checked={data?.journalGoals?.optional}
              onChange={(e) => dispatch(setDashboardMoodField("journalGoals.optional", e.target.checked))}
            />

            {data?.journalGoals?.goals.map((goal, index) => (
              <div key={index} className="border rounded p-3 mb-3">
                <Form.Group className="mb-2">
                  <Form.Label>{data?.journalGoals?.goalLabel.replace("{{index}}", index + 1)}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Obiettivo"
                    value={goal.goal}
                    onChange={(e) =>
                      dispatch(setDashboardMoodField(`journalGoals.goals.${index}.goal`, e.target.value))
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Cosa farai per raggiungerlo?</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Come"
                    value={goal.how}
                    onChange={(e) => dispatch(setDashboardMoodField(`journalGoals.goals.${index}.how`, e.target.value))}
                  />
                </Form.Group>
              </div>
            ))}

            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                onClick={() =>
                  dispatch(
                    setDashboardMoodField(`journalGoals.goals`, [...data.journalGoals.goals, { goal: "", how: "" }])
                  )
                }
              >
                + Aggiungi Obiettivo
              </Button>
              {data?.journalGoals?.goals.length > 0 && (
                <Button
                  variant="outline-danger"
                  onClick={() =>
                    dispatch(setDashboardMoodField(`journalGoals.goals`, data?.journalGoals?.goals.slice(0, -1)))
                  }
                >
                  - Rimuovi ultimo
                </Button>
              )}
            </div>
          </>
        )}

        {translation?.journalPost && (
          <>
            <hr />
            <h5 className="mb-4 fs-2">
              <i className="bi bi-journal-check me-2"></i> Diario – Dopo la sessione
            </h5>

            <Form.Check
              type="switch"
              id="enabledJournalPost"
              label="Abilitato"
              checked={data?.journalPost?.enabled}
              onChange={(e) => dispatch(setDashboardMoodField("journalPost.enabled", e.target.checked))}
              className="mb-2"
            />

            <Form.Group className="mb-3">
              <Form.Label>Prompt</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={data?.journalPost?.prompt}
                onChange={(e) => dispatch(setDashboardMoodField("journalPost.prompt", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Placeholder</Form.Label>
              <Form.Control
                type="text"
                value={data?.journalPost?.placeholder}
                onChange={(e) => dispatch(setDashboardMoodField("journalPost.placeholder", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etichetta Salvataggio</Form.Label>
              <Form.Control
                type="text"
                value={data?.journalPost?.save}
                onChange={(e) => dispatch(setDashboardMoodField("journalPost.save", e.target.value))}
              />
            </Form.Group>

            <Form.Check
              type="switch"
              id="optionalJournalPost"
              label="Facoltativo"
              checked={data?.journalPost?.optional}
              onChange={(e) => dispatch(setDashboardMoodField("journalPost.optional", e.target.checked))}
            />
          </>
        )}

        {translation?.spiritual && (
          <>
            <hr />
            <h5 className="mb-4 fs-2">
              <i className="bi bi-book me-2"></i> Contenuto spirituale
            </h5>

            <Form.Check
              type="switch"
              id="enabledSpiritual"
              label="Abilitato"
              checked={data?.spiritual?.enabled}
              onChange={(e) => dispatch(setDashboardMoodField("spiritual.enabled", e.target.checked))}
              className="mb-2"
            />

            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                type="text"
                value={data?.spiritual?.type}
                onChange={(e) => dispatch(setDashboardMoodField("spiritual.type", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Versetto</Form.Label>
              <Form.Control
                type="text"
                value={data?.spiritual?.verse}
                onChange={(e) => dispatch(setDashboardMoodField("spiritual.verse", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Testo</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={data?.spiritual?.text}
                onChange={(e) => dispatch(setDashboardMoodField("spiritual.text", e.target.value))}
              />
            </Form.Group>
          </>
        )}

        {translation?.coach && (
          <>
            <hr />
            <h5 className="mb-4 fs-2">
              <i className="bi bi-person-walking me-2"></i> Percorso mentale (Coach)
            </h5>

            <Form.Check
              type="switch"
              id="enabledCoach"
              label="Abilitato"
              checked={data?.coach?.enabled}
              onChange={(e) => dispatch(setDashboardMoodField("coach.enabled", e.target.checked))}
              className="mb-2"
            />

            <Form.Group className="mb-3">
              <Form.Label>Introduzione</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={data?.coach?.intro}
                onChange={(e) => dispatch(setDashboardMoodField("coach.intro", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etichetta ostacolo</Form.Label>
              <Form.Control
                type="text"
                value={data?.coach?.obstacle}
                onChange={(e) => dispatch(setDashboardMoodField("coach.obstacle", e.target.value))}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etichetta “Situazione”</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.coach?.situation}
                    onChange={(e) => dispatch(setDashboardMoodField("coach.situation", e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etichetta “Feedback”</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.coach?.feedback}
                    onChange={(e) => dispatch(setDashboardMoodField("coach.feedback", e.target.value))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pulsante “Avanti”</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.coach?.next}
                    onChange={(e) => dispatch(setDashboardMoodField("coach.next", e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Messaggio finale</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.coach?.finished}
                    onChange={(e) => dispatch(setDashboardMoodField("coach.finished", e.target.value))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Messaggio se non ci sono percorsi</Form.Label>
              <Form.Control
                type="text"
                value={data?.coach?.noSteps}
                onChange={(e) => dispatch(setDashboardMoodField("coach.noSteps", e.target.value))}
              />
            </Form.Group>

            <h6 className="fw-bold mt-4">Situazioni</h6>
            {coachSteps.map((step, idx) => (
              <Card key={step.id || idx} className="mb-3 p-3 shadow-sm position-relative">
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="position-absolute top-0 end-0 m-2"
                  onClick={() => {
                    const updated = coachSteps.filter((_, i) => i !== idx);
                    dispatch(setDashboardMoodField("coach.steps", updated));
                  }}
                >
                  <i className="bi bi-trash"></i>
                </Button>

                <Form.Group>
                  <Form.Label>Sfida #{idx + 1}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={step.situation}
                    onChange={(e) => {
                      const updated = [...coachSteps];
                      updated[idx] = { ...updated[idx], situation: e.target.value };
                      dispatch(setDashboardMoodField("coach.steps", updated));
                    }}
                  />
                </Form.Group>

                <Form.Label className="fw-bold mt-3">Risposte</Form.Label>
                {step.answers?.map((answer, answerIdx) => (
                  <Row key={answer.id || answerIdx} className="mb-2 align-items-center">
                    <Col md={1} />
                    <Col md={4}>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={answer.text}
                        onChange={(e) => {
                          const updated = [...coachSteps];
                          const answers = [...updated[idx].answers];
                          answers[answerIdx] = { ...answers[answerIdx], text: e.target.value };
                          updated[idx] = { ...updated[idx], answers };
                          dispatch(setDashboardMoodField("coach.steps", updated));
                        }}
                        placeholder="Testo della risposta"
                      />
                    </Col>
                    <Col md={2} className="d-flex justify-content-center">
                      <Form.Check
                        type="checkbox"
                        label="Corretta"
                        checked={answer.correct}
                        onChange={(e) => {
                          const updated = [...coachSteps];
                          const answers = [...updated[idx].answers];
                          answers[answerIdx] = { ...answers[answerIdx], correct: e.target.checked };
                          updated[idx] = { ...updated[idx], answers };
                          dispatch(setDashboardMoodField("coach.steps", updated));
                        }}
                      />
                    </Col>
                    <Col md={4} className="text-center">
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={answer.feedback}
                        onChange={(e) => {
                          const updated = [...coachSteps];
                          const answers = [...updated[idx].answers];
                          answers[answerIdx] = { ...answers[answerIdx], feedback: e.target.value };
                          updated[idx] = { ...updated[idx], answers };
                          dispatch(setDashboardMoodField("coach.steps", updated));
                        }}
                        placeholder="Feedback (opzionale)"
                      />
                    </Col>
                    <Col md={1}>
                      <Button
                        variant="danger"
                        className="fs-3 rounded-circle d-inline-flex align-items-center justify-content-center"
                        style={{ width: 25, height: 25 }}
                        onClick={() => {
                          const updated = [...coachSteps];
                          const answers = [...updated[idx].answers];
                          answers.splice(answerIdx, 1);
                          updated[idx] = { ...updated[idx], answers };
                          dispatch(setDashboardMoodField("coach.steps", updated));
                        }}
                      >
                        <i className="fas fa-minus fs-6"></i>
                      </Button>
                    </Col>
                  </Row>
                ))}

                <div className="text-end mt-2">
                  <Button
                    variant="success"
                    className="fs-1 rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: 40, height: 40 }}
                    onClick={() => {
                      const updated = [...coachSteps];
                      const answers = [...(updated[idx].answers || [])];
                      answers.push({ text: "", correct: false, feedback: "" });
                      updated[idx] = { ...updated[idx], answers };
                      dispatch(setDashboardMoodField("coach.steps", updated));
                    }}
                  >
                    <i className="fas fa-plus fs-4"></i>
                  </Button>
                </div>
              </Card>
            ))}

            <div className="text-end">
              <Button
                variant="outline-primary"
                onClick={() =>
                  dispatch(setDashboardMoodField("coach.steps", [...coachSteps, { situation: "", answers: [] }]))
                }
              >
                + Aggiungi situazione
              </Button>
            </div>
          </>
        )}

        {translation?.environment && (
          <>
            <hr />
            <h5 className="mb-4 fs-2">
              <i className="bi bi-stars me-2"></i> {data?.environment?.title}
            </h5>

            <Form.Check
              type="switch"
              id="enabledEnvironment"
              label="Abilitato"
              checked={data?.environment?.enabled}
              onChange={(e) => dispatch(setDashboardMoodField("environment.enabled", e.target.checked))}
              className="mb-2"
            />

            <Form.Group className="mb-3">
              <Form.Label>Suggerimento</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={data?.environment?.suggestion}
                onChange={(e) => dispatch(setDashboardMoodField("environment.suggestion", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Durata in secondi</Form.Label>
              <Form.Control
                type="number"
                value={data?.environment?.duration}
                onChange={(e) => dispatch(setDashboardMoodField("environment.duration", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Durata consigliata (es. {"{{min}}"} min)</Form.Label>
              <Form.Control
                type="text"
                value={data?.environment?.suggestedDuration}
                onChange={(e) => dispatch(setDashboardMoodField("environment.suggestedDuration", e.target.value))}
              />
            </Form.Group>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Immagine di sfondo del moood</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.environment?.backgroundImage}
                    onChange={(e) => dispatch(setDashboardMoodField("environment.backgroundImage", e.target.value))}
                  />
                  <a
                    href={data?.environment?.backgroundImage}
                    target="_blank"
                    rel="noreferrer"
                    className="d-block mt-2"
                  >
                    {data?.environment?.backgroundImage}
                  </a>
                  <Image
                    src={data?.environment?.backgroundImage}
                    thumbnail
                    className="mt-2"
                    style={{ maxHeight: "26rem" }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3 h-100">
                  <Form.Label>Video di sfondo</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.environment?.backgroundVideo}
                    onChange={(e) => dispatch(setDashboardMoodField("environment.backgroundVideo", e.target.value))}
                  />
                  {data?.environment?.backgroundVideo && (
                    <>
                      <a
                        href={data?.environment?.backgroundVideo}
                        target="_blank"
                        rel="noreferrer"
                        className="d-block mt-2"
                      >
                        {data?.environment?.backgroundVideo}
                      </a>
                      <div className="d-flex align-items-center mt-2 img-thumbnail">
                        <video
                          src={data?.environment?.backgroundVideo}
                          controls
                          width="100%"
                          className="my-auto rounded shadow-sm"
                          style={{ maxHeight: "14rem", objectFit: "cover" }}
                        >
                          Il tuo browser non supporta il tag video.
                        </video>
                      </div>
                    </>
                  )}
                  <Form.Label className="mt-2">File audio</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.environment?.audioSrc}
                    onChange={(e) => dispatch(setDashboardMoodField("environment.audioSrc", e.target.value))}
                  />
                  <a href={data?.environment?.audioSrc} target="_blank" rel="noreferrer" className="d-block mt-2">
                    {data?.environment?.audioSrc}
                  </a>
                  <audio src={data?.environment?.audioSrc} controls width="100%" className="mt-2 w-100">
                    Il tuo browser non supporta il tag audio.
                  </audio>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Soundscape (uno per riga)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={
                  Array.isArray(data?.environment?.soundscape)
                    ? data?.environment?.soundscape.join("\n")
                    : data?.environment?.soundscape
                }
                onChange={(e) => dispatch(setDashboardMoodField("environment.soundscape", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etichetta pulsante "Avvia"</Form.Label>
              <Form.Control
                type="text"
                value={data?.environment?.start}
                onChange={(e) => dispatch(setDashboardMoodField("environment.start", e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etichetta pulsante "Ferma"</Form.Label>
              <Form.Control
                type="text"
                value={data?.environment?.stop}
                onChange={(e) => dispatch(setDashboardMoodField("environment.stop", e.target.value))}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etichetta "Muta musica"</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.environment?.mute}
                    onChange={(e) => dispatch(setDashboardMoodField("environment.mute", e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etichetta "Riattiva musica"</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.environment?.unmute}
                    onChange={(e) => dispatch(setDashboardMoodField("environment.unmute", e.target.value))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etichetta "A tutto schermo"</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.environment?.fullscreen}
                    onChange={(e) => dispatch(setDashboardMoodField("environment.fullscreen", e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etichetta "Esci da tutto schermo"</Form.Label>
                  <Form.Control
                    type="text"
                    value={data?.environment?.exitFullscreen}
                    onChange={(e) => dispatch(setDashboardMoodField("environment.exitFullscreen", e.target.value))}
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}

        <div className="text-end mt-4">
          <Button variant="success" onClick={handleSave} disabled={saveMoodLoading}>
            {saveMoodLoading ? "Salvataggio..." : "Salva"}
          </Button>
          {saveMoodSuccess === true && (
            <Alert variant="success" className="mt-3">
              Salvataggio riuscito.
            </Alert>
          )}
          {saveMoodError === true && (
            <Alert variant="danger" className="mt-3">
              Errore nel salvataggio.
            </Alert>
          )}
        </div>

        {dashboardMoodError && (
          <Alert variant="danger" className="mt-3">
            {dashboardMoodError}
          </Alert>
        )}
      </Card>
    </Container>
  );
};

export default SingleMood;
