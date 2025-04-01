const SET_MOOD = "SET_MOOD";
const SET_SESSION = "SET_SESSION";
const SET_USER = "SET_USER";
const SET_ALL_MOODS = "SET_ALL_MOODS";

export const setMood = (mood) => ({
  type: SET_MOOD,
  payload: mood,
});

export { SET_MOOD, SET_SESSION, SET_USER, SET_ALL_MOODS };
