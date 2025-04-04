import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const HowTo = () => {
  const { t } = useTranslation();
  const steps = t("howto.steps", { returnObjects: true });

  return (
    <section className="py-5">
      <Container>
        <h2 className="text-center mb-4">{t("howto.title")}</h2>
        <div className="row text-center">
          {steps.map((step, index) => {
            const cardClass = index !== 2 ? "p-4 border-bottom border-md-none h-100" : "p-4 border-md-none h-100";

            return (
              <div className="col-md-4 mb-4" key={index}>
                <div className={cardClass}>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default HowTo;
