import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMoods } from "../../../../../redux/actions";
import { useNavigate } from "react-router";
import { Container, Card, Spinner, Alert, Badge, Row, Col, Button, ButtonGroup, Image } from "react-bootstrap";

const ListMoods = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allMoods, isLoading, hasError } = useSelector((state) => state.mood);

  useEffect(() => {
    dispatch(fetchAllMoods());
  }, [dispatch]);

  const handleEdit = (moodId) => {
    navigate(`/admin/moods/edit/${moodId}`);
  };

  const handleDelete = (moodId) => {
    if (window.confirm("Sei sicuro di voler cancellare questo mood?")) {
      console.log("Mood cancellato:", moodId);
      // dispatch(deleteMood(moodId));
    }
  };

  if (isLoading)
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Caricamento mood...</p>
      </div>
    );

  if (hasError)
    return (
      <Alert variant="danger" className="mt-4">
        Errore: {hasError}
      </Alert>
    );

  if (allMoods.length === 0)
    return (
      <Alert variant="info" className="mt-4">
        Nessun mood disponibile.
      </Alert>
    );

  return (
    <Container className="mt-4 px-0">
      <Row className="g-4">
        {allMoods.map((mood) => (
          <Col xs={12} key={mood.id}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <Card.Title className="mb-0 text-capitalize">
                      <i className={`bi ${mood.icon} me-2`}></i>
                      {mood.slug}
                    </Card.Title>
                    <Badge bg="secondary">#{mood.id}</Badge>
                  </div>

                  <ButtonGroup size="sm">
                    <Button variant="outline-primary" onClick={() => handleEdit(mood.id)}>
                      ✏️ Modifica
                    </Button>
                    <Button variant="outline-danger" onClick={() => handleDelete(mood.id)}>
                      🗑️ Elimina
                    </Button>
                  </ButtonGroup>
                </div>

                <div className="small mb-2">
                  <strong>Opacity:</strong> {mood.opacity}
                </div>

                <div className="small mb-2">
                  <strong>Tags:</strong> <span className="text-muted">{mood.tag.join(", ")}</span>
                </div>

                <div className="small mb-2">
                  <strong>Colors:</strong>
                  <div className="d-flex flex-wrap mt-1" style={{ gap: "4px" }}>
                    {mood.colors.map((color, index) => (
                      <div
                        key={index}
                        title={color}
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: color,
                          border: "1px solid #ccc",
                          borderRadius: "3px",
                        }}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="small mt-3">
                  <div className="d-flex align-items-end justify-content-between gap-3 mt-1">
                    <div>
                      <strong>Image:</strong>
                      <a href={mood.image} target="_blank" rel="noopener noreferrer" className="text-truncate d-block">
                        {mood.image}
                      </a>
                    </div>
                    <Image src={mood.image} alt={mood.slug} thumbnail style={{ width: "100px", height: "auto" }} />
                  </div>
                </div>

                <div className="small mt-3">
                  <div className="d-flex align-items-end justify-content-between gap-3 mt-1">
                    <div>
                      <strong>Background:</strong>
                      <a
                        href={mood.background}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-truncate d-block"
                      >
                        {mood.background}
                      </a>
                    </div>
                    <Image
                      src={mood.background}
                      alt={`${mood.slug}-bg`}
                      thumbnail
                      style={{ width: "100px", height: "auto" }}
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ListMoods;
