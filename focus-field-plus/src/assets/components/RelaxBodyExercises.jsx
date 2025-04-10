import { useState, useEffect } from "react";
import { Image } from "react-bootstrap";

const RelaxBodyExercises = ({ config }) => {
  const { description, exercises } = config;
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [restartCountdown, setRestartCountdown] = useState(10);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [startTimestamp, setStartTimestamp] = useState(null);

  useEffect(() => {
    if (!isRunning || currentStep >= exercises.length) return;

    const duration = parseInt(exercises[currentStep].duration);
    setSecondsLeft(currentStep === 0 ? duration : duration - 1);

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          setTimeout(() => {
            const next = currentStep + 1;
            if (next < exercises.length) {
              setCurrentStep(next);
            } else {
              setIsRunning(false);
              setIsCompleted(true);
            }
          }, 1000);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, currentStep, exercises]);

  useEffect(() => {
    if (exercises?.length > 0) {
      const total = exercises.reduce((acc, ex) => acc + parseInt(ex.duration), 0);
      setTotalDuration(total);
    }
  }, [exercises]);

  useEffect(() => {
    if (isCompleted) {
      let seconds = 10;
      setRestartCountdown(seconds);

      const interval = setInterval(() => {
        seconds--;
        setRestartCountdown(seconds);

        if (seconds <= 0) {
          clearInterval(interval);

          setIsCompleted(false);
          setCurrentStep(0);
          setSecondsLeft(0);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isCompleted]);

  useEffect(() => {
    if (!isRunning || !startTimestamp || totalDuration === 0) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
      const remaining = totalDuration - elapsed;

      setTotalTimeLeft(remaining > 0 ? remaining : 0);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTimestamp, totalDuration]);

  const handleStart = () => {
    setStartTimestamp(Date.now());
    const total = exercises.reduce((acc, ex) => acc + parseInt(ex.duration), 0);
    setTotalDuration(total);
    setTotalTimeLeft(total);
    setIsRunning(true);
    setIsCompleted(false);
    setCurrentStep(0);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setCurrentStep(0);
    setSecondsLeft(0);
  };

  return (
    <div className="relax-body-container">
      <p className="fst-italic mb-0 pt-4 px-4">{description}</p>

      {!isRunning && !isCompleted && exercises?.length > 0 && (
        <ul className="relax-list list-unstyled mt-3 text-start d-inline-block px-4 mb-0">
          {exercises.map((ex, idx) => (
            <li key={idx} className="mb-3 d-flex flex-column">
              <strong className="mb-2">
                {idx + 1}. {ex.name} – {ex.duration}s
              </strong>
              <Image src={ex.image} alt={ex.name} width={65} className="img-fluid mx-auto mb-2" />
              <p className="mb-0 small">{ex.instructions}</p>
            </li>
          ))}
        </ul>
      )}

      {!isRunning && !isCompleted && (
        <button className="breathing-btn" onClick={handleStart}>
          Avvia
        </button>
      )}

      {!isRunning && (
        <p
          className="breathing-instructions fw-semibold mb-0"
          style={{ position: "absolute", bottom: "25px", color: "var(--mood-text-1)" }}
        >
          Durata: {Math.floor(totalDuration / 60)} min e {totalDuration % 60} sec
        </p>
      )}

      {isRunning && (
        <div className="exercise-box mt-4 text-center px-4">
          <h4>{exercises[currentStep].name}</h4>
          <Image
            src={exercises[currentStep].image}
            alt={exercises[currentStep].name}
            width={140}
            className="img-fluid mx-auto mb-2"
          />
          <p>{exercises[currentStep].instructions}</p>
          <div className="relax-circle-wrapper my-3">
            <div className="relax-circle-bg">
              <div className="relax-timer">{secondsLeft}s</div>
            </div>
          </div>
        </div>
      )}

      {isRunning && (
        <button className="breathing-btn btn-danger" onClick={handleStop}>
          Ferma
        </button>
      )}

      {isRunning && (
        <p
          className="breathing-instructions fw-semibold mb-0"
          style={{ position: "absolute", bottom: "25px", color: "var(--mood-text-1)" }}
        >
          Durata: {Math.floor(totalTimeLeft / 60)} min e {totalTimeLeft % 60} sec
        </p>
      )}

      {isCompleted && (
        <div className="mt-4 text-center px-4">
          <p className="text-success fw-semibold">Hai completato tutti gli esercizi! ✅</p>
          <p>Tra {restartCountdown} secondi tornerai eseguire nuovamente questi esercizi.</p>
        </div>
      )}
    </div>
  );
};

export default RelaxBodyExercises;
