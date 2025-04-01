// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Importa i file di traduzione
import translationIT from "./locales/it.json";
import translationEN from "./locales/en.json";
import translationES from "./locales/es.json";
import translationFR from "./locales/fr.json";
import translationDE from "./locales/de.json";

// Risorse (ogni lingua con la sua "translation")
const resources = {
  it: { translation: translationIT },
  en: { translation: translationEN },
  es: { translation: translationES },
  fr: { translation: translationFR },
  de: { translation: translationDE },
};

i18n
  .use(LanguageDetector) // Rileva la lingua del browser
  .use(initReactI18next) // Passa i18n a react-i18next
  .init({
    resources,
    fallbackLng: "it", // Lingua predefinita se non trovata
    interpolation: {
      escapeValue: false, // React già fa il lavoro di escaping
    },
  });

export default i18n;
