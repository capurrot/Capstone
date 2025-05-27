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
      alert(coach?.finished?.replace("{{score}}", score)?.replace("{{total}}", steps.length));
    }
  };

  if (!steps.length) return <p>{coach?.noSteps}</p>;
  if (!currentStep) return null;

  return (
    <div className="mental-coach-container">
      <div className="p-4">
        <h4 className="mb-3">
          {coach?.obstacle?.replace("{{current}}", currentStepIndex + 1)?.replace("{{total}}", steps.length)}
        </h4>
        <p>
          <strong>{coach?.situation}:</strong> {currentStep.situation}
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
              <strong>{coach?.feedback}:</strong>
            </p>
            <p>{selectedOption?.feedback}</p>
            <Button variant="primary" onClick={handleNext} className="focusfield-btn mt-3">
              {coach?.next}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusMentalCoach;
