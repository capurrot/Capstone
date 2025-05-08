// 🎯 Action Types
export const SET_MOOD = "SET_MOOD";
export const SET_SESSION = "SET_SESSION";
export const SET_USER = "SET_USER";
export const SET_ALL_MOODS = "SET_ALL_MOODS";
export const SET_VOLUME = "SET_VOLUME";
export const SET_PLAYER_PREFERENCE = "SET_PLAYER_PREFERENCE";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const LOGOUT = "LOGOUT";

export const REGISTER_USER = "REGISTER_USER";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";

export const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
export const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
export const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";

export const SET_MOODS_LOADING = "SET_MOODS_LOADING";
export const SET_MOODS_ERROR = "SET_MOODS_ERROR";

// 🌍 API base URL
const apiUrl = import.meta.env.VITE_API_URL;

// ✅ Action Creators

export const setMood = (mood) => ({
  type: SET_MOOD,
  payload: mood,
});

export const setAllMoods = (moods) => ({
  type: SET_ALL_MOODS,
  payload: moods,
});

export const setMoodsLoading = (isLoading) => ({
  type: SET_MOODS_LOADING,
  payload: isLoading,
});

export const setMoodsError = (error) => ({
  type: SET_MOODS_ERROR,
  payload: error,
});

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const logout = () => ({
  type: LOGOUT,
});

// ✅ Thunks

export const fetchAllMoods = () => {
  return async (dispatch) => {
    dispatch(setMoodsLoading(true));
    try {
      const response = await fetch(`${apiUrl}api/focus-field/moods`);
      if (!response.ok) throw new Error("Errore nella fetch dei moods");
      const data = await response.json();
      dispatch(setAllMoods(data));
      dispatch(setMoodsLoading(false));
    } catch (error) {
      dispatch(setMoodsError(error.message));
      dispatch(setMoodsLoading(false));
    }
  };
};

export const login = (username, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await fetch(`${apiUrl}api/focus-field/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    dispatch({ type: LOGIN_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.message });
  }
};

export const loginWithGoogle = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const response = await fetch(`${apiUrl}api/focus-field/auth/google`, {
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

    const userInfoResponse = await fetch(`${apiUrl}api/focus-field/auth/current-user`, {
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

export const registerUser = (formData) => async (dispatch) => {
  try {
    const cleanData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      nome: formData.nome,
      cognome: formData.cognome,
    };

    const response = await fetch(`${apiUrl}api/focus-field/auth/register`, {
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

export const fetchUsers = () => {
  return async (dispatch, getState) => {
    const { auth } = getState();
    const token = auth.token;
    dispatch({ type: FETCH_USERS_REQUEST });

    try {
      const response = await fetch(`${apiUrl}api/focus-field/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Errore nel recupero utenti");
      }

      const data = await response.json();
      dispatch({ type: FETCH_USERS_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: FETCH_USERS_FAILURE, payload: err.message });
    }
  };
};
