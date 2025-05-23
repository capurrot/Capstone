import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useState } from "react";

const FocusCard = ({ mood }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const hexToRgba = (hex, alpha = 0.9) => {
    const cleanHex = hex.replace("#", "");
    const bigint = parseInt(cleanHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
      <div
        className="card-container-mood"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/mood/${mood.slug}`}>
          <Card className="h-100 shadow-sm border-0">
            <div className="card-img-container">
              <Card.Img src={mood.image} alt={t(`mood.${mood.slug}`)} className="card-img-top-full" />
              <div className="card-img-overlay"></div>
            </div>

            <Card.Body
              className="d-flex flex-column justify-content-end align-items-center card-body-mood"
              style={{
                backgroundColor: isHovered && hexToRgba(mood.colors?.[0]),
                transition: "background-color 0.4s ease, color 0.4s ease",
              }}
            >
              <Card.Title
                className="pb-2 d-flex flex-column align-items-center  gap-2 card-body-title"
                style={{ fontFamily: "Fjalla One", color: isHovered && mood.colors?.[1] }}
              >
                <span className="display-3">{t(`mood.${mood.slug}`)}</span>
              </Card.Title>
              {mood.icon && (
                <i
                  className={`bi ${mood.icon} fs-1`}
                  style={{
                    color: isHovered ? mood.colors?.[1] : "#6c757d",
                  }}
                ></i>
              )}
              <Card.Text
                className="card-desc-mood"
                style={{
                  color: isHovered && mood.colors?.[1],
                }}
              >
                {t(`desc.${mood.slug}`)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Link>
      </div>
    </Col>
  );
};

const FocusCards = () => {
  const { t } = useTranslation();
  const moods = useSelector((state) => state.mood.allMoods);
  const moodsToDisplay = Array.isArray(moods) ? moods.slice(0, 4) : [];

  return (
    <Container fluid className="mt-5 px-md-5 pb-5">
      <h2 className="text-center mb-4 fw-bold fs-1">{t("choose_mood")}</h2>
      <Row>
        {moodsToDisplay.map((mood) => (
          <FocusCard key={mood.id} mood={mood} />
        ))}
      </Row>
    </Container>
  );
};

export default FocusCards;
