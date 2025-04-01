import { SET_SESSION } from "../actions";

const sessionReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_SESSION:
      return action.payload;
    default:
      return state;
  }
};

export default sessionReducer;
