import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const FocusCards = () => {
  const { t } = useTranslation();
  const moods = useSelector((state) => state.mood.allMoods);
  const selectedMood = useSelector((state) => state.mood.selectedMood);

  const moodsToDisplay = Array.isArray(moods)
    ? moods.filter((mood) => !mood.slug.includes(selectedMood?.slug)).slice(0, 8)
    : [];

  return (
    <Container fluid className="mt-5 px-md-5 pb-5">
      <h2 className="text-center mb-4 fw-bold fs-1">{t("choose_mood")}</h2>
      <Row>
        {moodsToDisplay.map((mood) => (
          <Col key={mood.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <div className="card-container">
              <Card className="h-100 shadow-sm border-0">
                <div className="card-img-container">
                  <Card.Img src={mood.image} alt={t(`mood.${mood.slug}`)} className="card-img-top-full" />
                  <div className="card-img-overlay"></div>
                </div>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <Card.Title className="pb-2 d-flex flex-column align-items-center gap-2">
                    <span className="display-5">{t(`mood.${mood.slug}`)}</span>
                    {mood.icon && <i className={`bi ${mood.icon} fs-1 text-secondary`}></i>}
                  </Card.Title>
                  <Card.Text className="card-desc">{t(`desc.${mood.slug}`)}</Card.Text>
                  <Link to={`/mood/${mood.slug}`} className="stretched-link"></Link>
                </Card.Body>
              </Card>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FocusCards;
