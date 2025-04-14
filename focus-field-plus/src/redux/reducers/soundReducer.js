import { SET_VOLUME } from "../actions";

const initialState = {
  musicVolume: 0.5,
  soundscapeVolume: 1,
};

const soundReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VOLUME:
      return {
        ...state,
        musicVolume: action.payload.musicVolume ?? state.musicVolume,
        soundscapeVolume: action.payload.soundscapeVolume ?? state.soundscapeVolume,
      };
    default:
      return state;
  }
};

export default soundReducer;
