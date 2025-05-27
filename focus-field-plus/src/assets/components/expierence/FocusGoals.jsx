import { Form } from "react-bootstrap";

const FocusGoals = ({ goals }) => {
  return (
    <div className="focus-scopes-container d-flex flex-column pt-3 px-3">
      <p>{goals?.prompt}</p>

      {[1, 2, 3].map((index) => (
        <div key={index} className="d-flex flex-column flex-md-row gap-3 align-items-start align-items-md-center my-2">
          <Form.Control type="text" placeholder={goals?.goalLabel?.replace("{{index}}", index)} className="bg-input" />
          <span className="mx-auto">
            <i className="fas fa-arrow-right d-none d-md-flex"></i>
            <i className="fas fa-arrow-down d-flex d-md-none"></i>
          </span>
          <Form.Control type="text" placeholder={goals?.how} className="bg-input" />
        </div>
      ))}

      <button className="focusfield-btn my-3 mx-auto" style={{ width: "15rem" }}>
        {goals?.save}
      </button>
    </div>
  );
};

export default FocusGoals;
