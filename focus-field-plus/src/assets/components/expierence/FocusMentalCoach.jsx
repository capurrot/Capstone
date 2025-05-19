import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const FocusMentalCoach = ({ coach, moodName }) => {
  const { t } = useTranslation(moodName, { keyPrefix: "coach" });
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (coach?.steps?.length) {
      const shuffled = [...coach.steps].sort(() => Math.random() - 0.5);
      setSteps(shuffled);
    }
  }, [coach]);

  const currentStep = steps[currentStepIndex];

  const handleOptionClick = (option) => {
    if (showFeedback) return;
    setSelectedOption(option);
    setShowFeedback(true);
    if (option.correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      alert(t("finished", { score, total: steps.length }));
    }
  };

  if (!steps.length) return <p>{t("noSteps")}</p>;
  if (!currentStep) return null;

  return (
    <div className="mental-coach-container">
      <div className="p-4">
        <h4 className="mb-3">{t("obstacle", { current: currentStepIndex + 1, total: steps.length })}</h4>
        <p>
          <strong>{t("situation")}:</strong> {currentStep.situation}
        </p>
        <div className="d-flex flex-column gap-2">
          {currentStep.answers?.map((answer, index) => (
            <Button
              className="focusfield-btn"
              key={index}
              variant={
                showFeedback
                  ? answer.correct
                    ? "success"
                    : answer === selectedOption
                    ? "danger"
                    : "outline-secondary"
                  : "outline-primary"
              }
              onClick={() => handleOptionClick(answer)}
              disabled={showFeedback}
            >
              {answer.text}
            </Button>
          ))}
        </div>
        {showFeedback && (
          <div className="mt-4 text-center">
            <p className="mb-2">
              <strong>{t("feedback")}:</strong>
            </p>
            <p>{selectedOption?.feedback || t("noFeedback")}</p>
            <Button variant="primary" onClick={handleNext} className="focusfield-btn mt-3">
              {t("next")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusMentalCoach;
