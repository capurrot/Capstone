import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, Form, Image, Row, Spinner } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSelector } from "react-redux";
import IconPicker from "./IconPicker";

const SingleMood = ({ mood }) => {
  const [selectedLang, setSelectedLang] = useState("it");
  const [translation, setTranslation] = useState(null);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState(mood.tag.join(", "));
  const [opacity, setOpacity] = useState(mood.opacity);
  const [colors, setColors] = useState(mood.colors);
  const [instructions, setInstructions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imagine, setImagine] = useState("");
  const [helpYou, setHelpYou] = useState("");
  const [durationSuggestion, setDurationSuggestion] = useState("");
  const [cardImage, setCardImage] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [iconMood, setIconMood] = useState("");

  const [breathingEnabled, setBreathingEnabled] = useState(false);
  const [technique, setTechnique] = useState("");
  const [totalDuration, setTotalDuration] = useState(0);

  const [musicTitle, setMusicTitle] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [musicTags, setMusicTags] = useState("");
  const [musicScope, setMusicScope] = useState("");

  const [relaxBodyEnabled, setRelaxBodyEnabled] = useState(false);
  const [relaxBodyDescription, setRelaxBodyDescription] = useState("");
  const [pauseDuration, setPauseDuration] = useState(5);
  const [relaxExercises, setRelaxExercises] = useState([]);

  const [journalPreEnabled, setJournalPreEnabled] = useState(false);
  const [journalPrePrompt, setJournalPrePrompt] = useState("");
  const [journalPrePlaceholder, setJournalPrePlaceholder] = useState("");
  const [journalPreSave, setJournalPreSave] = useState("");
  const [journalPreOptional, setJournalPreOptional] = useState(false);

  const [journalPostEnabled, setJournalPostEnabled] = useState(false);
  const [journalPostPrompt, setJournalPostPrompt] = useState("");
  const [journalPostPlaceholder, setJournalPostPlaceholder] = useState("");
  const [journalPostSave, setJournalPostSave] = useState("");
  const [journalPostOptional, setJournalPostOptional] = useState(false);

  const [spiritualEnabled, setSpiritualEnabled] = useState(false);
  const [spiritualType, setSpiritualType] = useState("");
  const [spiritualVerse, setSpiritualVerse] = useState("");
  const [spiritualText, setSpiritualText] = useState("");

  const [coachEnabled, setCoachEnabled] = useState(false);
  const [coachIntro, setCoachIntro] = useState("");
  const [coachObstacle, setCoachObstacle] = useState("");
  const [coachSituationLabel, setCoachSituationLabel] = useState("");
  const [coachFeedbackLabel, setCoachFeedbackLabel] = useState("");
  const [coachNext, setCoachNext] = useState("");
  const [coachFinished, setCoachFinished] = useState("");
  const [coachNoSteps, setCoachNoSteps] = useState("");
  const [coachSteps, setCoachSteps] = useState([]);

  const [environmentEnabled, setEnvironmentEnabled] = useState(false);
  const [environmentTitle, setEnvironmentTitle] = useState("");
  const [environmentSuggestion, setEnvironmentSuggestion] = useState("");
  const [environmentDuration, setEnvironmentDuration] = useState(0);
  const [environmentSuggestedDuration, setEnvironmentSuggestedDuration] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [backgroundVideo, setBackgroundVideo] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [soundscape, setSoundscape] = useState("");
  const [startLabel, setStartLabel] = useState("");
  const [stopLabel, setStopLabel] = useState("");
  const [muteLabel, setMuteLabel] = useState("");
  const [unmuteLabel, setUnmuteLabel] = useState("");
  const [fullscreenLabel, setFullscreenLabel] = useState("");
  const [exitFullscreenLabel, setExitFullscreenLabel] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    loadTranslation("it");
  }, []);

  const loadTranslation = async (lang) => {
    setSelectedLang(lang);
    setTranslation(null);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}api/focus-field/mood/${mood.slug}/${lang}`);
      if (!res.ok) throw new Error("Errore nel recupero della traduzione.");
      const data = await res.json();
      console.log("Mood tradotto:", data);
      console.log("Id mood:", mood.id);
      setTranslation(data);
      setInstructions(data.breathing?.phases || []);
      setName(data.name || "");
      setDescription(data.description || "");
      setImagine(data.imagine || "");
      setHelpYou(data.helpYou || "");
      setDurationSuggestion(data.durationSuggestion || "");
      setCardImage(mood.image || "");
      setHeroImage(mood.background || "");
      setIconMood(mood.icon || "");

      setBreathingEnabled(data.breathing?.enabled || false);
      setTechnique(data.breathing?.technique || "");
      setTotalDuration(data.breathing?.totalDuration || 0);
      setInstructions(data.breathing?.phases || []);

      setMusicTitle(data.music?.title || "");
      setPlaylistUrl(data.music?.playlistUrl || "");
      setMusicTags(data.music?.tags?.join(", ") || "");
      setMusicScope(data.music?.scope || "");

      setRelaxBodyEnabled(data.relaxBody?.enabled || false);
      setRelaxBodyDescription(data.relaxBody?.description || "");
      setPauseDuration(data.relaxBody?.pauseDuration || 5);
      setRelaxExercises(data.relaxBody?.exercises || []);

      setJournalPreEnabled(data.journalPre?.enabled || false);
      setJournalPrePrompt(data.journalPre?.prompt || "");
      setJournalPrePlaceholder(data.journalPre?.placeholder || "");
      setJournalPreSave(data.journalPre?.save || "");
      setJournalPreOptional(data.journalPre?.optional || false);

      setJournalPostEnabled(data.journalPost?.enabled || false);
      setJournalPostPrompt(data.journalPost?.prompt || "");
      setJournalPostPlaceholder(data.journalPost?.placeholder || "");
      setJournalPostSave(data.journalPost?.save || "");
      setJournalPostOptional(data.journalPost?.optional || false);

      setSpiritualEnabled(data.spiritual?.enabled || false);
      setSpiritualType(data.spiritual?.type || "");
      setSpiritualVerse(data.spiritual?.verse || "");
      setSpiritualText(data.spiritual?.text || "");

      setCoachEnabled(data.coach?.enabled || false);
      setCoachIntro(data.coach?.intro || "");
      setCoachObstacle(data.coach?.obstacle || "");
      setCoachSituationLabel(data.coach?.situation || "");
      setCoachFeedbackLabel(data.coach?.feedback || "");
      setCoachNext(data.coach?.next || "");
      setCoachFinished(data.coach?.finished || "");
      setCoachNoSteps(data.coach?.noSteps || "");
      setCoachSteps(data.coach?.steps || []);

      setEnvironmentEnabled(data.environment?.enabled || false);
      setEnvironmentTitle(data.environment?.title || "");
      setEnvironmentSuggestion(data.environment?.suggestion || "");
      setEnvironmentDuration(data.environment?.duration || 0);
      setEnvironmentSuggestedDuration(data.environment?.suggestedDuration || "");
      setBackgroundImage(data.environment?.backgroundImage || "");
      setBackgroundVideo(data.environment?.backgroundVideo || "");
      setAudioSrc(data.environment?.audioSrc || "");
      setSoundscape(data.environment?.soundscape?.join("\n") || "");
      setStartLabel(data.environment?.start || "");
      setStopLabel(data.environment?.stop || "");
      setMuteLabel(data.environment?.mute || "");
      setUnmuteLabel(data.environment?.unmute || "");
      setFullscreenLabel(data.environment?.fullscreen || "");
      setExitFullscreenLabel(data.environment?.exitFullscreen || "");
    } catch (err) {
      setError("Traduzione non disponibile. " + err.message);
    }
  };

  const handleColorChange = (index, value) => {
    const updated = [...colors];
    updated[index] = value;
    setColors(updated);
  };

  const handleInstructionDrag = (result) => {
    if (!result.destination) return;
    const updated = [...instructions];
    const [removed] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, removed);
    setInstructions(updated);
    setTranslation((prev) => ({
      ...prev,
      breathing: {
        ...prev.breathing,
        phases: updated,
      },
    }));
  };

  const addPhase = () => {
    const newPhase = {
      phaseLabel: "",
      duration: 0,
      mode: "",
    };
    const updated = [...instructions, newPhase];
    setInstructions(updated);
    setTranslation((prev) => ({
      ...prev,
      breathing: {
        ...prev.breathing,
        phases: updated,
      },
    }));
  };

  const removePhase = (index) => {
    const updated = [...instructions];
    updated.splice(index, 1);
    setInstructions(updated);
    setTranslation((prev) => ({
      ...prev,
      breathing: {
        ...prev.breathing,
        phases: updated,
      },
    }));
  };

  const handleSave = async () => {
    if (!translation) return;

    setIsSaving(true);
    setSaveSuccess(null);

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
      name,
      description,
      imagine,
      helpYou,
      durationSuggestion,
      music: {
        title: musicTitle,
        playlistUrl,
        tags: musicTags.split(",").map((t) => t.trim()),
        scope: musicScope,
      },
      breathing: {
        enabled: breathingEnabled,
        technique,
        totalDuration,
        phases: instructions,
      },
      relaxBody: {
        enabled: relaxBodyEnabled,
        description: relaxBodyDescription,
        pauseDuration,
        exercises: relaxExercises,
      },
      journalPre: {
        enabled: journalPreEnabled,
        prompt: journalPrePrompt,
        placeholder: journalPrePlaceholder,
        save: journalPreSave,
        optional: journalPreOptional,
      },
      journalPost: {
        enabled: journalPostEnabled,
        prompt: journalPostPrompt,
        placeholder: journalPostPlaceholder,
        save: journalPostSave,
        optional: journalPostOptional,
      },
      spiritual: {
        enabled: spiritualEnabled,
        type: spiritualType,
        verse: spiritualVerse,
        text: spiritualText,
      },
      coach: {
        enabled: coachEnabled,
        intro: coachIntro,
        obstacle: coachObstacle,
        situation: coachSituationLabel,
        feedback: coachFeedbackLabel,
        next: coachNext,
        finished: coachFinished,
        noSteps: coachNoSteps,
        steps: coachSteps,
      },
      environment: {
        enabled: environmentEnabled,
        title: environmentTitle,
        suggestion: environmentSuggestion,
        duration: environmentDuration,
        suggestedDuration: environmentSuggestedDuration,
        backgroundImage,
        backgroundVideo,
        audioSrc,
        soundscape: soundscape
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        start: startLabel,
        stop: stopLabel,
        mute: muteLabel,
        unmute: unmuteLabel,
        fullscreen: fullscreenLabel,
        exitFullscreen: exitFullscreenLabel,
      },
    };

    console.log("moodListNew", moodListNew);
    console.log("moodRequest", moodRequest);

    try {
      const res = await fetch(`${apiUrl}api/focus-field/moods/${mood.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(moodListNew),
      });

      if (!res.ok) throw new Error("Errore durante il salvataggio dei dati principali del mood.");
      setSaveSuccess(true);
    } catch (err) {
      console.error(err);
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
    }

    /*     try {
      const res = await fetch(`${apiUrl}api/focus-field/mood/${mood.slug}/${selectedLang}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(moodRequest),
      });

      if (!res.ok) throw new Error("Errore durante il salvataggio della traduzione del mood.");
      setSaveSuccess(true);
    } catch (err) {
      console.error(err);
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
    } */
  };

  return (
    <Container className="my-5 px-0">
      <Card className="px-4 px-md-4 py-4  shadow-lg rounded-4 bg-light text-muted">
        <Row className="align-items-center ">
          <Col md={6}>
            <h4 className="text-capitalize d-flex align-items-center gap-2 fw-semibold display-6">
              <i className={`bi ${mood.icon} fs-4 text-secondary`}></i>
              {mood.slug}
              <Badge bg="secondary" className="ms-2">{`#${mood.id}`}</Badge>
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

        {translation ? (
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formName">
                  <Form.Label className="fw-bold">Nome</Form.Label>
                  <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formDurationSuggestion">
                  <Form.Label className="fw-bold">Durata suggerita</Form.Label>
                  <Form.Control
                    type="text"
                    value={durationSuggestion}
                    onChange={(e) => setDurationSuggestion(e.target.value)}
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    value={imagine}
                    onChange={(e) => setImagine(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formHelpYou">
                  <Form.Label className="fw-bold">Aiuto</Form.Label>
                  <Form.Control
                    as="textarea"
                    style={{ height: "115px" }}
                    value={helpYou}
                    onChange={(e) => setHelpYou(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4" controlId="formTags">
              <Form.Label className="fw-bold">Tags (separati da virgola)</Form.Label>
              <Form.Control type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
            </Form.Group>
            <hr />

            <h5 className="mb-4 fs-2">
              <i className="bi bi-palette me-2"></i> Paletta dei colori
            </h5>
            {colors.map((color, i) => (
              <Row key={i} className="align-items-center mb-2">
                <Col xs={3} md={2}>
                  <Form.Control type="color" value={color} onChange={(e) => handleColorChange(i, e.target.value)} />
                </Col>
                <Col>
                  <Form.Control type="text" value={color} onChange={(e) => handleColorChange(i, e.target.value)} />
                </Col>
              </Row>
            ))}

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
        ) : (
          <div className="text-center my-5">
            <Spinner animation="border" />
            <p className="mt-2 text-muted">Caricamento della traduzione...</p>
          </div>
        )}

        <hr />

        {translation?.music && (
          <>
            <h5 className="mb-4 fs-2">
              <i className="bi bi-music-note-beamed me-2"></i> Musica consigliata
            </h5>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Titolo Playlist</Form.Label>
              <Form.Control type="text" value={musicTitle} onChange={(e) => setMusicTitle(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">URL Playlist</Form.Label>
              <Form.Control type="text" value={playlistUrl} onChange={(e) => setPlaylistUrl(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Tag musicali</Form.Label>
              <Form.Control type="text" value={musicTags} onChange={(e) => setMusicTags(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Scopo della musica</Form.Label>
              <Form.Control type="text" value={musicScope} onChange={(e) => setMusicScope(e.target.value)} />
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
              defaultChecked={translation.breathing.enabled}
              onChange={(e) => setBreathingEnabled(e.target.checked)}
              className="mb-2"
            />
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="technique">
                  <Form.Label className="fw-bold">Tecnica</Form.Label>
                  <Form.Control type="text" value={technique} onChange={(e) => setTechnique(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="duration">
                  <Form.Label className="fw-bold">Durata (secondi)</Form.Label>
                  <Form.Control
                    type="number"
                    value={totalDuration}
                    onChange={(e) => setTotalDuration(parseInt(e.target.value))}
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
                                  value={phase.phaseLabel}
                                  onChange={(e) => {
                                    const updated = [...instructions];
                                    updated[idx].phaseLabel = e.target.value;
                                    setInstructions(updated);
                                    setTranslation({
                                      ...translation,
                                      breathing: { ...translation.breathing, phases: updated },
                                    });
                                  }}
                                >
                                  <option value="">Seleziona una fase</option>
                                  {[...new Set(instructions.map((p) => p.phaseLabel).filter(Boolean))].map(
                                    (label, i) => (
                                      <option key={i} value={label}>
                                        {label}
                                      </option>
                                    )
                                  )}
                                </Form.Select>
                              </Col>
                              <Col md={2}>
                                <Form.Control
                                  type="number"
                                  value={phase.duration}
                                  onChange={(e) => {
                                    const updated = [...instructions];
                                    updated[idx].duration = parseInt(e.target.value);
                                    setInstructions(updated);
                                    setTranslation({
                                      ...translation,
                                      breathing: { ...translation.breathing, phases: updated },
                                    });
                                  }}
                                />
                              </Col>
                              <Col md={4}>
                                <Form.Select
                                  value={phase.mode}
                                  onChange={(e) => {
                                    const updated = [...instructions];
                                    updated[idx].mode = e.target.value;
                                    setInstructions(updated);
                                    setTranslation({
                                      ...translation,
                                      breathing: { ...translation.breathing, phases: updated },
                                    });
                                  }}
                                >
                                  <option value="">Seleziona una modalità</option>
                                  {[...new Set(instructions.map((p) => p.mode).filter(Boolean))].map((mode, i) => (
                                    <option key={i} value={mode}>
                                      {mode}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Col>
                              <div className="col-1 text-center">
                                <Button
                                  variant="danger"
                                  className="fs-3 rounded-circle d-inline-flex align-items-center justify-content-center"
                                  style={{ width: 25, height: 25, paddingBottom: "10px" }}
                                  onClick={() => removePhase(idx)}
                                >
                                  -
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
                  onClick={addPhase}
                >
                  +
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
              checked={relaxBodyEnabled}
              onChange={(e) => setRelaxBodyEnabled(e.target.checked)}
              className="mb-2"
            />

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={relaxBodyDescription}
                onChange={(e) => setRelaxBodyDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Durata pausa tra esercizi (secondi)</Form.Label>
              <Form.Control
                type="number"
                value={pauseDuration}
                onChange={(e) => setPauseDuration(parseInt(e.target.value))}
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
                    setRelaxExercises(updated);
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
                          updated[index].name = e.target.value;
                          setRelaxExercises(updated);
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
                          updated[index].instructions = e.target.value;
                          setRelaxExercises(updated);
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
                          updated[index].duration = parseInt(e.target.value);
                          setRelaxExercises(updated);
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
                          updated[index].image = e.target.value;
                          setRelaxExercises(updated);
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
                  setRelaxExercises([...relaxExercises, { name: "", instructions: "", duration: 0, image: "" }]);
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
              checked={journalPreEnabled}
              onChange={(e) => setJournalPreEnabled(e.target.checked)}
              className="mb-2"
            />

            <Form.Group className="mb-3">
              <Form.Label>Prompt</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={journalPrePrompt}
                onChange={(e) => setJournalPrePrompt(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Placeholder</Form.Label>
              <Form.Control
                type="text"
                value={journalPrePlaceholder}
                onChange={(e) => setJournalPrePlaceholder(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etichetta Salvataggio</Form.Label>
              <Form.Control type="text" value={journalPreSave} onChange={(e) => setJournalPreSave(e.target.value)} />
            </Form.Group>

            <Form.Check
              type="switch"
              id="optionalJournalPre"
              label="Facoltativo"
              checked={journalPreOptional}
              onChange={(e) => setJournalPreOptional(e.target.checked)}
            />
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
              checked={journalPostEnabled}
              onChange={(e) => setJournalPostEnabled(e.target.checked)}
              className="mb-2"
            />

            <Form.Group className="mb-3">
              <Form.Label>Prompt</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={journalPostPrompt}
                onChange={(e) => setJournalPostPrompt(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Placeholder</Form.Label>
              <Form.Control
                type="text"
                value={journalPostPlaceholder}
                onChange={(e) => setJournalPostPlaceholder(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etichetta Salvataggio</Form.Label>
              <Form.Control type="text" value={journalPostSave} onChange={(e) => setJournalPostSave(e.target.value)} />
            </Form.Group>

            <Form.Check
              type="switch"
              id="optionalJournalPost"
              label="Facoltativo"
              checked={journalPostOptional}
              onChange={(e) => setJournalPostOptional(e.target.checked)}
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
              checked={spiritualEnabled}
              onChange={(e) => setSpiritualEnabled(e.target.checked)}
              className="mb-2"
            />

            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Control type="text" value={spiritualType} onChange={(e) => setSpiritualType(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Versetto</Form.Label>
              <Form.Control type="text" value={spiritualVerse} onChange={(e) => setSpiritualVerse(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Testo</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={spiritualText}
                onChange={(e) => setSpiritualText(e.target.value)}
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
              checked={coachEnabled}
              onChange={(e) => setCoachEnabled(e.target.checked)}
              className="mb-2"
            />

            <Form.Group className="mb-3">
              <Form.Label>Introduzione</Form.Label>
              <Form.Control as="textarea" rows={2} value={coachIntro} onChange={(e) => setCoachIntro(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etichetta ostacolo</Form.Label>
              <Form.Control type="text" value={coachObstacle} onChange={(e) => setCoachObstacle(e.target.value)} />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etichetta “Situazione”</Form.Label>
                  <Form.Control
                    type="text"
                    value={coachSituationLabel}
                    onChange={(e) => setCoachSituationLabel(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etichetta “Feedback”</Form.Label>
                  <Form.Control
                    type="text"
                    value={coachFeedbackLabel}
                    onChange={(e) => setCoachFeedbackLabel(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pulsante “Avanti”</Form.Label>
                  <Form.Control type="text" value={coachNext} onChange={(e) => setCoachNext(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Messaggio finale</Form.Label>
                  <Form.Control type="text" value={coachFinished} onChange={(e) => setCoachFinished(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Messaggio se non ci sono percorsi</Form.Label>
              <Form.Control type="text" value={coachNoSteps} onChange={(e) => setCoachNoSteps(e.target.value)} />
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
                    setCoachSteps(updated);
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
                      updated[idx].situation = e.target.value;
                      setCoachSteps(updated);
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
                          updated[idx].answers[answerIdx].text = e.target.value;
                          setCoachSteps(updated);
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
                          updated[idx].answers[answerIdx].correct = e.target.checked;
                          setCoachSteps(updated);
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
                          updated[idx].answers[answerIdx].feedback = e.target.value;
                          setCoachSteps(updated);
                        }}
                        placeholder="Feedback (opzionale)"
                      />
                    </Col>
                    <Col md={1}>
                      <Button
                        variant="danger"
                        className="fs-3 rounded-circle d-inline-flex align-items-center justify-content-center"
                        style={{ width: 25, height: 25, paddingBottom: "10px" }}
                        onClick={() => {
                          const updated = [...coachSteps];
                          updated[idx].answers.splice(answerIdx, 1);
                          setCoachSteps(updated);
                        }}
                      >
                        -
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
                      updated[idx].answers = [
                        ...(updated[idx].answers || []),
                        { text: "", correct: false, feedback: "" },
                      ];
                      setCoachSteps(updated);
                    }}
                  >
                    +
                  </Button>
                </div>
              </Card>
            ))}

            <div className="text-end">
              <Button
                variant="outline-primary"
                onClick={() =>
                  setCoachSteps((prev) => [
                    ...prev,
                    {
                      id: Date.now(),
                      situation: "",
                      answers: [],
                    },
                  ])
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
              <i className="bi bi-stars me-2"></i> {environmentTitle || "Ambientazione immersiva"}
            </h5>

            <Form.Check
              type="switch"
              id="enabledEnvironment"
              label="Abilitato"
              checked={environmentEnabled}
              onChange={(e) => setEnvironmentEnabled(e.target.checked)}
              className="mb-2"
            />

            <Form.Group className="mb-3">
              <Form.Label>Suggerimento</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={environmentSuggestion}
                onChange={(e) => setEnvironmentSuggestion(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Durata in secondi</Form.Label>
              <Form.Control
                type="number"
                value={environmentDuration}
                onChange={(e) => setEnvironmentDuration(parseInt(e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Durata consigliata (es. {"{{min}}"} min)</Form.Label>
              <Form.Control
                type="text"
                value={environmentSuggestedDuration}
                onChange={(e) => setEnvironmentSuggestedDuration(e.target.value)}
              />
            </Form.Group>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Immagine di sfondo del moood</Form.Label>
                  <Form.Control
                    type="text"
                    value={backgroundImage}
                    onChange={(e) => setBackgroundImage(e.target.value)}
                  />
                  <a href={backgroundImage} target="_blank" rel="noreferrer" className="d-block mt-2">
                    {backgroundImage}
                  </a>
                  <Image src={backgroundImage} thumbnail className="mt-2" style={{ maxHeight: "26rem" }} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3 h-100">
                  <Form.Label>Video di sfondo</Form.Label>
                  <Form.Control
                    type="text"
                    value={backgroundVideo}
                    onChange={(e) => setBackgroundVideo(e.target.value)}
                  />
                  {backgroundVideo && (
                    <>
                      <a href={backgroundVideo} target="_blank" rel="noreferrer" className="d-block mt-2">
                        {backgroundVideo}
                      </a>
                      <div className="d-flex align-items-center mt-2 img-thumbnail">
                        <video
                          src={backgroundVideo}
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
                  <Form.Control type="text" value={audioSrc} onChange={(e) => setAudioSrc(e.target.value)} />
                  <a href={audioSrc} target="_blank" rel="noreferrer" className="d-block mt-2">
                    {audioSrc}
                  </a>
                  <audio src={audioSrc} controls width="100%" className="mt-2 w-100">
                    Il tuo browser non supporta il tag audio.
                  </audio>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Soundscape (uno per riga)</Form.Label>
              <Form.Control as="textarea" rows={2} value={soundscape} onChange={(e) => setSoundscape(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etichetta pulsante "Avvia"</Form.Label>
              <Form.Control type="text" value={startLabel} onChange={(e) => setStartLabel(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etichetta pulsante "Ferma"</Form.Label>
              <Form.Control type="text" value={stopLabel} onChange={(e) => setStopLabel(e.target.value)} />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etichetta "Muta musica"</Form.Label>
                  <Form.Control type="text" value={muteLabel} onChange={(e) => setMuteLabel(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etichetta "Riattiva musica"</Form.Label>
                  <Form.Control type="text" value={unmuteLabel} onChange={(e) => setUnmuteLabel(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etichetta "A tutto schermo"</Form.Label>
                  <Form.Control
                    type="text"
                    value={fullscreenLabel}
                    onChange={(e) => setFullscreenLabel(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etichetta "Esci da tutto schermo"</Form.Label>
                  <Form.Control
                    type="text"
                    value={exitFullscreenLabel}
                    onChange={(e) => setExitFullscreenLabel(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}

        <div className="text-end mt-4">
          <Button variant="success" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Salvataggio..." : "Salva"}
          </Button>
          {saveSuccess === true && (
            <Alert variant="success" className="mt-3">
              Salvataggio riuscito.
            </Alert>
          )}
          {saveSuccess === false && (
            <Alert variant="danger" className="mt-3">
              Errore nel salvataggio.
            </Alert>
          )}
        </div>

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
      </Card>
    </Container>
  );
};

export default SingleMood;
