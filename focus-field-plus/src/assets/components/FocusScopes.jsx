import { Form } from "react-bootstrap";

const FocusScopes = ({ goals }) => {
  return (
    <div className="focus-scopes-container d-flex flex-column pt-3 px-3">
      <p>{goals.prompt}</p>
      <div className="d-flex flex-column flex-md-row gap-3 align-items-start align-items-md-center my-2">
        <Form.Control type="text" placeholder="Obiettivo n. 1" />
        <span className="mx-auto">
          <i className="fas fa-arrow-right d-none d-md-flex"></i>
          <i class="fas fa-arrow-down d-flex d-md-none"></i>
        </span>
        <Form.Control type="text" placeholder="Come lo raggiungerai" />
      </div>
      <hr />
      <div className="d-flex flex-column flex-md-row gap-3 align-items-start align-items-md-center my-2">
        <Form.Control type="text" placeholder="Obiettivo n. 2" />
        <span className="mx-auto">
          <i className="fas fa-arrow-right d-none d-md-flex"></i>
          <i class="fas fa-arrow-down d-flex d-md-none"></i>
        </span>
        <Form.Control type="text" placeholder="Come lo raggiungerai" />
      </div>
      <hr />
      <div className="d-flex flex-column flex-md-row gap-3 align-items-start align-items-md-center my-2">
        <Form.Control type="text" placeholder="Obiettivo n. 3" />
        <span className="mx-auto">
          <i className="fas fa-arrow-right d-none d-md-flex"></i>
          <i class="fas fa-arrow-down d-flex d-md-none"></i>
        </span>
        <Form.Control type="text" placeholder="Come lo raggiungerai" />
      </div>

      <button className="breathing-btn my-3 mx-auto" style={{ width: "15rem" }}>
        Salva
      </button>
    </div>
  );
};

export default FocusScopes;
