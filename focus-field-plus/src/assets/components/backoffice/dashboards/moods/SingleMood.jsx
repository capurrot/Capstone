import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, Form, Image, Row, Spinner } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const SingleMood = ({ mood }) => {
  const [selectedLang, setSelectedLang] = useState("it");
  const [translation, setTranslation] = useState(null);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState(mood.tag.join(", "));
  const [opacity, setOpacity] = useState(mood.opacity);
  const [colors, setColors] = useState(mood.colors);
  const [instructions, setInstructions] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

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
      console.log(data);
      setTranslation(data);
      setInstructions(data.breathing?.phases || []);
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

  return (
    <Container className="my-5 px-0 px-lg-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">✨ Gestione Mood</h2>
        <a href="/admin" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-2"></i>Torna alla Dashboard
        </a>
      </div>

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
                  <Form.Control type="text" defaultValue={translation.name} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formDurationSuggestion">
                  <Form.Label className="fw-bold">Durata suggerita</Form.Label>
                  <Form.Control type="text" defaultValue={translation.durationSuggestion} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formDescription">
                  <Form.Label className="fw-bold">Descrizione</Form.Label>
                  <Form.Control as="textarea" rows={2} defaultValue={translation.description} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formOpacity">
                  <Form.Label className="fw-bold">Trasparenza</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={opacity}
                    onChange={(e) => setOpacity(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formImagine">
                  <Form.Label className="fw-bold">Immagina</Form.Label>
                  <Form.Control as="textarea" rows={2} defaultValue={translation.imagine} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formHelpYou">
                  <Form.Label className="fw-bold">Aiuto</Form.Label>
                  <Form.Control as="textarea" rows={2} defaultValue={translation.helpYou} />
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
            {translation.breathing && (
              <>
                <h5 className="mb-4 fs-2">
                  <i className="bi bi-lungs-fill me-2"></i> Respirazione
                </h5>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="technique">
                      <Form.Label className="fw-bold">Tecnica</Form.Label>
                      <Form.Control type="text" defaultValue={translation.breathing.technique} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="duration">
                      <Form.Label className="fw-bold">Durata (secondi)</Form.Label>
                      <Form.Control type="number" defaultValue={translation.breathing.totalDuration} />
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
                                      <option value="">Fase</option>
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
                                      <option value="">Modalità</option>
                                      {[...new Set(instructions.map((p) => p.mode).filter(Boolean))].map((mode, i) => (
                                        <option key={i} value={mode}>
                                          {mode}
                                        </option>
                                      ))}
                                    </Form.Select>
                                  </Col>
                                </Row>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </>
            )}
            <hr />

            {translation.music && (
              <>
                <h5 className="mb-4 fs-2">
                  <i className="bi bi-music-note-beamed me-2"></i> Musica consigliata
                </h5>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Titolo Playlist</Form.Label>
                  <Form.Control type="text" defaultValue={translation.music.title} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">URL Playlist</Form.Label>
                  <Form.Control type="text" defaultValue={translation.music.playlistUrl} />
                  <a
                    href={translation.music.playlistUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="d-block mt-2 text-decoration-underline"
                  >
                    Apri playlist
                  </a>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Tag musicali</Form.Label>
                  <Form.Control type="text" defaultValue={translation.music.tags?.join(", ")} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Scopo della musica</Form.Label>
                  <Form.Control type="text" defaultValue={translation.music.scope} />
                </Form.Group>
              </>
            )}

            <hr />
            <h5 className="mb-4 fs-2">
              <i className="bi bi-images me-2"></i> Immagini
            </h5>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Immagine mood card</Form.Label>
                  <a href={mood.image} target="_blank" rel="noreferrer" className="d-block">
                    {mood.image}
                  </a>
                  <Image src={mood.image} thumbnail className="mt-2" style={{ width: "120px" }} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Immagine sezione hero</Form.Label>
                  <a href={mood.background} target="_blank" rel="noreferrer" className="d-block">
                    {mood.background}
                  </a>
                  <Image src={mood.background} thumbnail className="mt-2" style={{ width: "120px" }} />
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

        {translation?.relaxBody && (
          <>
            <hr />
            <h5 className="mb-4 fs-2">
              <i className="bi bi-person-arms-up me-2"></i> {translation.relaxBody.title || "Rilassamento fisico"}
            </h5>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Descrizione</Form.Label>
              <Form.Control as="textarea" rows={2} defaultValue={translation.relaxBody.description} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Durata pausa tra esercizi (secondi)</Form.Label>
              <Form.Control type="number" defaultValue={translation.relaxBody.pauseDuration || 5} />
            </Form.Group>

            <Form.Label className="fw-bold mt-4 mb-2">Esercizi</Form.Label>
            {translation.relaxBody.exercises?.map((exercise, index) => (
              <Card className="mb-3 p-3 shadow-sm text-muted" key={index}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label className="fw-bold">Nome</Form.Label>
                      <Form.Control type="text" defaultValue={exercise.name} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="fw-bold">Istruzioni</Form.Label>
                      <Form.Control as="textarea" rows={2} defaultValue={exercise.instructions} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="fw-bold">Durata (secondi)</Form.Label>
                      <Form.Control type="number" defaultValue={exercise.duration} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Immagine</Form.Label>
                      <a href={exercise.image} target="_blank" rel="noreferrer" className="d-block">
                        {exercise.image}
                      </a>
                      <Image src={exercise.image} thumbnail className="mt-2 bg-secondary" style={{ width: "100px" }} />
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
            ))}
          </>
        )}

        {translation?.journalPre && (
          <>
            <hr />
            <h5 className="mb-4 fs-2">
              <i className="bi bi-journal-text me-2"></i> Diario – Prima della sessione
            </h5>
            <Form.Group className="mb-3">
              <Form.Label>Prompt</Form.Label>
              <Form.Control as="textarea" rows={2} defaultValue={translation.journalPre.prompt} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Placeholder</Form.Label>
              <Form.Control type="text" defaultValue={translation.journalPre.placeholder} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Etichetta Salvataggio</Form.Label>
              <Form.Control type="text" defaultValue={translation.journalPre.save} />
            </Form.Group>
            <Form.Check
              type="switch"
              id="optionalJournalPre"
              label="Facoltativo"
              defaultChecked={translation.journalPre.optional}
            />
          </>
        )}

        {translation?.journalPost && (
          <>
            <hr />
            <h5 className="mb-4 fs-2">
              <i className="bi bi-journal-check me-2"></i> Diario – Dopo la sessione
            </h5>
            <Form.Group className="mb-3">
              <Form.Label>Prompt</Form.Label>
              <Form.Control as="textarea" rows={2} defaultValue={translation.journalPost.prompt} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Placeholder</Form.Label>
              <Form.Control type="text" defaultValue={translation.journalPost.placeholder} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Etichetta Salvataggio</Form.Label>
              <Form.Control type="text" defaultValue={translation.journalPost.save} />
            </Form.Group>
            <Form.Check
              type="switch"
              id="optionalJournalPost"
              label="Facoltativo"
              defaultChecked={translation.journalPost.optional}
            />
          </>
        )}

        {translation?.spiritual && (
          <>
            <hr />
            <h5 className="mb-4 fs-2">
              <i className="bi bi-book me-2"></i> Contenuto spirituale
            </h5>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Control type="text" defaultValue={translation.spiritual.type} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Versetto</Form.Label>
              <Form.Control type="text" defaultValue={translation.spiritual.verse} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Testo</Form.Label>
              <Form.Control as="textarea" rows={3} defaultValue={translation.spiritual.text} />
            </Form.Group>
          </>
        )}

        {translation?.coach && (
          <>
            <hr />
            <h5 className="mb-4 fs-2">
              <i className="bi bi-person-walking me-2"></i> Percorso mentale (Coach)
            </h5>

            <Form.Group className="mb-3">
              <Form.Label>Introduzione</Form.Label>
              <Form.Control as="textarea" rows={2} defaultValue={translation.coach.intro} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etichetta ostacolo</Form.Label>
              <Form.Control type="text" defaultValue={translation.coach.obstacle} />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etichetta “Situazione”</Form.Label>
                  <Form.Control type="text" defaultValue={translation.coach.situation} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etichetta “Feedback”</Form.Label>
                  <Form.Control type="text" defaultValue={translation.coach.feedback} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pulsante “Avanti”</Form.Label>
                  <Form.Control type="text" defaultValue={translation.coach.next} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Messaggio finale</Form.Label>
                  <Form.Control type="text" defaultValue={translation.coach.finished} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Messaggio se non ci sono percorsi</Form.Label>
              <Form.Control type="text" defaultValue={translation.coach.noSteps} />
            </Form.Group>

            <h6 className="fw-bold mt-4">Situazioni</h6>
            {translation.coach.steps?.map((step, idx) => (
              <Card key={step.id} className="mb-3 p-3 shadow-sm">
                <Form.Group>
                  <Form.Label>Sfida #{idx + 1}</Form.Label>
                  <Form.Control as="textarea" rows={2} defaultValue={step.situation} />
                </Form.Group>
              </Card>
            ))}
          </>
        )}

        {translation?.environment && (
          <>
            <hr />
            <h5 className="mb-4 fs-2">
              <i className="bi bi-stars me-2"></i> {translation.environment.title || "Ambientazione immersiva"}
            </h5>

            <Form.Group className="mb-3">
              <Form.Label>Suggerimento</Form.Label>
              <Form.Control as="textarea" rows={2} defaultValue={translation.environment.suggestion} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Durata in secondi</Form.Label>
              <Form.Control type="number" defaultValue={translation.environment.duration} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Durata consigliata (es. {"{{min}}"} min)</Form.Label>
              <Form.Control type="text" defaultValue={translation.environment.suggestedDuration} />
            </Form.Group>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Immagine di sfondo</Form.Label>
                  <a
                    href={translation.environment.backgroundImage}
                    target="_blank"
                    rel="noreferrer"
                    className="d-block"
                  >
                    {translation.environment.backgroundImage}
                  </a>
                  <Image
                    src={translation.environment.backgroundImage}
                    thumbnail
                    className="mt-2"
                    style={{ width: "100px" }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Video di sfondo</Form.Label>
                  <a
                    href={translation.environment.backgroundVideo}
                    target="_blank"
                    rel="noreferrer"
                    className="d-block"
                  >
                    {translation.environment.backgroundVideo}
                  </a>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>File audio</Form.Label>
              <a href={translation.environment.audioSrc} target="_blank" rel="noreferrer" className="d-block">
                {translation.environment.audioSrc}
              </a>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Soundscape (uno per riga)</Form.Label>
              <Form.Control as="textarea" rows={2} defaultValue={translation.environment.soundscape?.join("\n")} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etichetta pulsante "Avvia"</Form.Label>
              <Form.Control type="text" defaultValue={translation.environment.start} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etichetta pulsante "Ferma"</Form.Label>
              <Form.Control type="text" defaultValue={translation.environment.stop} />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etichetta "Muta musica"</Form.Label>
                  <Form.Control type="text" defaultValue={translation.environment.mute} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etichetta "Riattiva musica"</Form.Label>
                  <Form.Control type="text" defaultValue={translation.environment.unmute} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etichetta "A tutto schermo"</Form.Label>
                  <Form.Control type="text" defaultValue={translation.environment.fullscreen} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Etichetta "Esci da tutto schermo"</Form.Label>
                  <Form.Control type="text" defaultValue={translation.environment.exitFullscreen} />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}

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
