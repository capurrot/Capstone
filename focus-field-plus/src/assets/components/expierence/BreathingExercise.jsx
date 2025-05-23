import { useEffect, useState, useMemo } from "react";

const BreathingExercise = ({ config }) => {
  const { technique, techniqueLabel, phases, start, stop, totalDuration, totalDurationLabel } = config;

  const [phaseName, setPhaseName] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(0);
  const [scaleValue, setScaleValue] = useState(1);
  const [totalTimeLeft, setTotalTimeLeft] = useState(totalDuration || 0);

  const steps = useMemo(() => {
    if (!Array.isArray(phases)) return [];

    return phases.map((p) => {
      return {
        name: p.phaseLabel,
        phase: p.phase,
        duration: p.duration,
      };
    });
  }, [phases]);

  const instructions = useMemo(() => {
    if (!Array.isArray(phases)) return [];

    return phases.map((p) => {
      const label = p.phaseLabel || p.phase;
      const mode = p.mode ? `${p.mode.toLowerCase()}` : "";
      return `${label}${mode ? " " + mode : ""} per ${p.duration} secondi`;
    });
  }, [phases]);

  useEffect(() => {
    if (!isRunning || steps.length === 0) return;

    const current = steps[step % steps.length];
    setPhaseName(current.name);
    setPhaseSecondsLeft(current.duration);

    const start = Date.now();

    const countdownInterval = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const remaining = Math.max(current.duration - elapsed, 0);
      setPhaseSecondsLeft(Math.ceil(remaining));

      const progress = Math.min(elapsed / current.duration, 1);

      if (current.phase === "in") {
        setScaleValue(1 + 0.3 * progress);
      } else if (current.phase === "out") {
        setScaleValue(1.3 - 0.3 * progress);
      } else {
        setScaleValue(1.3);
      }

      if (elapsed >= current.duration) {
        clearInterval(countdownInterval);
        setStep((prev) => prev + 1);
      }
    }, 100);

    return () => clearInterval(countdownInterval);
  }, [isRunning, step, steps]);

  useEffect(() => {
    if (!isRunning || !totalDuration) return;

    const timeout = setTimeout(() => {
      setIsRunning(false);
      setHasStarted(false);
      setStep(0);
      setPhaseName("");
      setPhaseSecondsLeft(0);
      setScaleValue(1);
    }, totalDuration * 1000);

    return () => clearTimeout(timeout);
  }, [isRunning, totalDuration]);

  useEffect(() => {
    if (!isRunning || !totalDuration) return;

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
  }, [isRunning, totalDuration]);

  const handleStartStop = () => {
    if (isRunning || hasStarted) {
      setIsRunning(false);
      setHasStarted(false);
      setStep(0);
      setPhaseName("");
      setPhaseSecondsLeft(0);
      setScaleValue(1);
      setTotalTimeLeft(totalDuration);
    } else {
      setHasStarted(true);
      setStep(0);
      setPhaseName(steps[0]?.name || "");
      setPhaseSecondsLeft(steps[0]?.duration || 0);
      setScaleValue(1);
      setTotalTimeLeft(totalDuration);
      setIsRunning(true);
    }
  };

  return (
    <div className="breathing-container">
      <p className="breathing-technique fst-italic mb-0 pt-4">{techniqueLabel + ": " + technique}</p>

      <div className="breathing-phase-text mb-2">
        {isRunning ? phaseName : <span style={{ color: "transparent" }}> Attesa</span>}
      </div>

      <div className="breathing-circle-wrapper">
        <div
          className="breathing-circle-bg"
          style={{
            transform: `scale(${scaleValue})`,
            backgroundColor: "var(--mood-color-6)",
            filter: phaseName === "hold" ? "blur(2px)" : "none",
            backdropFilter: phaseName === "hold" ? "blur(2px)" : "none",
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
            {isRunning ? stop : start}
          </button>

          {!hasStarted && (
            <p
              className="breathing-instructions fw-semibold mb-0"
              style={{ position: "absolute", bottom: "25px", color: "var(--mood-color-6)" }}
            >
              {totalDurationLabel}: {Math.floor(totalDuration / 60)} min
              {totalDuration % 60 !== 0 ? ` e ${totalDuration % 60} sec` : ""}
            </p>
          )}

          {hasStarted && (
            <div
              className="progressbar-container position-absolute"
              style={{ bottom: "25px", left: "10%", width: "80%" }}
            >
              <div className="progressbar-fill" style={{ width: `${(totalTimeLeft / totalDuration) * 100}%` }}></div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BreathingExercise;
