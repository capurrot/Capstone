import { useEffect, useState, useMemo } from "react";

const BreathingExercise = ({ config }) => {
  const { technique, phases, duration, instructions } = config;

  const [phaseName, setPhaseName] = useState("Inspira");
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(0);
  const [scaleValue, setScaleValue] = useState(1);
  const [totalTimeLeft, setTotalTimeLeft] = useState(duration || 0);

  const steps = useMemo(() => {
    const arr = [];
    if (phases.in) arr.push({ name: "Inspira", time: phases.in });
    if (phases.hold) arr.push({ name: "Trattieni", time: phases.hold });
    if (phases.out) arr.push({ name: "Espira", time: phases.out });
    if (phases.hold2) arr.push({ name: "Trattieni", time: phases.hold2 });
    return arr;
  }, [phases]);

  useEffect(() => {
    if (!isRunning || steps.length === 0) return;

    const current = steps[step % steps.length];
    const totalTime = current.time;
    let timeLeft = totalTime;

    setPhaseName(current.name);
    setPhaseSecondsLeft(timeLeft);

    const start = Date.now();

    const countdownInterval = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const timeLeftNow = Math.max(current.time - elapsed, 0);

      setPhaseSecondsLeft(Math.ceil(timeLeftNow));

      const progress = Math.min(elapsed / current.time, 1);

      if (current.name === "Inspira") {
        setScaleValue(1 + 0.3 * progress);
      } else if (current.name === "Espira") {
        setScaleValue(1.3 - 0.6 * progress);
      } else {
        setScaleValue(1.3);
      }

      if (elapsed >= current.time) {
        clearInterval(countdownInterval);
        setStep((prev) => prev + 1);
      }
    }, 100);

    return () => clearInterval(countdownInterval);
  }, [isRunning, step, steps]);

  useEffect(() => {
    if (!isRunning || !duration) return;

    const stopTimer = setTimeout(() => {
      setIsRunning(false);
      setHasStarted(false);
      setStep(0);
      setPhaseName("Inspira");
      setPhaseSecondsLeft(0);
      setScaleValue(1);
    }, duration * 1000);

    return () => clearTimeout(stopTimer);
  }, [isRunning, duration]);

  useEffect(() => {
    if (!isRunning || !duration) return;

    const interval = setInterval(() => {
      setTotalTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, duration]);

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      setHasStarted(false);
      setStep(0);
      setPhaseName("Inspira");
      setPhaseSecondsLeft(0);
      setScaleValue(1);
      setTotalTimeLeft(duration);
    } else {
      setHasStarted(true);
      console.log("Start", hasStarted);
      setTotalTimeLeft(duration);
      setIsRunning(true);
    }
  };

  return (
    <div className="breathing-container">
      <p className="breathing-technique fst-italic mb-0 pt-4">Tecnica consigliata: {technique}</p>

      {isRunning ? (
        <div className="breathing-phase-text mb-2">{phaseName}</div>
      ) : (
        <div className="breathing-phase-text mb-2" style={{ color: "transparent" }}>
          Seleziona una fase
        </div>
      )}

      <div className="breathing-circle-wrapper">
        <div
          className="breathing-circle-bg"
          style={{
            transform: `scale(${scaleValue})`,
            backgroundColor: phaseName === "Trattieni" ? "var(--mood-color-6)" : "var(--mood-color-6)",
            filter: phaseName === "Trattieni" ? "blur(2px)" : "none",
            backdropFilter: phaseName === "Trattieni" ? "blur(2px)" : "none",
            transition:
              "transform 0.1s linear, background-color 0.5s ease, filter 0.5s ease, backdrop-filter 0.5s ease",
          }}
        ></div>

        <div className="breathing-timer">{phaseSecondsLeft}s</div>
      </div>

      {instructions?.length > 0 && (
        <>
          <ul className="breathing-instructions mt-3 text-center pb-2">
            {instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
          <button
            className="focusfield-btn mt-2 position-absolute"
            style={{ bottom: "65px" }}
            onClick={handleStartStop}
          >
            {isRunning ? "Ferma" : "Avvia"}
          </button>

          {duration && (
            <p
              className="breathing-instructions fw-semibold mb-0"
              style={{ position: "absolute", bottom: "25px", color: "var(--mood-color-6)" }}
            >
              {hasStarted
                ? `Durata: ${Math.floor(totalTimeLeft / 60)} min e ${totalTimeLeft % 60} sec`
                : `Durata: ${Math.floor(duration / 60)} min e ${duration % 60} sec`}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default BreathingExercise;
