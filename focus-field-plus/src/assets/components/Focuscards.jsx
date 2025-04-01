import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Focuscards = () => {
  const { t } = useTranslation();
  const moods = useSelector((state) => state.mood.allMoods);
  const selectedMood = useSelector((state) => state.mood.selectedMood);

  const moodsToDisplay = [...moods.filter((mood) => !mood.slug.includes(selectedMood.slug))].slice(0, 8);

  return (
    <Container fluid className="mt-4 px-5">
      <h2 className="text-center mb-4 fw-bold fs-1">{t("choose_mood")}</h2>
      <Row>
        {moodsToDisplay.map((mood) => (
          <Col key={mood.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <div className="card-container">
              <Card className="h-100" style={{ border: "none" }}>
                <div className="card-img-container">
                  <Card.Img src={mood.image} alt={t(`mood.${mood.slug}`)} className="card-img-top-full" />
                  <div className="card-img-overlay"></div>
                </div>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <Card.Title className="display-6 pb-4">{t(`mood.${mood.slug}`)}</Card.Title>
                  <Card.Text className="card-desc">{t(`desc.${mood.slug}`)}</Card.Text>
                  {/* <Button className="button-card">{t("explore")}</Button> */}
                </Card.Body>
              </Card>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Focuscards;
