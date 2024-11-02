export enum Language {
  es = 'es',
  en = 'en',
}

export type TLanguages<T> = {
  [key in Language]: T;
};

export interface NotificationTranslation {
  noAudioDetected: string;
  microphoneCloser: string;
}

const notificationTranslationEs: NotificationTranslation = {
  noAudioDetected: 'No se ha detectado audio',
  microphoneCloser: 'Acérquese al micrófono',
};

const notificationTranslationEn: NotificationTranslation = {
  noAudioDetected: 'No audio detected',
  microphoneCloser: 'Get closer to the microphone',
};

export interface NoteGeneratorTranslation {
  freeMode: string;
  inNoteRange: string;
  inString: string;
}

const noteGeneratorTranslationsEs: NoteGeneratorTranslation = {
  freeMode: 'Modo Libre',
  inNoteRange: 'Sobre Rango',
  inString: 'Sobre Cuerda',
};

const noteGeneratorTranslationsEn: NoteGeneratorTranslation = {
  freeMode: 'Free Mode',
  inNoteRange: 'In Note Range',
  inString: 'In String',
};

export interface Translation extends NotificationTranslation, NoteGeneratorTranslation {
  devices: string;
  start: string;
  stop: string;
  noteGenerator: string;
  metronome: string;
  tuner: string;
  beat: string;
  tap: string;
  playNote: string;
  freeMode: string;
  inNoteRange: string;
  inString: string;
  anyOctave: string;
  exactOctave: string;
  countdown: string;
  bestStreak: string;
  play: string;
  youPlayed: string;
  from: string;
  to: string;
  frets: string;
  addUpperString: string;
  addLowerString: string;
  tuning: string;
  saveTuning: string;
  name: string;
  nameAlreadyUsed: string;
  save: string;
  cancel: string;
  microphoneAccess: string;
  repeatMetronomePattern: string;
  by: string;
  every: string;
  bars: string;
  increasingTempo: string;
}

const translationsEs: Translation = {
  devices: 'Dispositivos',
  start: 'Empezar',
  stop: 'Detener',
  noteGenerator: 'Generador de Notas',
  metronome: 'Metrónomo',
  tuner: 'Afinador',
  beat: 'Compás',
  tap: 'Pulse',
  playNote: 'Tocar Nota',
  anyOctave: 'Cualquier Octava',
  exactOctave: 'Octava Exacta',
  countdown: 'Conteo',
  bestStreak: 'Mejor Racha',
  play: 'Toque',
  youPlayed: 'Ha Tocado',
  from: 'Desde',
  to: 'Hasta',
  frets: 'Trastes',
  addUpperString: 'Agregar Cuerda Aguda',
  addLowerString: 'Agregar Cuerda Grave',
  tuning: 'Afinación',
  saveTuning: 'Guardar Afinación',
  name: 'Nombre',
  nameAlreadyUsed: 'El nombre ya está en uso',
  save: 'Guardar',
  cancel: 'Cancelar',
  microphoneAccess: 'Se requiere permiso de micrófono',
  repeatMetronomePattern: 'Repetir patrón al llegar a',
  by: 'Por',
  every: 'Cada',
  bars: 'compases',
  increasingTempo: 'Incrementar tempo',
  ...noteGeneratorTranslationsEs,
  ...notificationTranslationEs,
};

const translationsEn: Translation = {
  devices: 'Devices',
  start: 'Start',
  stop: 'Stop',
  noteGenerator: 'Note Generator',
  metronome: 'Metronome',
  tuner: 'Tuner',
  beat: 'Beat',
  tap: 'Tap',
  playNote: 'Play Note',
  anyOctave: 'Any Octave',
  exactOctave: 'Exact Octave',
  countdown: 'Countdown',
  bestStreak: 'Best Streak',
  play: 'Play',
  youPlayed: 'You Played',
  from: 'From',
  to: 'To',
  frets: 'Frets',
  addUpperString: 'Add Upper String',
  addLowerString: 'Add Lower String',
  tuning: 'Tuning',
  saveTuning: 'Save Tuning',
  name: 'Name',
  nameAlreadyUsed: 'Name already in use!',
  microphoneAccess: 'Microphone access required',
  save: 'Save',
  cancel: 'Cancel',
  repeatMetronomePattern: 'Repeat pattern when reaching',
  by: 'By',
  every: 'Every',
  bars: 'bars',
  increasingTempo: 'Increasing tempo',
  ...noteGeneratorTranslationsEn,
  ...notificationTranslationEn,
};

const translations: TLanguages<Translation> = {
  es: translationsEs,
  en: translationsEn,
};

export const translate = (str: keyof Translation, lang = Language.en) => {
  return translations[lang][str] ?? str;
};
