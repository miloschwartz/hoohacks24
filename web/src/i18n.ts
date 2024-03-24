import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          // Default texts
        }
      }
    },
    lng: "en", // If you want to get the language from the browser: navigator.language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;