/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { Container, Image, ListGroup } from "react-bootstrap";
import { MdShuffle, MdRepeat, MdRepeatOne } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { SET_VOLUME } from "../../redux/actions";

const FocusPlayer = ({ playlistUrl }) => {
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
  const [isListVisible, setIsListVisible] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isFavorited, setIsFavorite] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");
  const [isShuffled, setIsShuffled] = useState(false);
  const musicVolume = useSelector((state) => state.sound.musicVolume);
  const dispatch = useDispatch();

  const audioRef = useRef(null);

  const toggleList = () => {
    setIsListVisible((prevState) => !prevState);
  };

  const toggleControls = () => {
    setIsControlsVisible((prevState) => !prevState);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    dispatch({ type: SET_VOLUME, payload: { musicVolume: newVolume } });
  };

  const toggleLoop = () => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
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
            const trackResponse = await fetch(`https://api.audius.co/v1/tracks/${trackId}`);
            if (!trackResponse.ok) throw new Error(`Errore nel recupero della traccia ${trackId}`);
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

  const loadSong = (index) => {
    const song = tracks[index];
    const streamUrl = `https://discoveryprovider.audius.co/v1/tracks/${song.data.id}/stream`;
    setStreamUrl(streamUrl);
  };

  useEffect(() => {
    dispatch({ type: SET_VOLUME, payload: { musicVolume: 0.5 } });
  }, []);

  useEffect(() => {
    if (playlistUrl) fetchPlaylist();
  }, [playlistUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

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

  const playSong = () => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.play();
      setIsPlaying(true);
      setIsBuffering(true);
    }
  };

  const pauseSong = () => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
  };

  const prevSongPlay = () => {
    setSongIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? tracks.length - 1 : prevIndex - 1;
      resetAudio();
      return newIndex;
    });
  };

  const nextSongPlay = () => {
    if (isShuffled) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setSongIndex(randomIndex);
    } else {
      setSongIndex((prevIndex) => {
        const newIndex = prevIndex === tracks.length - 1 ? 0 : prevIndex + 1;
        resetAudio();
        return newIndex;
      });
    }
  };

  const resetAudio = () => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.currentTime = 0;
      setProgress(0);
      setCurrentTime("0:00");
    }
  };

  const handleTimeUpdate = (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    setProgress((currentTime / duration) * 100);

    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    setCurrentTime(`${currentMinutes}:${currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds}`);
  };

  const handleLoadedData = (e) => {
    const totalDuration = e.target.duration;
    const totalMinutes = Math.floor(totalDuration / 60);
    const totalSeconds = Math.floor(totalDuration % 60);
    setDuration(`${totalMinutes}:${totalSeconds < 10 ? `0${totalSeconds}` : totalSeconds}`);

    e.target.volume = musicVolume;
    if (e.target) {
      e.target.volume = musicVolume;
    }
  };

  const handleProgressClick = (e) => {
    const progressWidth = e.target.clientWidth;
    const clickedOffsetX = e.nativeEvent.offsetX;
    const audioElement = audioRef.current;
    const songDuration = audioElement.duration;
    audioElement.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  };

  const trackDuration = (e) => {
    const minutes = Math.floor(e / 60);
    const seconds = e % 60;
    const trackDuration = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    return trackDuration;
  };

  const handleAudioEnd = () => {
    if (repeatMode === "one") {
      playSong();
    } else if (repeatMode === "all") {
      nextSongPlay();
    } else if (repeatMode === "off") {
      if (songIndex < tracks.length - 1) {
        nextSongPlay();
      } else {
        loadSong(0);
      }
    }
  };

  if (loading) return <p>Caricamento playlist...</p>;
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
          {isFavorited && <i className="fa-solid fa-heart"></i>}
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
          {repeatMode === "off" && (
            <button className="player-btn" type="button" onClick={toggleLoop}>
              <MdRepeat className="fs-5" />
            </button>
          )}
          {repeatMode === "all" && (
            <button className="player-btn btn-enabled" type="button" onClick={toggleLoop}>
              <MdRepeat className="fs-5" />
            </button>
          )}
          {repeatMode === "one" && (
            <button className="player-btn btn-enabled" type="button" onClick={toggleLoop}>
              <MdRepeatOne className="fs-5" />
            </button>
          )}

          {isShuffled ? (
            <>
              <button className="player-btn btn-enabled" type="button" onClick={() => setIsShuffled(!isShuffled)}>
                <MdShuffle className="fs-5" />
              </button>
            </>
          ) : (
            <button className="player-btn" type="button" onClick={() => setIsShuffled(!isShuffled)}>
              <MdShuffle className="fs-5" />
            </button>
          )}
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
                        <i className="fa-solid fa-play"></i>{" "}
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
                    <button className="hidden-btn me-2" onClick={() => setIsFavorite(true)}>
                      <i className="fa-solid fa-heart"></i>
                    </button>
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
              Listen to Audius Music
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
