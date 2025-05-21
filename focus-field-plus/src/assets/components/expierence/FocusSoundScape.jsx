import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_VOLUME } from "../../../redux/actions";
import { FaVolumeMute, FaVolumeUp, FaExpand, FaStop, FaCompress } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import { Alert } from "react-bootstrap";

const FocusSoundScape = ({
  backgroundVideo,
  audioSrc,
  soundScape = [],
  suggestion,
  duration = 300,
  moodName,
  onIOSFullscreenChange,
}) => {
  const { t } = useTranslation(moodName, { keyPrefix: "environment" });

  const dispatch = useDispatch();
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [started, setStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [countdown, setCountdown] = useState(duration);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const previousVolumeRef = useRef(null);
  const musicVolume = useSelector((state) => state.sound.musicVolume);

  const handleStart = () => {
    previousVolumeRef.current = musicVolume;
    dispatch({ type: SET_VOLUME, payload: { musicVolume: 0.2 } });

    audioRef.current?.play().catch((err) => console.warn("Audio bloccato:", err.message));
    videoRef.current?.play().catch((err) => console.warn("Video bloccato:", err.message));

    setStarted(true);
    setTimer(0);
    setCountdown(duration);
  };

  const handleStop = () => {
    dispatch({ type: SET_VOLUME, payload: { musicVolume: previousVolumeRef.current ?? 0.5 } });

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    if (containerRef.current?.classList.contains("ios-fullscreen")) {
      containerRef.current.classList.remove("ios-fullscreen");
      if (typeof onIOSFullscreenChange === "function") {
        onIOSFullscreenChange(true); // o false
      }
    }

    setStarted(false);
    setTimer(0);
    setIsMusicMuted(false);
    setIsWarning(false);
  };

  const toggleMusicMute = () => {
    setIsMusicMuted((prev) => {
      const newState = !prev;
      dispatch({ type: SET_VOLUME, payload: { musicVolume: newState ? 0 : 0.2 } });
      return newState;
    });
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isIOS) {
      if (el) {
        const nowFullscreen = !el.classList.contains("ios-fullscreen");
        el.classList.toggle("ios-fullscreen");
        if (typeof onIOSFullscreenChange === "function") {
          onIOSFullscreenChange(nowFullscreen);
        }
      }
      return;
    }

    if (el) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        el.requestFullscreen().catch((err) => console.warn("Fullscreen fallito:", err.message));
      }
    }
  };

  useEffect(() => {
    let interval;
    if (started) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const updated = prev + 1;
          if (updated <= duration) {
            setCountdown((prevCountdown) => Math.max(prevCountdown - 1, 0));
          } else {
            setIsWarning(true);
            setCountdown((prevCountdown) => prevCountdown + 1);
          }
          return updated;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [started, duration]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="sound-scape-container">
      <div ref={containerRef} className="focus-environment position-relative rounded overflow-hidden">
        <video
          ref={videoRef}
          src={backgroundVideo}
          loop
          muted
          playsInline
          preload="metadata"
          className={`w-100 ${!started ? "video-blurred" : ""}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {audioSrc && <audio ref={audioRef} src={audioSrc} loop preload="auto" className="d-none" />}

        <div
          className={`position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex flex-column justify-content-center align-items-center text-center p-4 z-3 overlay-container ${
            started ? "fade-out" : ""
          }`}
          style={{ pointerEvents: started ? "none" : "auto" }}
        >
          {!started && (
            <>
              <h4 className="mb-3">{t("title")}</h4>
              <ul className="list-unstyled mb-3">
                {soundScape.map((sound, idx) => (
                  <li key={idx}>
                    <i className="fas fa-music me-1 text-secondary"></i> {sound}
                  </li>
                ))}
              </ul>
              <button className="focusfield-btn" onClick={handleStart}>
                {t("start")}
              </button>
              {suggestion && (
                <Alert
                  variant="info"
                  className="rounded small mb-3 info-text fs-5 position-absolute bottom-0 start-0 end-0 m-3 d-none d-md-flex align-items-center"
                >
                  <i className="fas fa-info-circle me-1"></i> {t("suggestion")}
                </Alert>
              )}
            </>
          )}
        </div>

        {started && (
          <div className="position-absolute top-0 end-0 m-3 text-end z-2">
            <div className="bg-dark bg-opacity-50 text-white px-3 py-2 rounded-3 small d-flex flex-column align-items-center">
              <div className="text-light text-end small">
                {t("suggestedDuration", { min: Math.floor(duration / 60) })}
              </div>
              <div className="d-flex gap-2 mt-2">
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={toggleMusicMute}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={isMusicMuted ? t("unmute") : t("mute")}
                >
                  {isMusicMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={toggleFullscreen}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={document.fullscreenElement ? t("exitFullscreen") : t("fullscreen")}
                >
                  {document.fullscreenElement ? <FaCompress /> : <FaExpand />}
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleStop}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={t("stop")}
                >
                  <FaStop />
                </button>
              </div>
              <div className={`mt-2 fw-bold fs-3 ${isWarning ? "text-warning" : "text-secondary"}`}>
                {formatTime(countdown)}
              </div>
              <div className="progress mt-2 w-100" style={{ height: "6px" }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${(timer / duration) * 100}%` }}
                ></div>
              </div>
            </div>
            <Tooltip id="tooltip" place="bottom" effect="solid" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusSoundScape;
