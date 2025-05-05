import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { getPersistStorage } from "../utils/persistToggle";
import { encryptTransform } from "redux-persist-transform-encrypt";

import sessionReducer from "../reducers/sessionReducesr";
import userReducer from "../reducers/userReducer";
import moodReducer from "../reducers/moodReducer";
import soundReducer from "../reducers/soundReducer";
import playerPreferencesReducer from "../reducers/playerPreferencesReducer";
import authReducer from "../reducers/authReducer";

// Root-level persist config
const persistConfig = {
  key: "root",
  storage: getPersistStorage(),
  transforms: [
    encryptTransform({
      secretKey: import.meta.env.VITE_PERSIST_SECRET,
      onError: (error) => {
        console.error("Persist encryption error:", error);
      },
    }),
  ],
  blacklist: ["session", "sound"],
};

const rootReducer = combineReducers({
  session: sessionReducer,
  user: userReducer,
  mood: moodReducer,
  sound: soundReducer,
  playerPrefs: playerPreferencesReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
