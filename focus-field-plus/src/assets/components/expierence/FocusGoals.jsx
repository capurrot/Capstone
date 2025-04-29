import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const FocusGoals = ({ goals, moodName }) => {
  const { t } = useTranslation(moodName, { keyPrefix: "goals" });

  return (
    <div className="focus-scopes-container d-flex flex-column pt-3 px-3">
      <p>{goals?.prompt || t("prompt")}</p>

      {[1, 2, 3].map((index) => (
        <div key={index} className="d-flex flex-column flex-md-row gap-3 align-items-start align-items-md-center my-2">
          <Form.Control type="text" placeholder={t("goal", { index })} />
          <span className="mx-auto">
            <i className="fas fa-arrow-right d-none d-md-flex"></i>
            <i className="fas fa-arrow-down d-flex d-md-none"></i>
          </span>
          <Form.Control type="text" placeholder={t("how")} />
        </div>
      ))}

      <button className="focusfield-btn my-3 mx-auto" style={{ width: "15rem" }}>
        {t("save")}
      </button>
    </div>
  );
};

export default FocusGoals;
