import { Container } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import { useTranslation } from "react-i18next";

const TestimonialsCarousel = () => {
  const { t } = useTranslation();
  const testimonials = t("testimonials.items", { returnObjects: true });
  const groupedTestimonials = [];

  for (let i = 0; i < testimonials.length; i += 3) {
    groupedTestimonials.push(testimonials.slice(i, i + 3));
  }

  return (
    <Container className="pb-5" style={{ marginTop: "6rem" }}>
      <h2 className="text-center mb-4">{t("testimonials.title")}</h2>
      <Carousel indicators={false} interval={8000}>
        {groupedTestimonials.map((group, index) => (
          <Carousel.Item key={index}>
            <div className="row justify-content-center">
              {group.map((t, idx) => (
                <div className="col-md-4 mb-3 d-flex" key={idx} style={{ height: "13rem" }}>
                  <div className="card shadow-sm h-100 p-4 border-0 rounded-4">
                    <p className="text-muted mb-4">“{t.text}”</p>
                    <div className="mt-auto">
                      <h5 className="mb-0">{t.name}</h5>
                      <small className="text-secondary">{t.role}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
};

export default TestimonialsCarousel;
