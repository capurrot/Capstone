import { Modal, Button } from "react-bootstrap";

const FocusMoodInfoModal = ({ show, handleClose, mood }) => {
  if (!mood) return null;

  const {
    mood: moodTitle,
    description,
    imagine,
    helpYou,
    music,
    breathing,
    relaxBody,
    journalPre,
    journalPost,
    spiritual,
    environment,
    durationSuggestion,
  } = mood;

  return (
    <Modal show={show} onHide={handleClose} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>🌿 Il tuo momento "{moodTitle}"</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{description}</p>

        <p>
          {imagine} In circa <strong>{durationSuggestion}</strong>, questo percorso {helpYou}
        </p>
        <p>
          Puoi decidere tu quanto tempo dedicare a questa attività. Ti consigliamo un tempo minimo per ottenere i
          risultati migliori, ma puoi dedicare anche più tempo. Naturalmente, più tempo impiegherai, maggiori saranno i
          benefici.
        </p>

        <hr />

        <p>
          <strong>🎵 Inizia dalla musica:</strong> ascolta <em>{music.title}</em> durante questo percorso, una selezione{" "}
          {music.tags.join(", ")} che accompagnerà la tua mente {music.scope} (Anche la musica non è obbligatoria per
          questo percorso. Puoi usare delle playlist in tuo possesso. Abbiamo utilizzato una playlist di Audius con
          musica scelta da noi per rendere ancora più immersiva l'esperienza).
        </p>

        <hr />
        {journalPre?.enabled && (
          <>
            <p className="mb-0">
              <strong>✍️ Descrivi il tuo stato d'animo:</strong> {journalPre.prompt}{" "}
            </p>
            {journalPre.optional && (
              <p className="text-muted">
                <em>(facoltativo)</em>
              </p>
            )}

            <hr />
          </>
        )}

        {breathing?.enabled && (
          <>
            <p>
              <strong>🧘‍♀️ Prosegui con la respirazione:</strong> tecnica <em>{breathing.technique}</em>, pensata per
              {breathing.scope}
            </p>
            <p></p>
            <hr />
          </>
        )}

        {relaxBody?.enabled && (
          <>
            <p>
              <strong>🤸‍♂️ Rilassa il corpo:</strong> {relaxBody.description} Esercizi consigliati:{" "}
              {relaxBody.exercises.map((ex, i) => (
                <span key={i}>{i < relaxBody.exercises.length - 1 ? ex.name + ", " : ex.name + "."}</span>
              ))}
            </p>
            <hr />
          </>
        )}

        {journalPost?.enabled && (
          <>
            <p className="mb-0">
              <strong>✍️ Descrivi il risultato della sessione:</strong> {journalPost.prompt}
            </p>
            {journalPost.optional && (
              <>
                <p className="text-muted">
                  <em>(facoltativo)</em>
                </p>
                <hr />
              </>
            )}
          </>
        )}

        {spiritual?.enabled && (
          <>
            <p>
              <strong>🕊️ Ispirazione spirituale:</strong> chiudi la sessione con un pensiero che nutre l’anima.
            </p>
            <blockquote>
              <p>"{spiritual.text}"</p>
              <footer className="blockquote-footer">{spiritual.verse}</footer>
            </blockquote>
          </>
        )}

        {environment?.soundscape?.length > 0 && (
          <>
            <p>
              <strong>🌄 Ambientazione sonora:</strong> suoni di {environment.soundscape.join(", ")} ti accompagneranno
              nel percorso.
            </p>
          </>
        )}

        <hr />

        <p className="mt-3">
          ✨ Ti invitiamo a vivere ogni fase con presenza e apertura. È il tuo momento. Non serve fare tutto
          perfettamente: basta esserci, un passo alla volta.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Sono pronto/a 🌿
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FocusMoodInfoModal;
