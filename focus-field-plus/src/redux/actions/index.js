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

export const FETCH_USER_FAILURE = "FETCH_USER_FAILURE";

export const SET_MOODS_LOADING = "SET_MOODS_LOADING";
export const SET_MOODS_ERROR = "SET_MOODS_ERROR";

export const SET_DASHBOARD_MOOD = "SET_DASHBOARD_MOOD";
export const SET_DASHBOARD_MOOD_LOADING = "SET_DASHBOARD_MOOD_LOADING";
export const SET_DASHBOARD_MOOD_ERROR = "SET_DASHBOARD_MOOD_ERROR";

export const SET_DASHBOARD_MOOD_FIELD = "SET_DASHBOARD_MOOD_FIELD";
export const SET_DASHBOARD_MOOD_INFO = "SET_DASHBOARD_MOOD_INFO";

export const SAVE_MOOD_START = "SAVE_MOOD_START";
export const SAVE_MOOD_SUCCESS = "SAVE_MOOD_SUCCESS";
export const SAVE_MOOD_FAILURE = "SAVE_MOOD_FAILURE";
export const SAVE_MOOD_RESET = "SAVE_MOOD_RESET";

export const START_LOG = "START_LOG";
export const END_LOG = "END_LOG";
export const SET_LOGS = "SET_LOGS";

// 🌍 API base URL
const apiUrl = import.meta.env.VITE_API_URL;
let isUpdate = false;

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

export const setDashboardMoodField = (path, value) => ({
  type: SET_DASHBOARD_MOOD_FIELD,
  payload: { path, value },
});

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

