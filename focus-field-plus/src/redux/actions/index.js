const SET_MOOD = "SET_MOOD";
const SET_SESSION = "SET_SESSION";
const SET_USER = "SET_USER";
const SET_ALL_MOODS = "SET_ALL_MOODS";
const SET_VOLUME = "SET_VOLUME";
const SET_PLAYER_PREFERENCE = "SET_PLAYER_PREFERENCE";
const LOGIN_REQUEST = "LOGIN_REQUEST";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_FAILURE = "LOGIN_FAILURE";
const LOGOUT = "LOGOUT";

export const setMood = (mood) => ({
  type: SET_MOOD,
  payload: mood,
});

export const login = (username, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.message,
    });
  }
};

export const logout = () => ({
  type: LOGOUT,
});

export {
  SET_MOOD,
  SET_SESSION,
  SET_USER,
  SET_ALL_MOODS,
  SET_VOLUME,
  SET_PLAYER_PREFERENCE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
};
