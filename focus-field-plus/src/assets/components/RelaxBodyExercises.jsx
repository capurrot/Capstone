import { useRef, useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import Pause from "../../assets/images/pause.png";

const RelaxBodyExercises = ({ config }) => {
  const { description, exercises } = config;
  const scrollRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [restartCountdown, setRestartCountdown] = useState(10);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [showArrow, setShowArrow] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [pauseDuration, setPauseDuration] = useState(0);
  const [isPauseStep, setIsPauseStep] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setPauseDuration(5);
  }, []);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;

    const isScrollable = el.scrollHeight > el.clientHeight;
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    setShowArrow(isScrollable);
    setAtBottom(isAtBottom);
  };

  useEffect(() => {
    if (exercises?.length > 0) {
      const total =
        exercises.reduce((acc, ex) => acc + parseInt(ex.duration), 0) + (exercises.length - 1) * pauseDuration;
      setTotalDuration(total);
    }
  }, [exercises, pauseDuration]);

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
    if (!isRunning && !isCompleted && scrollRef.current) {
      const el = scrollRef.current;
      requestAnimationFrame(() => {
        el.scrollTop = 0;
        const isScrollable = el.scrollHeight > el.clientHeight;
        const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
        setShowArrow(isScrollable);
        setAtBottom(isAtBottom);
      });
    }
  }, [isRunning, isCompleted, exercises]);

  useEffect(() => {
    const checkScroll = () => {
      updateScrollState();
    };
    checkScroll();
  }, [exercises]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      updateScrollState();
    };
    handleScroll();
    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [exercises]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStep = async () => {
    setIsRunning(true);
    setIsCompleted(false);
    setCurrentStep(0);
    const total =
      exercises.reduce((acc, ex) => acc + parseInt(ex.duration), 0) + (exercises.length - 1) * pauseDuration;
    setTotalDuration(total);
    setTotalTimeLeft(total);

    for (let i = 0; i < exercises.length; i++) {
      setIsPauseStep(false);
      const ex = exercises[i];
      setCurrentStep(i);
      let seconds = ex.duration;
      while (seconds > 0) {
        setSecondsLeft(seconds);
        setTotalTimeLeft((prev) => prev - 1);
        await new Promise((resolve) => {
          timerRef.current = setTimeout(resolve, 1000);
        });
        seconds--;
      }
      const isLast = i === exercises.length - 1;
      if (!isLast) {
        setIsPauseStep(true);
        let pause = pauseDuration;
        while (pause > 0) {
          setSecondsLeft(pause);
          setTotalTimeLeft((prev) => prev - 1);
          await new Promise((resolve) => {
            timerRef.current = setTimeout(resolve, 1000);
          });
          pause--;
        }
      }
    }

    setIsRunning(false);
    setIsCompleted(true);
  };

  const handleStart = () => {
    handleStep();
  };

  const handleStop = () => {
    clearTimer();
    setIsRunning(false);
    setIsCompleted(false);
    setCurrentStep(0);
    setSecondsLeft(0);
    setTotalTimeLeft(0);
  };

  return (
    <div className="relax-body-container">
      <p className="fst-italic mb-0 pt-4 px-5 text-center">{description}</p>

      {!isRunning && !isCompleted && exercises?.length > 0 && (
        <>
          <div className="scroll-wrapper" ref={scrollRef}>
            <ul className="relax-list list-unstyled mt-3 text-start d-inline-block px-5 mb-0">
              {exercises.map((ex, idx) => (
                <li key={idx} className="mb-3 d-flex flex-column">
                  <strong className="mb-2">
                    {idx + 1}. {ex.name} – {ex.duration}s
                  </strong>
                  <Image
                    src={ex.image}
                    alt={ex.name}
                    className="img-fluid mx-auto mb-2"
                    style={{ maxHeight: "65px" }}
                  />
                  <p className="mb-0 small">{ex.instructions}</p>
                </li>
              ))}
            </ul>
            {showArrow && (
              <button
                onClick={() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollBy({
                      top: atBottom ? -999 : 300,
                      behavior: "smooth",
                    });

                    setTimeout(() => updateScrollState(), 300);
                  }
                }}
                className="scroll-down-arrow"
                title={atBottom ? "Torna su" : "Scorri verso il basso"}
              >
                {atBottom ? "↑" : "↓"}
              </button>
            )}
          </div>
        </>
      )}

      {!isRunning && !isCompleted && (
        <button
          className="focusfield-btn btn-danger position-absolute"
          style={{ bottom: "65px" }}
          onClick={handleStart}
        >
          Avvia
        </button>
      )}

      {!isRunning && (
        <p
          className="breathing-instructions fw-semibold mb-0"
          style={{ position: "absolute", bottom: "25px", color: "var(--mood-color-6)" }}
        >
          Durata: {Math.floor(totalDuration / 60)} min e {totalDuration % 60} sec
        </p>
      )}

      {isRunning && (
        <div className="exercise-box mt-4 text-center px-4">
          <h4>{isPauseStep ? "Pausa" : exercises[currentStep]?.name}</h4>
          {isPauseStep && (
            <Image src={Pause} alt="Pause" className="img-fluid mx-auto mb-2" style={{ maxHeight: "140px" }} />
          )}
          {!isPauseStep && exercises[currentStep]?.image && (
            <Image
              src={exercises[currentStep].image}
              alt={exercises[currentStep].name}
              className="img-fluid mx-auto mb-2"
              style={{ maxHeight: "140px" }}
            />
          )}
          <p className="mb-0">
            {isPauseStep ? "Recupera prima del prossimo esercizio." : exercises[currentStep]?.instructions}
          </p>
          <div className={`${isPauseStep ? "pause-mode" : ""}`}>
            <div className="relax-timer">{secondsLeft}s</div>
          </div>
        </div>
      )}

      {isRunning && (
        <button className="focusfield-btn btn-danger position-absolute" style={{ bottom: "65px" }} onClick={handleStop}>
          Ferma
        </button>
      )}

      {isRunning && (
        <div className="progressbar-container position-absolute" style={{ bottom: "25px", left: "10%", width: "80%" }}>
          <div
            className="progressbar-fill"
            style={{
              width: `${(totalTimeLeft / totalDuration) * 100}%`,
            }}
          ></div>
        </div>
      )}

      {isCompleted && (
        <div className="mt-4 text-center px-4">
          <p className="text-success fw-semibold">Hai completato tutti gli esercizi! ✅</p>
          <p>Tra {restartCountdown} secondi potrai eseguire nuovamente questi esercizi.</p>
        </div>
      )}
    </div>
  );
};

export default RelaxBodyExercises;
