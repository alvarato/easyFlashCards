import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import your translation files
import de from "./lang/de.json";
import en from "./lang/en.json";
import es from "./lang/es.json";
import fr from "./lang/fr.json";
import it from "./lang/it.json";
import pt from "./lang/pt.json";
import ru from "./lang/ru.json";

const resources = {
  de: { translation: de },
  en: { translation: en },
  es: { translation: es },
  it: { translation: it },
  fr: { translation: fr },
  pt: { translation: pt },
  ru: { translation: ru },
};

// Idioma por defecto del dispositivo (sin consultar SQLite aún)
const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? "en";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources,
  lng: deviceLanguage,
  fallbackLng: "en",
  react: {
    useSuspense: false,
  },
});

export default i18n;
