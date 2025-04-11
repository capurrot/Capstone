import { Form } from "react-bootstrap";

const FocusJournal = ({ journal }) => {
  return (
    <div className="focus-scopes-container d-flex flex-column pt-3 px-3">
      <p>{journal.prompt}</p>
      <Form.Control as="textarea" rows={3} placeholder="Scrivi qui..." className="mb-3 focus-input" />
    </div>
  );
};

export default FocusJournal;
