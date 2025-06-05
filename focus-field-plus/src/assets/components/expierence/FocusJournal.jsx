import { useState } from "react";
import { useDispatch } from "react-redux";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { saveJournalEntry } from "../../../redux/actions";

const FocusJournal = ({ journal, type }) => {
  const { t } = useTranslation();
  const [entry, setEntry] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const dispatch = useDispatch();

  const handleSave = () => {
    if (isSaved) {
      setIsSaved(false);
    } else {
      dispatch(saveJournalEntry({ type, content: entry }));
      setIsSaved(true);
    }
  };

  return (
    <div className="focus-scopes-container d-flex flex-column pt-3 px-3">
      <p className="journal-text">{t(journal.prompt)}</p>
      <Form.Control
        as="textarea"
        rows={5}
        placeholder={t(journal.placeholder)}
        className="mb-3 bg-input border-0"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        readOnly={isSaved}
      />
      <button className="focusfield-btn my-3 ms-auto" style={{ width: "15rem" }} onClick={handleSave}>
        {isSaved ? t("Modifica") : t(journal.save)}
      </button>
    </div>
  );
};

export default FocusJournal;
