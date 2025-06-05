import {
  SAVE_MOOD_FAILURE,
  SAVE_MOOD_RESET,
  SAVE_MOOD_START,
  SAVE_MOOD_SUCCESS,
  SET_ALL_MOODS,
  SET_DASHBOARD_MOOD,
  SET_DASHBOARD_MOOD_ERROR,
  SET_DASHBOARD_MOOD_FIELD,
  SET_DASHBOARD_MOOD_INFO,
  SET_DASHBOARD_MOOD_LOADING,
  SET_MOOD,
} from "../actions";
import set from "lodash/set";
import cloneDeep from "lodash/cloneDeep";

const initialState = {
  allMoods: [],
  moodsList: [],
  moodsImages: [],
  moodsBackground: [],
  moodsColors: [],
  selectedMood: null,
  isLoading: false,
  hasError: null,
  dashboardMood: null,
  dashboardMoodLoading: false,
  dashboardMoodError: null,
  dashboardMoodInfo: null,
  saveMoodLoading: false,
  saveMoodSuccess: null,
  saveMoodError: null,
};

const moodReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MOOD:
      return {
        ...state,
        selectedMood: action.payload,
      };
    case SET_ALL_MOODS:
      return {
        ...state,
        allMoods: action.payload,
      };
    case SET_DASHBOARD_MOOD:
      return {
        ...state,
        dashboardMood: action.payload,
      };
    case SET_DASHBOARD_MOOD_LOADING:
      return {
        ...state,
        dashboardMoodLoading: action.payload,
      };
    case SET_DASHBOARD_MOOD_ERROR:
      return {
        ...state,
        dashboardMoodError: action.payload,
      };
    case SET_DASHBOARD_MOOD_INFO:
      return {
        ...state,
        dashboardMoodInfo: action.payload,
      };
    case SET_DASHBOARD_MOOD_FIELD: {
      const updated = cloneDeep(state.dashboardMood);
      set(updated, action.payload.path, action.payload.value);
      return {
        ...state,
        dashboardMood: updated,
      };
    }
    case SAVE_MOOD_RESET:
      return { ...state, saveMoodLoading: false, saveMoodSuccess: null, saveMoodError: null };
    case SAVE_MOOD_START:
      return { ...state, saveMoodLoading: true, saveMoodSuccess: null, saveMoodError: null };
    case SAVE_MOOD_SUCCESS:
      return { ...state, saveMoodLoading: false, saveMoodSuccess: true };
    case SAVE_MOOD_FAILURE:
      return { ...state, saveMoodLoading: false, saveMoodSuccess: false, saveMoodError: action.payload };
    default:
      return state;
  }
};

export default moodReducer;
