import { useState, useEffect, useRef } from "react";
import { Container, Image, Button, ListGroup } from "react-bootstrap";

const FocusPlayer = ({ playlistUrl }) => {
  const [songIndex, setSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [streamUrl, setStreamUrl] = useState("");
  const [isListVisible, setIsListVisible] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  const audioRef = useRef(null);

  const toggleList = () => {
    setIsListVisible((prevState) => !prevState);
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
    if (playlistUrl) fetchPlaylist();
  }, [playlistUrl]);

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
    setSongIndex((prevIndex) => {
      const newIndex = prevIndex === tracks.length - 1 ? 0 : prevIndex + 1;
      resetAudio();
      return newIndex;
    });
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
  };

  const handleProgressClick = (e) => {
    const progressWidth = e.target.clientWidth;
    const clickedOffsetX = e.nativeEvent.offsetX; // usa nativeEvent per React
    const audioElement = audioRef.current;
    const songDuration = audioElement.duration;
    audioElement.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  };

  const handleAudioEnd = () => {
    nextSongPlay();
  };

  if (loading) return <p>Caricamento playlist...</p>;
  if (error) return <p>{error}</p>;
  if (tracks.length === 0) return <p>Nessuna traccia trovata nella playlist.</p>;

  const currentTrack = tracks[songIndex];
  const trackImage = currentTrack.data.artwork["150x150"];

  return (
    <Container>
      <div className="player">
        <div className="song-info">
          <div className="song-details d-flex flex-row align-items-center">
            <Image src={trackImage} alt={currentTrack.data.title} width={70} height={70} className="song-image" />
            <div className="d-flex flex-column ms-3">
              <h3 className="m-0 fs-5 song-name">{currentTrack.data.title}</h3>
              <p className="m-0 fs-6 song-artist">{currentTrack.data.user.name}</p>
            </div>
          </div>
          <i className="fa-solid fa-heart"></i>
        </div>

        <div className="song-duration">
          <div className="song-time" onClick={handleProgressClick} style={isBuffering ? { background: "white" } : {}}>
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

        <div className={`song-list-scroll mt-3 ${isListVisible ? "expanded" : "collapsed"}`}>
          <h6 className="mb-2">Playlist</h6>
          <ListGroup className="song-list-group">
            {tracks.map((track, index) => (
              <ListGroup.Item
                key={index}
                action
                active={songIndex === index}
                onClick={() => {
                  setSongIndex(index);
                  loadSong(index);
                }}
                className="py-2 px-3"
              >
                <strong>{track.data.title}</strong>
                <br />
                <small>{track.data.user.name}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        <div className="player-footer pt-3 pb-0">
          <i className="fs-5 fa-solid fa-music d-flex"></i>
          <span>Listen to Audius Music</span>
          <button onClick={toggleList} className="list-toggle-btn">
            <i className={`fs-5 fa-solid ${isListVisible ? "fa-arrow-up" : "fa-list"}`}></i>
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={streamUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
        onEnded={handleAudioEnd}
      />
    </Container>
  );
};

export default FocusPlayer;
