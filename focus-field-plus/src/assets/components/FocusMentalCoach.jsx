import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const FocusMentalCoach = ({ coach }) => {
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
      alert(`Percorso completato! Hai gestito bene ${score} situazioni su ${steps.length}.`);
    }
  };

  if (!steps.length) return <p>Nessun percorso disponibile per questo mood.</p>;
  if (!currentStep) return null;

  return (
    <div className="mental-coach-container">
      <div className="p-4">
        <h4 className="mb-3">
          Ostacolo {currentStepIndex + 1} di {steps.length}
        </h4>
        <p>
          <strong>SITUAZIONE:</strong> {currentStep.situation}
        </p>
        <div className="d-flex flex-column gap-2">
          {currentStep.options.map((option, index) => (
            <Button
              className="focusfield-btn"
              key={index}
              variant={
                showFeedback
                  ? option.correct
                    ? "success"
                    : option === selectedOption
                    ? "danger"
                    : "outline-secondary"
                  : "outline-primary"
              }
              onClick={() => handleOptionClick(option)}
              disabled={showFeedback}
            >
              {option.text}
            </Button>
          ))}
        </div>
        {showFeedback && (
          <div className="position-absolute bottom-0 end-0 p-4">
            <p className="mb-1">
              <strong>Feedback:</strong>
            </p>
            <p>{selectedOption?.correct ? currentStep.feedback.correct : currentStep.feedback.wrong}</p>
            <Button variant="primary" onClick={handleNext} className="focusfield-btn d-block mx-auto">
              Avanti
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusMentalCoach;
