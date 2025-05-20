import { END_LOG, SET_LOGS, START_LOG } from "../actions";

const initialState = {
  currentLogId: null,
  logs: [],
};

const logReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_LOG:
      return {
        ...state,
        currentLogId: action.payload.id,
      };
    case END_LOG:
      return {
        ...state,
        currentLogId: null,
      };
    case SET_LOGS:
      return {
        ...state,
        logs: action.payload,
      };
    default:
      return state;
  }
};

export default logReducer;
