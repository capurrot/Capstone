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
const REGISTER_USER = "REGISTER_USER";
const REGISTER_SUCCESS = "REGISTER_SUCCESS";
const REGISTER_FAIL = "REGISTER_FAIL";

export const setMood = (mood) => ({
  type: SET_MOOD,
  payload: mood,
});

export const login = (username, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const response = await fetch("http://localhost:8080/api/focus-field/auth/login", {
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

export const registerUser = (formData) => async (dispatch) => {
  try {
    const cleanData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      nome: formData.nome,
      cognome: formData.cognome,
    };

    const response = await fetch("http://localhost:8080/api/focus-field/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Errore nella registrazione");
    }

    const data = await response.json();
    dispatch({ type: REGISTER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: REGISTER_FAIL, payload: error.message });
  }
};

export const logout = () => ({
  type: LOGOUT,
});

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
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
  REGISTER_USER,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
};
