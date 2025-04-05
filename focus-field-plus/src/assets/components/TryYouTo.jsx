import { Container, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const TryYouTo = () => {
  const { t } = useTranslation();

  return (
    <section className="try-you-to py-5 text-white text-center">
      <Container>
        <div className="mb-3">
          <div
            className="d-inline-flex align-items-center justify-content-center bg-white bg-opacity-10 rounded-circle"
            style={{ width: 128, height: 128 }}
          >
            <span role="img" aria-label="rocket" style={{ fontSize: "3rem" }}>
              🚀
            </span>
          </div>
        </div>
        <h2 className="display-6 fw-bold mb-3">{t("try.title")}</h2>
        <p className="lead mb-4">{t("try.text")}</p>
        <Button variant="light" size="lg">
          {t("try.button")}
        </Button>
      </Container>
    </section>
  );
};

export default TryYouTo;
