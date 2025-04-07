import { useEffect, useState, useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const AudiusPlaylistPlayer = ({ moodData }) => {
  const tagList = (moodData?.music?.tags || []).map((tag) => tag.toLowerCase().replace(/\s+/g, ""));
  const [tracks, setTracks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStreamUrl, setCurrentStreamUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const listRefs = useRef([]);
  const listContainerRef = useRef(null);

  const getStreamUrl = async (id) => {
    const res = await fetch(`https://discoveryprovider.audius.co/v1/tracks/${id}/stream?app_name=focusfield`);
    return res.url;
  };

  useEffect(() => {
    const fetchAudiusTracks = async () => {
      try {
        const keyword = tagList[0];
        const res = await fetch(
          `https://discoveryprovider.audius.co/v1/tracks/search?query=${keyword}&limit=25&app_name=focusfield`
        );
        const data = await res.json();
        setTracks(data.data);
        setCurrentIndex(0);
        setLoading(false);
      } catch (err) {
        console.error("Errore nel caricamento da Audius:", err);
      }
    };

    fetchAudiusTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchStream = async () => {
      if (tracks[currentIndex]) {
        const url = await getStreamUrl(tracks[currentIndex].id);
        setCurrentStreamUrl(url);
      }
    };
    fetchStream();
  }, [currentIndex, tracks]);

  useEffect(() => {
    const currentRef = listRefs.current[currentIndex];
    if (currentRef) {
      currentRef.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < tracks.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  if (loading || tracks.length === 0 || !currentStreamUrl)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
        <p className="mt-3">Caricamento musica rilassante...</p>
      </div>
    );

  const currentTrack = tracks[currentIndex];

  return (
    <div className="audius-playlist-player text-white bg-dark p-4 rounded">
      <div className="d-flex align-items-center mb-3">
        <img
          src={currentTrack.artwork?.["150x150"] || "/placeholder.jpg"}
          alt={currentTrack.title}
          style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", marginRight: "16px" }}
        />
        <div>
          <h5 className="mb-1">{currentTrack.title}</h5>
          <p className="mb-1" style={{ fontSize: "0.9rem" }}>
            {currentTrack.user?.name}
          </p>
          <a
            href={`https://audius.co${currentTrack.permalink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-light"
            style={{ fontSize: "0.8rem" }}
          >
            Vai alla traccia su Audius
          </a>
        </div>
      </div>

      <AudioPlayer
        src={currentStreamUrl}
        autoPlayAfterSrcChange={true}
        layout="horizontal"
        customAdditionalControls={[]}
        showJumpControls={false}
        showSkipControls={true}
        onClickPrevious={handlePrevious}
        onClickNext={handleNext}
        onEnded={handleNext}
        style={{ borderRadius: "10px" }}
      />

      <div className="track-list mt-4" ref={listContainerRef} style={{ maxHeight: "200px", overflowY: "auto" }}>
        {tracks.map((track, index) => (
          <div
            ref={(el) => (listRefs.current[index] = el)}
            key={track.id}
            className={`list-group-item list-group-item-action ${
              index === currentIndex ? "bg-primary text-white" : "bg-dark text-white"
            }`}
            style={{
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "4px",
              marginBottom: "4px",
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => setCurrentIndex(index)}
          >
            {index === currentIndex && <span className="me-2">🔊</span>}
            <div>
              <strong>{track.title}</strong>
              <br />
              <small>{track.user?.name}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudiusPlaylistPlayer;
