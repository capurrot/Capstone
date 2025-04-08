import React, { useEffect, useState } from "react";
import { PlayFill } from "react-bootstrap-icons";
import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const AudiusMoodPlayer = ({ playlistUrl }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [hoveredTrackIndex, setHoveredTrackIndex] = useState(null);

  const fetchPlaylist = async () => {
    try {
      const response = await fetch(playlistUrl);

      if (!response.ok) {
        throw new Error("Errore nel recupero della playlist.");
      }

      const data = await response.json();

      if (data.data[0] && data.data[0].playlist_contents) {
        const trackIds = data.data[0].playlist_contents.map((item) => item.track_id);

        const trackDetails = await Promise.all(
          trackIds.map(async (trackId) => {
            const trackResponse = await fetch(`https://api.audius.co/v1/tracks/${trackId}`);
            if (!trackResponse.ok) {
              throw new Error(`Errore nel recupero della traccia ${trackId}`);
            }
            const trackData = await trackResponse.json();
            return trackData;
          })
        );

        setTracks(trackDetails);
      } else {
        setError("La playlist non contiene tracce.");
      }

      setLoading(false);
    } catch (err) {
      setError("Impossibile caricare la playlist: " + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (playlistUrl) {
      fetchPlaylist();
    }
  }, [playlistUrl]);

  const handleTrackSelect = (index) => {
    setCurrentTrackIndex(index);
  };

  if (loading) return <p>Caricamento playlist...</p>;
  if (error) return <p>{error}</p>;
  if (tracks.length === 0) return <p>Nessuna traccia trovata nella playlist.</p>;

  const currentTrack = tracks[currentTrackIndex];
  const streamUrl = `https://discoveryprovider.audius.co/v1/tracks/${currentTrack.data.id}/stream`;

  return (
    <div className="audius-player-container">
      <div className="track-details-container">
        <img src={currentTrack.data.artwork["150x150"]} alt={currentTrack.data.title} className="album-art" />
        <div className="track-info">
          <h4 className="m-0 track-title">{currentTrack.data.title}</h4>
          <p className="m-0 artist-name">{currentTrack.data.user.name}</p>
        </div>
      </div>

      <div className="audio-player-container">
        <ReactAudioPlayer
          src={streamUrl}
          autoPlay={true}
          controls
          onPlay={() => console.log("onPlay")}
          onPause={() => console.log("onPause")}
          onClickNext={() => console.log("onClickNext")}
          onEnded={() => setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length)}
          className="audio-player"
        />
      </div>

      <div className="track-list-container">
        <div className="track-list">
          {tracks.map((track, index) => (
            <div
              key={track.data.id + index}
              className={`d-flex align-items-center track-item ${index === currentTrackIndex ? "active-track" : ""}`}
              onClick={() => handleTrackSelect(index)}
              onMouseEnter={() => setHoveredTrackIndex(index)}
              onMouseLeave={() => setHoveredTrackIndex(null)}
            >
              <div className="track-index">
                {index === currentTrackIndex || hoveredTrackIndex === index ? (
                  <PlayFill className="play-icon" style={{ visibility: "visible" }} />
                ) : (
                  <h4 className="me-1 mb-0 fs-6">{index + 1} .</h4>
                )}
              </div>
              <img src={track.data.artwork["150x150"]} alt={track.data.title} className="album-art" />
              <div className="track-info">
                <h4 className="m-0 track-title-list">{track.data.title}</h4>
                <p className="m-0 artist-name-list">{track.data.user.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudiusMoodPlayer;
