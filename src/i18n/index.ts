import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en.json";
import fr from "./fr.json";
import es from "./es.json";
import { initReactI18next } from "react-i18next";

const resources = { en, es, fr };

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "es", "fr"],
    resources,
    fallbackLng: "en",
    detection: { order: ["path", "navigator"] },
  });

export default i18n;
