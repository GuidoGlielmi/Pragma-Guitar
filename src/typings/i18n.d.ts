// import the original type declarations
import 'i18next';
// import all namespaces (for the default language, only)
import {
  appEn,
  micEn,
  noteGeneratorEn,
  noteGeneratorOnboardingEn,
  routesEn,
} from '../i18n/locales/en';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'app';
    resources: {
      app: typeof appEn;
      noteGenerator: typeof noteGeneratorEn;
      mic: typeof micEn;
      routes: typeof routesEn;
      noteGeneratorOnboarding: typeof noteGeneratorOnboardingEn;
    };
  }
}
