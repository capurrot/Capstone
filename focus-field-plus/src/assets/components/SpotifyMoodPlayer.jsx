import { useEffect, useState } from "react";
import { Client } from "spotify-api.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faForward, faBackward, faShuffle, faRepeat } from "@fortawesome/free-solid-svg-icons";

const SpotifyMoodPlayer = ({ moodData }) => {
  const [client, setClient] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopMode, setLoopMode] = useState("off");

  const tagList = (moodData?.music?.tags || []).map((tag) => tag.toLowerCase().replace(/\s+/g, ""));

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("spotify_token");
      if (!token) return;

      const spotifyClient = await Client.create({ token });
      setClient(spotifyClient);
    };

    init();
  }, []);

  useEffect(() => {
    if (!client || tagList.length === 0) return;

    const searchTracks = async () => {
      const result = await client.tracks.search(tagList[0], { limit: 20 });
      setTracks(result.items);
      if (result.items.length > 0) {
        setCurrentTrack(result.items[0]);
      }
    };

    searchTracks();
  }, [client, tagList]);

  const playTrack = async (uri) => {
    if (!client) return;
    await client.player.play({ uris: [uri] });
    setIsPlaying(true);
  };

  const pauseTrack = async () => {
    if (!client) return;
    await client.player.pause();
    setIsPlaying(false);
  };

  const skipNext = async () => {
    await client.player.skip();
  };

  const skipPrevious = async () => {
    await client.player.previous();
  };

  const toggleShuffle = async () => {
    const playback = await client.player.getCurrentPlayback();
    await client.player.setShuffleState(!playback.shuffle_state);
  };

  const toggleLoop = async () => {
    const newMode = loopMode === "off" ? "context" : loopMode === "context" ? "track" : "off";
    setLoopMode(newMode);
    await client.player.setRepeatState(newMode);
  };

  if (!client || tracks.length === 0)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-light" />
        <p className="mt-3">Caricamento musica da Spotify...</p>
      </div>
    );

  return (
    <div className="spotify-mood-player text-white bg-dark p-4 rounded">
      <h4 className="mb-3">
        Mood: <strong>{tagList[0]}</strong>
      </h4>

      {currentTrack && (
        <div className="d-flex align-items-center mb-3">
          <img
            src={currentTrack.album.images[0]?.url}
            alt={currentTrack.name}
            style={{ width: 100, height: 100, borderRadius: 8, objectFit: "cover", marginRight: 16 }}
          />
          <div>
            <h5>{currentTrack.name}</h5>
            <p>{currentTrack.artists.map((a) => a.name).join(", ")}</p>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-center gap-4 mb-4">
        <button className="btn btn-light" onClick={toggleShuffle}>
          <FontAwesomeIcon icon={faShuffle} />
        </button>
        <button className="btn btn-light" onClick={skipPrevious}>
          <FontAwesomeIcon icon={faBackward} />
        </button>
        <button className="btn btn-success" onClick={() => (isPlaying ? pauseTrack() : playTrack(currentTrack.uri))}>
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
        <button className="btn btn-light" onClick={skipNext}>
          <FontAwesomeIcon icon={faForward} />
        </button>
        <button className="btn btn-light" onClick={toggleLoop}>
          <FontAwesomeIcon icon={faRepeat} />
        </button>
      </div>

      <div className="track-list mt-3">
        {tracks.map((track) => (
          <div
            key={track.id}
            className={`list-group-item list-group-item-action ${
              currentTrack?.id === track.id ? "active-track" : "bg-dark text-white"
            }`}
            onClick={() => {
              setCurrentTrack(track);
              playTrack(track.uri);
            }}
            style={{
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "4px",
              marginBottom: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{track.name}</strong>
              <br />
              <small>{track.artists.map((a) => a.name).join(", ")}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpotifyMoodPlayer;
