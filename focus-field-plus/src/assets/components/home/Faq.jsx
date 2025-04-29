import { useTranslation } from "react-i18next";
import { Container } from "react-bootstrap";

const Faq = () => {
  const { t } = useTranslation();

  return (
    <section className="py-5">
      <Container className="mt-5">
        <h2 className="text-center mb-4">{t("faq.title")}</h2>
        <div className="accordion" id="faqAccordion">
          {[
            {
              id: "One",
              question: t("faq.q1.title"),
              answer: t("faq.q1.body"),
              expanded: true,
            },
            {
              id: "Two",
              question: t("faq.q2.title"),
              answer: t("faq.q2.body"),
            },
            {
              id: "Three",
              question: t("faq.q3.title"),
              answer: t("faq.q3.body"),
            },
            {
              id: "Four",
              question: t("faq.q4.title"),
              answer: t("faq.q4.body"),
            },
          ].map(({ id, question, answer, expanded }) => (
            <div className="accordion-item" key={id}>
              <h2 className="accordion-header" id={`heading${id}`}>
                <button
                  className={`accordion-button ${expanded ? "" : "collapsed"}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${id}`}
                  aria-expanded={expanded ? "true" : "false"}
                  aria-controls={`collapse${id}`}
                >
                  {question}
                </button>
              </h2>
              <div
                id={`collapse${id}`}
                className={`accordion-collapse collapse ${expanded ? "show" : ""}`}
                aria-labelledby={`heading${id}`}
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">{answer}</div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Faq;
