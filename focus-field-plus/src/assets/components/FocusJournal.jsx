import { Form } from "react-bootstrap";

const FocusJournal = ({ journal }) => {
  return (
    <div className="focus-scopes-container d-flex flex-column pt-3 px-3">
      <p className="journal-text">{journal.prompt}</p>
      <Form.Control as="textarea" rows={5} placeholder="Scrivi qui..." className="mb-3 bg-input border-0" />
      <button className="focusfield-btn my-3 ms-auto" style={{ width: "15rem" }}>
        Salva
      </button>
    </div>
  );
};

export default FocusJournal;
