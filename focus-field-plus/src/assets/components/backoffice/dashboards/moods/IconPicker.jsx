import { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import bootstrapIcons from "../../../../bootstrap-icons-list.json";

const IconPicker = ({ iconMood, setIconMood }) => {
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredIcons, setFilteredIcons] = useState(bootstrapIcons);

  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const results = bootstrapIcons.filter(({ icon, tags }) => {
      if (icon.toLowerCase().includes(term)) return true;
      return Object.values(tags).some((tagList) => tagList.some((tag) => tag.toLowerCase().includes(term)));
    });

    setFilteredIcons(results);
  }, [searchTerm]);

  return (
    <Form.Group controlId="formIcon">
      <Form.Label className="fw-bold">Icona (Bootstrap icon)</Form.Label>
      <div className="d-flex align-items-center gap-2 mb-2">
        <Form.Control type="text" value={iconMood} onChange={(e) => setIconMood(e.target.value)} />
        <i className={`bi ${iconMood} fs-4 text-secondary`}></i>
        <Button variant="outline-primary" size="sm" onClick={() => setShow(true)}>
          Scegli
        </Button>
      </div>

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Seleziona un'icona</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "600px", overflowY: "auto" }}>
          <Form.Control
            type="text"
            placeholder="Cerca icona..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            {filteredIcons.map(({ icon }) => (
              <Button
                key={icon}
                variant={iconMood === icon ? "primary" : "outline-secondary"}
                className="d-flex align-items-center justify-content-center"
                onClick={() => {
                  setIconMood(icon);
                  setShow(false);
                }}
                style={{ width: "3rem", height: "3rem" }}
              >
                <i className={`bi ${icon} fs-5`}></i>
              </Button>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </Form.Group>
  );
};

export default IconPicker;
