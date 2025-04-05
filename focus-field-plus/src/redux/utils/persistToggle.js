import storage from "redux-persist/lib/storage";

const hasCookieConsent = () => {
  return localStorage.getItem("cookieConsent") === "all";
};

export const getPersistStorage = () => {
  if (hasCookieConsent()) {
    return storage;
  }

  return {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  };
};