export const loginWithFacebook = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const response = await fetch(`${apiUrl}api/focus-field/auth/facebook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Facebook login failed");
    }

    const result = await response.json();
    const token = result.token;

    const userInfoResponse = await fetch(`${apiUrl}api/focus-field/auth/current-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userInfoResponse.ok) {
      throw new Error("Errore nel recupero dell’utente dopo login Facebook");
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

export const fetchCurrentUser = () => async (dispatch, getState) => {
  const { auth } = getState();
  const token = auth.token;
  if (!token) return;

  try {
    const res = await fetch(`${apiUrl}api/focus-field/auth/current-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Errore nel recupero dell'utente");

    const userData = await res.json();
    dispatch(setUser(userData));
  } catch (error) {
    dispatch({ type: FETCH_USER_FAILURE, payload: error.message });
  }
};

export const fetchMood = (slug, lang) => async (dispatch) => {
  dispatch({ type: SET_DASHBOARD_MOOD_LOADING, payload: true });
  try {
    const response = await fetch(`${apiUrl}api/focus-field/mood/${slug}/${lang}`);
    if (response.status === 404) {
      dispatch({
        type: SET_DASHBOARD_MOOD,
        payload: getEmptyMoodTemplate(slug, lang),
      });
      dispatch({ type: SET_DASHBOARD_MOOD_INFO, payload: "Traduzione da inserire" });
      isUpdate = false;
    } else if (!response.ok) {
      throw new Error("Errore nel recupero del mood");
    } else {
      const data = await response.json();
      dispatch({ type: SET_DASHBOARD_MOOD, payload: data });
      dispatch({ type: SET_DASHBOARD_MOOD_INFO, payload: "" });
      isUpdate = true;
      console.log("Dati mood:", data);
    }
  } catch (error) {
    dispatch({ type: SET_DASHBOARD_MOOD_ERROR, payload: error.message });

    return null;
  } finally {
    dispatch({ type: SET_DASHBOARD_MOOD_LOADING, payload: false });
  }
};

const getEmptyMoodTemplate = (slug, lang) => ({
  slug,
  lang,
  name: "",
  description: "",
  imagine: "",
  helpYou: "",
  durationSuggestion: "",
  music: {
    title: "",
    playlistUrl: "",
    tags: "",
    scope: "",
  },
  breathing: {
    enabled: false,
    technique: "",
    totalDuration: 0,
    phases: [],
    rounds: "",
    scope: "",
    start: "",
    stop: "",
    techniqueLabel: "",
    totalDurationLabel: "",
  },
  relaxBody: {
    enabled: false,
    description: "",
    pauseDuration: 5,
    exercises: [],
    title: "",
    scrollDown: "",
    scrollUp: "",
    completed: "",
    repeatIn: "",
    start: "",
    stop: "",
    pause: "",
    pauseText: "",
    duration: 0,
  },
  journalPre: {
    enabled: false,
    prompt: "",
    placeholder: "",
    save: "",
    optional: false,
  },
  journalPost: {
    enabled: false,
    prompt: "",
    placeholder: "",
    save: "",
    optional: false,
  },
  spiritual: {
    enabled: false,
    type: "",
    verse: "",
    text: "",
  },
  coach: {
    enabled: false,
    intro: "",
    obstacle: "",
    situation: "",
    feedback: "",
    next: "",
    finished: "",
    noSteps: "",
    steps: [],
  },
  environment: {
    enabled: false,
    title: "",
    suggestion: "",
    duration: 0,
    suggestedDuration: "",
    backgroundImage: "",
    backgroundVideo: "",
    audioSrc: "",
    soundscape: "",
    start: "",
    stop: "",
    mute: "",
    unmute: "",
    fullscreen: "",
    exitFullscreen: "",
  },
  moodModal: {
    loading: "",
    notFound: "",
    infoModal: {
      title: "",
    },
    ctaModal: {
      defaultText: "",
    },
    title: {
      [slug]: "",
    },
    desc: {
      [slug]: "",
    },
    sections: {
      music: "",
      goals: "",
      preJournal: "",
      breathing: "",
      relaxBody: "",
      coach: "",
      ambient: "",
      spiritual: "",
      postJournal: "",
    },
  },
  cta: {
    actionCta: "",
    text: "",
  },
});

export const saveMoodAndTranslation =
  (moodListId, moodListNew, moodRequest, token, selectedLang) => async (dispatch) => {
    dispatch({ type: SAVE_MOOD_START });
    try {
      const res1 = await fetch(`${apiUrl}api/focus-field/moods/${moodListId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(moodListNew),
      });

      if (!res1.ok) throw new Error("Errore durante il salvataggio dei dati principali del mood.");

      const method = isUpdate ? "PUT" : "POST";
      const url = isUpdate
        ? `${apiUrl}api/focus-field/mood/${moodRequest.slug}/${selectedLang}`
        : `${apiUrl}api/focus-field/mood`;
      const res2 = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(moodRequest),
      });

      if (!res2.ok) throw new Error("Errore durante il salvataggio della traduzione del mood.");
      dispatch({ type: SAVE_MOOD_SUCCESS });
    } catch (error) {
      console.error("Errore salvataggio mood:", error);
      dispatch({ type: SAVE_MOOD_FAILURE, payload: error.message });
    }
  };

export const startMoodLog = (userId, moodSlug, language) => async (dispatch) => {
  try {
    const res = await fetch(apiUrl + "api/focus-field/log/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, moodSlug, language }),
    });

    if (!res.ok) throw new Error("Errore nell'avvio del log");

    const data = await res.json();
    console.log("Dati del log:", data);
    dispatch({ type: START_LOG, payload: data });
    localStorage.setItem("logId", data.id);
  } catch (error) {
    console.error("Errore durante startMoodLog:", error);
  }
};

export const endMoodLog = (logId) => async (dispatch) => {
  try {
    const res = await fetch(`${apiUrl}api/focus-field/log/end/${logId}`, {
      method: "PUT",
    });

    if (!res.ok) throw new Error("Errore nella chiusura del log");

    await res.json();
    dispatch({ type: END_LOG });
  } catch (error) {
    console.error("Errore durante endMoodLog:", error);
  }
};
