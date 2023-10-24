export enum Language {
  es = 'es',
  en = 'en',
}

export type TLanguages<T> = {
  [key in Language]: T;
};

export interface NotificationTranslation {
  'No audio detected': string;
  'Get closer to the microphone': string;
}

const notificationTranslationEs: NotificationTranslation = {
  'No audio detected': 'No se ha detectado audio',
  'Get closer to the microphone': 'Acérquese al micrófono',
};

const notificationTranslationEn: NotificationTranslation = {
  'No audio detected': 'No audio detected',
  'Get closer to the microphone': 'Get closer to the microphone',
};

export interface Translation extends NotificationTranslation {
  Devices: string;
  Start: string;
  Stop: string;
  'Note Generator': string;
  Metronome: string;
  Tuner: string;
  Beat: string;
  Tap: string;
  'Play Note': string;
  'Free Mode': string;
  'In Note Range': string;
  'In String': string;
  'Any Octave': string;
  'Exact Octave': string;
  Countdown: string;
  'Best Streak': string;
  Play: string;
  'You Played': string;
  From: string;
  To: string;
  Frets: string;
  'Add Upper String': string;
  'Add Lower String': string;
  Tuning: string;
  'Save Tuning': string;
  Name: string;
  'Name already in use!': string;
  'Microphone permission is needed': string;
  Save: string;
  Cancel: string;
}

const translationsEs: Translation = {
  Devices: 'Dispositivos',
  Start: 'Empezar',
  Stop: 'Detener',
  'Note Generator': 'Generador de Notas',
  Metronome: 'Metrónomo',
  Tuner: 'Afinador',
  Beat: 'Compás',
  Tap: 'Pulse',
  'Play Note': 'Tocar Nota',
  'Free Mode': 'Modo Libre',
  'In Note Range': 'Sobre Rango',
  'In String': 'Sobre Cuerda',
  'Any Octave': 'Cualquier Octava',
  'Exact Octave': 'Octava Exacta',
  Countdown: 'Conteo',
  'Best Streak': 'Mejor Racha',
  Play: 'Toque',
  'You Played': 'Ha Tocado',
  From: 'Desde',
  To: 'Hasta',
  Frets: 'Trastes',
  'Add Upper String': 'Agregar Cuerda Aguda',
  'Add Lower String': 'Agregar Cuerda Grave',
  Tuning: 'Afinación',
  'Save Tuning': 'Guardar Afinación',
  Name: 'Nombre',
  'Name already in use!': 'El nombre ya está en uso',
  'Microphone permission is needed': 'Se necesita permiso para utilizar el micrófono',
  Save: 'Guardar',
  Cancel: 'Cancelar',
  ...notificationTranslationEs,
};

const translationsEn: Translation = {
  Devices: 'Devices',
  Start: 'Start',
  Stop: 'Stop',
  'Note Generator': 'Note Generator',
  Metronome: 'Metronome',
  Tuner: 'Tuner',
  Beat: 'Beat',
  Tap: 'Tap',
  'Play Note': 'Play Note',
  'Free Mode': 'Free Mode',
  'In Note Range': 'In Note Range',
  'In String': 'In String',
  'Any Octave': 'Any Octave',
  'Exact Octave': 'Exact Octave',
  Countdown: 'Countdown',
  'Best Streak': 'Best Streak',
  Play: 'Play',
  'You Played': 'You Played',
  From: 'From',
  To: 'To',
  Frets: 'Frets',
  'Add Upper String': 'Add Upper String',
  'Add Lower String': 'Add Lower String',
  Tuning: 'Tuning',
  'Save Tuning': 'Save Tuning',
  Name: 'Name',
  'Name already in use!': 'Name already in use!',
  'Microphone permission is needed': 'Microphone permission is needed',
  Save: 'Save',
  Cancel: 'Cancel',
  ...notificationTranslationEn,
};

const translations: TLanguages<Translation> = {
  es: translationsEs,
  en: translationsEn,
};

export const translate = (str: keyof Translation, lang = Language.en) => {
  return translations[lang][str] ?? str;
};
