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
const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";

const apiUrl = import.meta.env.VITE_API_URL;

export const setMood = (mood) => ({
  type: SET_MOOD,
  payload: mood,
});

export const login = (username, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    console.log(apiUrl);
    const response = await fetch(apiUrl + "api/focus-field/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    console.log(response);

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

    const response = await fetch(apiUrl + "api/focus-field/auth/register", {
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

export const loginWithGoogle = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const response = await fetch(apiUrl + "api/focus-field/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Google login failed");
    }

    const result = await response.json();
    const token = result.token;

    const userInfoResponse = await fetch(apiUrl + "api/focus-field/auth/current-user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userInfoResponse.ok) {
      throw new Error("Errore nel recupero dell’utente dopo login Google");
    }

    const fullUserData = await userInfoResponse.json();

    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token,
        user: fullUserData,
      },
    });
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.message,
    });
  }
};

export const fetchUsers = () => {
  return async (dispatch, getState) => {
    const { auth } = getState();
    const token = auth.token;
    console.log(token);
    dispatch({ type: FETCH_USERS_REQUEST });
    try {
      const res = await fetch(apiUrl + "api/focus-field/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      if (!res.ok) {
        throw new Error("Errore nel recupero utenti");
      }
      const data = await res.json();
      dispatch({ type: FETCH_USERS_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: FETCH_USERS_FAILURE, payload: err.message });
    }
  };
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
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
};
