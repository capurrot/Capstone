import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SET_VOLUME } from "../../redux/actions";
import { FaVolumeMute, FaVolumeUp, FaExpand, FaStop, FaCompress } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

const FocusSoundScape = ({ backgroundVideo, audioSrc, soundScape = [], suggestion }) => {
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [started, setStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isMusicMuted, setIsMusicMuted] = useState(false);

  const handleStart = () => {
    dispatch({ type: SET_VOLUME, payload: { musicVolume: 0.2 } });

    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.warn("Audio bloccato:", err.message));
    }

    if (videoRef.current) {
      videoRef.current.play().catch((err) => console.warn("Video bloccato:", err.message));
    }

    setStarted(true);
    setTimer(0);
  };

  const handleStop = () => {
    dispatch({ type: SET_VOLUME, payload: { musicVolume: 0.5 } });

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

    setStarted(false);
    setTimer(0);
    setIsMusicMuted(false);
  };

  const toggleMusicMute = () => {
    setIsMusicMuted((prev) => {
      const newState = !prev;
      dispatch({ type: SET_VOLUME, payload: { musicVolume: newState ? 0 : 0.2 } });
      return newState;
    });
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen().catch((err) => console.warn("Fullscreen fallito:", err.message));
      }
    }
  };

  useEffect(() => {
    let interval;
    if (started) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [started]);

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
          className={`position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex flex-column justify-content-center align-items-center text-white text-center p-4 z-3 overlay-container ${
            started ? "fade-out" : ""
          }`}
          style={{ pointerEvents: started ? "none" : "auto" }}
        >
          {!started && (
            <>
              <h4 className="mb-3">Ambientazione Sonora</h4>

              <ul className="list-unstyled small mb-3">
                {soundScape.map((sound, idx) => (
                  <li key={idx} className="text-light">
                    <i className="fas fa-music me-1 text-secondary"></i> {sound}
                  </li>
                ))}
              </ul>

              {suggestion && (
                <div className="alert alert-info text-dark rounded small mb-3">
                  <i className="fas fa-info-circle me-1"></i> {suggestion}
                </div>
              )}

              <button className="btn btn-light" onClick={handleStart}>
                Avvia ambientazione
              </button>
            </>
          )}
        </div>

        {started && (
          <div className="position-absolute top-0 end-0 m-3 text-end z-2">
            <div className="bg-dark bg-opacity-50 text-white px-3 py-2 rounded-3 small d-flex flex-column align-items-end">
              <div>Tempo: {formatTime(timer)}</div>
              <div className="d-flex gap-2 mt-2">
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={toggleMusicMute}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={isMusicMuted ? "Riattiva musica" : "Muta musica"}
                >
                  {isMusicMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={toggleFullscreen}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={document.fullscreenElement ? "Esci da tutto schermo" : "A tutto schermo"}
                >
                  {document.fullscreenElement ? <FaCompress /> : <FaExpand />}
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleStop}
                  data-tooltip-id="tooltip"
                  data-tooltip-content="Ferma ambientazione"
                >
                  <FaStop />
                </button>
                <Tooltip id="tooltip" place="bottom" effect="solid" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusSoundScape;
