import { SET_ALL_MOODS, SET_MOOD } from "../actions";

const initialState = {
  allMoods: [],
  moodsList: [],
  moodsImages: [],
  moodsBackground: [],
  moodsColors: [],
  selectedMood: null,
  isLoading: false,
  hasError: null,
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
    default:
      return state;
  }
};

export default moodReducer;
