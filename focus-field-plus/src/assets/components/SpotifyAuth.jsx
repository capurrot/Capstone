import { useEffect } from "react";
import { useNavigate } from "react-router";

const CLIENT_ID = "71f5fda6406c46abb9d0da4ceb1785d5";
const REDIRECT_URI = "http://localhost:5173/callback";
const SCOPES = [
  "user-read-playback-state",
  "user-modify-playback-state",
  "streaming",
  "user-read-currently-playing",
].join(" ");

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

const SpotifyAuth = () => {
  const navigate = useNavigate();

  const login = () => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES)}`;
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = hash
        .substring(1)
        .split("&")
        .find((param) => param.startsWith("access_token"))
        ?.split("=")[1];

      if (token) {
        localStorage.setItem("spotify_token", token);
        navigate("/");
      }
    }
  }, [navigate]);

  return (
    <div className="text-center p-5">
      <h2>🎧 Connetti il tuo account Spotify</h2>
      <button onClick={login} className="btn btn-success mt-4">
        Login con Spotify
      </button>
    </div>
  );
};

export default SpotifyAuth;
