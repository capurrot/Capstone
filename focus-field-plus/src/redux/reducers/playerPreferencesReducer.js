import { SET_PLAYER_PREFERENCE } from "../actions";

const initialState = {
  isListVisible: false,
  isControlsVisible: false,
  isMuted: false,
  repeatMode: "off",
  isShuffled: false,
};

const playerPreferencesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PLAYER_PREFERENCE:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    default:
      return state;
  }
};

export default playerPreferencesReducer;
