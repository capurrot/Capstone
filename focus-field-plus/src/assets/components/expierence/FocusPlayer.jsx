import { useState, useEffect, useRef } from "react";
import { Container, Image, ListGroup } from "react-bootstrap";
import { MdShuffle, MdRepeat, MdRepeatOne } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { SET_VOLUME, SET_PLAYER_PREFERENCE } from "../../../redux/actions";

const FocusPlayer = ({ playlistUrl, audius }) => {
  const [songIndex, setSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [streamUrl, setStreamUrl] = useState("");
  const [isBuffering, setIsBuffering] = useState(false);

  const audioRef = useRef(null);
  const dispatch = useDispatch();

  const { isMuted, isListVisible, isControlsVisible, repeatMode, isShuffled } = useSelector(
    (state) => state.playerPrefs
  );

  const musicVolume = useSelector((state) => state.sound.musicVolume);

  const setPreference = (key, value) => dispatch({ type: SET_PLAYER_PREFERENCE, payload: { key, value } });

  const toggleList = () => setPreference("isListVisible", !isListVisible);
  const toggleControls = () => setPreference("isControlsVisible", !isControlsVisible);
  const toggleMute = () => {
    if (audioRef.current) {
      const muted = !audioRef.current.muted;
      audioRef.current.muted = muted;
      setPreference("isMuted", muted);
    }
  };
  const toggleLoop = () => {
    const nextMode = repeatMode === "off" ? "all" : repeatMode === "all" ? "one" : "off";
    setPreference("repeatMode", nextMode);
  };
  const toggleShuffle = () => setPreference("isShuffled", !isShuffled);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    dispatch({ type: SET_VOLUME, payload: { musicVolume: newVolume } });
  };

  const fetchPlaylist = async () => {
    try {
      const response = await fetch(playlistUrl);
      if (!response.ok) throw new Error("Errore nel recupero della playlist.");
      const data = await response.json();

      if (data.data[0] && data.data[0].playlist_contents) {
        const trackIds = data.data[0].playlist_contents.map((item) => item.track_id);
        const trackDetails = await Promise.all(
          trackIds.map(async (trackId) => {
            const res = await fetch(`https://api.audius.co/v1/tracks/${trackId}`);
            if (!res.ok) throw new Error(`Errore traccia ${trackId}`);
            return await res.json();
          })
        );
        setTracks(trackDetails);
      } else {
        setError("La playlist non contiene tracce.");
      }
      setLoading(false);
    } catch (err) {
      setError("Errore: " + err.message);
      setLoading(false);
    }
  };

  const loadSong = (index) => {
    const song = tracks[index];
    const url = `https://discoveryprovider.audius.co/v1/tracks/${song.data.id}/stream`;
    setStreamUrl(url);
  };

  const playSong = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.play();
      setIsPlaying(true);
      setIsBuffering(true);
    }
  };

  const pauseSong = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const prevSongPlay = () => {
    setSongIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
    resetAudio();
  };

  const nextSongPlay = () => {
    if (isShuffled) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setSongIndex(randomIndex);
    } else {
      setSongIndex((prev) => (prev === tracks.length - 1 ? 0 : prev + 1));
    }
    resetAudio();
  };

  const resetAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      setProgress(0);
      setCurrentTime("0:00");
    }
  };

  const handleTimeUpdate = (e) => {
    const { currentTime, duration } = e.target;
    setProgress((currentTime / duration) * 100);
    setCurrentTime(formatTime(currentTime));
  };

  const handleLoadedData = (e) => {
    setDuration(formatTime(e.target.duration));
    e.target.volume = musicVolume;
    e.target.muted = isMuted;
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    const width = e.target.clientWidth;
    const offsetX = e.nativeEvent.offsetX;
    if (audio) {
      audio.currentTime = (offsetX / width) * audio.duration;
    }
  };

  const handleAudioEnd = () => {
    if (repeatMode === "one") playSong();
    else if (repeatMode === "all") nextSongPlay();
    else if (songIndex < tracks.length - 1) nextSongPlay();
    else loadSong(0);
  };

  const trackDuration = (e) => formatTime(e);

  useEffect(() => {
    dispatch({ type: SET_VOLUME, payload: { musicVolume: 0.5 } });
  }, []);

  useEffect(() => {
    if (playlistUrl) fetchPlaylist();
  }, [playlistUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
      audioRef.current.muted = isMuted;
    }
  }, [musicVolume, isMuted]);

  useEffect(() => {
    if (tracks.length > 0) loadSong(songIndex);
  }, [songIndex, tracks]);

  useEffect(() => {
    if (streamUrl && isPlaying) {
      setIsBuffering(false);
      setTimeout(() => {
        setIsBuffering(true);
        playSong();
      }, 500);
    }
  }, [streamUrl, isPlaying]);

  if (loading)
    return (
      <Container className="px-lg-0">
        <div className="d-flex justify-content-center align-items-center player" style={{ height: "230px" }}>
          <div className="focusfield-spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        </div>
      </Container>
    );

  if (error) return <p>{error}</p>;
  if (tracks.length === 0) return <p>Nessuna traccia trovata nella playlist.</p>;

  const currentTrack = tracks[songIndex];
  const trackImage = currentTrack.data.artwork["150x150"];

  return (
    <Container className="px-lg-0">
      <div className="player">
        <div className="song-info">
          <div className="song-details d-flex flex-row align-items-center">
            <Image src={trackImage} alt={currentTrack.data.title} width={70} height={70} className="song-image" />
            <div className="d-flex flex-column ms-3">
              <h3 className="m-0 fs-5 song-name">{currentTrack.data.title}</h3>
              <p className="m-0 fs-6 song-artist">{currentTrack.data.user.name}</p>
            </div>
          </div>
        </div>
        <div className="song-duration">
          <div className="song-time" onClick={handleProgressClick} style={isBuffering ? { background: "#ddd" } : {}}>
            <div className="song-progress" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="time">
            <span>{currentTime}</span>
            <div className="controls">
              <button className="player-btn" type="button" onClick={prevSongPlay}>
                <i className="fa-solid fa-backward"></i>
              </button>
              <button
                className="player-btn play-pause"
                type="button"
                onClick={() => (isPlaying ? pauseSong() : playSong())}
              >
                <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
              </button>
              <button className="player-btn next-btn" type="button" onClick={nextSongPlay}>
                <i className="fa-solid fa-forward"></i>
              </button>
            </div>
            <span>{duration}</span>
          </div>
        </div>
        <div className={`volume-controls ${isControlsVisible ? "expanded" : "collapsed"}`}>
          <button className="player-btn volume-btn" type="button" onClick={toggleMute}>
            {isMuted ? <i className="fa-solid fa-volume-mute"></i> : <i className="fa-solid fa-volume-high"></i>}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={musicVolume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
          <button
            className={`player-btn ${repeatMode !== "off" ? "btn-enabled" : ""}`}
            type="button"
            onClick={toggleLoop}
          >
            {repeatMode === "one" ? <MdRepeatOne className="fs-5" /> : <MdRepeat className="fs-5" />}
          </button>
          <button className={`player-btn ${isShuffled ? "btn-enabled" : ""}`} type="button" onClick={toggleShuffle}>
            <MdShuffle className="fs-5" />
          </button>
        </div>
        <div className={`song-list-scroll ${isListVisible ? "expanded" : "collapsed"}`}>
          <ListGroup className="song-list-group">
            {tracks.map((track, index) => (
              <ListGroup.Item
                as="div"
                key={index}
                action
                active={songIndex === index}
                onClick={() => {
                  setSongIndex(index);
                  loadSong(index);
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="py-2 px-3"
              >
                <div className="d-flex flex-row align-items-center">
                  <span className="me-2" style={{ minWidth: "30px" }}>
                    {hoveredIndex === index ? (
                      <button className="hidden-btn" onClick={() => playSong(index)}>
                        <i className="fa-solid fa-play"></i>
                      </button>
                    ) : (
                      `${index + 1}.`
                    )}
                  </span>
                  <Image
                    src={track.data.artwork["150x150"]}
                    alt={track.data.title}
                    width={40}
                    height={40}
                    className="song-image"
                  />
                  <div className="d-flex flex-column ms-3">
                    <strong>{track.data.title}</strong>
                    <small>{track.data.user.name}</small>
                  </div>
                  <div className="ms-auto">
                    <span className="d-none d-lg-inline-block me-1" style={{ minWidth: "40px" }}>
                      {trackDuration(track.data.duration)}
                    </span>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
        <div className="player-footer pb-0">
          <button onClick={toggleControls} className="list-toggle-btn">
            <i className="fs-5 fa-solid fa-music d-flex"></i>
          </button>
          <span>
            <a
              href={`https://audius.co${currentTrack.data.permalink}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--mood-color-11)" }}
            >
              {audius}
            </a>
          </span>
          <button onClick={toggleList} className="list-toggle-btn">
            <i className="fs-5 fa-solid fa-list"></i>
          </button>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={streamUrl || null}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
        onEnded={handleAudioEnd}
      />
    </Container>
  );
};

export default FocusPlayer;
