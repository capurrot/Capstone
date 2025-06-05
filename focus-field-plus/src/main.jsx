import { createRoot } from "react-dom/client";
import "./i18n";
import "./index.css";
import "animate.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store/index.js";
import { BrowserRouter } from "react-router";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <GoogleOAuthProvider clientId="870727527546-k6lbah5k54i71lqmbc5m7v00bnm14en4.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
