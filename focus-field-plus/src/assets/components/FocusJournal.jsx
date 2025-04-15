import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const FocusJournal = ({ journal }) => {
  const { t } = useTranslation();

  return (
    <div className="focus-scopes-container d-flex flex-column pt-3 px-3">
      <p className="journal-text">{t(journal.prompt)}</p>
      <Form.Control as="textarea" rows={5} placeholder={t(journal.placeholder)} className="mb-3 bg-input border-0" />
      <button className="focusfield-btn my-3 ms-auto" style={{ width: "15rem" }}>
        {t(journal.save)}
      </button>
    </div>
  );
};

export default FocusJournal;
