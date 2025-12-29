import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {appEn, micEn, noteGeneratorEn, noteGeneratorOnboardingEn, routesEn} from './locales/en';
import {appEs, micEs, noteGeneratorEs, noteGeneratorOnboardingEs, routesEs} from './locales/es';

i18next.use(initReactI18next).init({
  debug: import.meta.env.DEV,
  supportedLngs: ['es', 'en'],
  fallbackLng: 'en',
  resources: {
    en: {
      app: appEn,
      mic: micEn,
      noteGenerator: noteGeneratorEn,
      routes: routesEn,
      noteGeneratorOnboarding: noteGeneratorOnboardingEn,
    },
    es: {
      app: appEs,
      mic: micEs,
      noteGenerator: noteGeneratorEs,
      routes: routesEs,
      noteGeneratorOnboarding: noteGeneratorOnboardingEs,
    },
  },
  defaultNS: 'app',
});
