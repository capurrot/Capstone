import { combineReducers, configureStore } from "@reduxjs/toolkit";
import sessionReducer from "../reducers/sessionReducesr";
import userReducer from "../reducers/userReducer";
import moodReducer from "../reducers/moodReducer";

const rootReducer = combineReducers({
  session: sessionReducer,
  user: userReducer,
  mood: moodReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
