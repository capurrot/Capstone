import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const HowTo = () => {
  const { t } = useTranslation();
  const rawSteps = t("howto.steps", { returnObjects: true });
  const steps = Array.isArray(rawSteps) ? rawSteps : [];

  if (!Array.isArray(steps)) {
    return null;
  }

  return (
    <section className="py-5">
      <Container>
        <h2 className="text-center mb-4">{t("howto.title")}</h2>
        <div className="row row-cols-1 row-cols-md-3 text-center">
          {steps.map((step, index) => (
            <div className="col mb-4" key={index}>
              <div className="p-4 h-100">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default HowTo;
