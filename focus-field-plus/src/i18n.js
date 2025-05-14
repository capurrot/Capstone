import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

const apiUrl = import.meta;
i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "it",
    debug: true,
    defaultNS: "translation",
    ns: ["translation"], // carica dinamicamente i mood
    backend: {
      /* loadPath: "/locales/{{lng}}/{{ns}}.json", */
      loadPath: `${apiUrl}/api/focus-field/locales/{{lng}}/{{ns}}.json`,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
