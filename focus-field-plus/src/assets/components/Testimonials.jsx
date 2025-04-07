import Slider from "react-slick";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const TestimonialsCarousel = () => {
  const { t } = useTranslation();
  const testimonials = t("testimonials.items", { returnObjects: true });

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 9000,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1501238295340-c810d3c156d2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "bottom center",
        padding: "5rem 0",
        position: "relative",
      }}
    >
      {/* Overlay soft beige sopra l’immagine */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 1,
        }}
      />

      <Container style={{ position: "relative", zIndex: 2 }}>
        <h2 className="text-center mb-5 display-6 fw-semibold text-white">{t("testimonials.title")}</h2>
        <Slider {...settings}>
          {testimonials.map((t, index) => (
            <div key={index} className="px-3 d-flex h-100">
              <div
                className="bg-white rounded-4 shadow-sm p-4 w-100 h-100 d-flex flex-column"
                style={{ minHeight: "280px" }}
              >
                <p className="text-muted fst-italic mb-4 flex-grow-1 fs-5">“{t.text}”</p>
                <div className="d-flex align-items-center gap-3 mt-auto">
                  <div
                    className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                    style={{ width: "50px", height: "50px", fontWeight: "bold", fontSize: "1.1rem" }}
                  >
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold text-dark">{t.name}</h6>
                    <small className="text-secondary">{t.role}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </Container>
    </div>
  );
};

export default TestimonialsCarousel;
