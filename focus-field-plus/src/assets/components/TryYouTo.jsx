import { Container, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const TryYouTo = () => {
  const { t } = useTranslation();

  return (
    <section className="try-you-to text-white text-center">
      <Container>
        <h2>{t("try.title")}</h2>
        <p>{t("try.text")}</p>
        <Button variant="light">{t("try.button")}</Button>
      </Container>
    </section>
  );
};

export default TryYouTo;
