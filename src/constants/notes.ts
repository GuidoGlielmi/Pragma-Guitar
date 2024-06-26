import {TLanguages} from '../helpers/translations';

export const minBPM = 10;
export const maxBPM = 300;

export const convertTuningToState = (t: ITuning): ITuningState => ({
  ...t,
  strings: t.strings.map((v, i) => ({
    id: Math.random(),
    originalIndex: i,
    originalPitch: v,
    pitch: v,
  })),
});

export const convertStateToTuning = (t: ITuningState): ITuning => ({
  ...t,
  strings: t.strings.map(p => p.pitch),
});

export const createTuning = (label: string, pitches: StringStateValue[]): ITuning => ({
  label,
  strings: pitches.map(p => p.pitch),
  deletable: true,
});

export const createString = (pitch: number): StringStateValue => ({
  id: Math.random(),
  originalPitch: null,
  pitch,
});

export const staticTunings = [
  // Standard Tuning
  {label: 'Standard Tuning', strings: [40, 45, 50, 55, 59, 64]},

  // Major Open Guitar Tunings
  {label: 'Open A', strings: [40, 45, 49, 52, 57, 64]},
  {label: 'Open B', strings: [35, 42, 47, 54, 59, 63]},
  {label: 'Open C', strings: [36, 43, 48, 55, 60, 64]},
  {label: 'Open D', strings: [38, 45, 50, 54, 57, 62]},
  {label: 'Open E', strings: [40, 47, 52, 56, 59, 64]},
  {label: 'Open F', strings: [41, 45, 48, 53, 60, 65]},
  {label: 'Open G', strings: [38, 43, 50, 55, 59, 62]},

  // Regular Guitar Tunings
  {label: 'Minor Thirds', strings: [36, 39, 41, 44, 47, 50]},
  {label: 'Major Thirds', strings: [44, 48, 52, 56, 60, 76]},
  {label: 'Fourths', strings: [40, 45, 50, 55, 60, 65]},
  {label: 'Augmented Fourths', strings: [36, 42, 48, 54, 60, 66]},
  {label: 'Fifths', strings: [36, 43, 50, 57, 64, 71]},

  // Other Guitar Tunings
  {label: 'The Iommi', strings: [41, 46, 50, 55, 58, 63]},
  {label: 'The Nick Drake', strings: [40, 45, 50, 55, 60, 64]},
  {label: 'DAD GAD', strings: [38, 45, 50, 55, 59, 62]},
  {label: 'C6 Modal', strings: [48, 45, 48, 55, 60, 67]},
  {label: 'Nashville', strings: [52, 57, 62, 67, 71, 76]},
] as ITuning[];

export interface Notes {
  C: string;
  'C#': string;
  D: string;
  'D#': string;
  E: string;
  F: string;
  'F#': string;
  G: string;
  'G#': string;
  A: string;
  'A#': string;
  B: string;
}

enum NoteEn {
  C = 'C',
  'C#' = 'C#',
  D = 'D',
  'D#' = 'D#',
  E = 'E',
  F = 'F',
  'F#' = 'F#',
  G = 'G',
  'G#' = 'G#',
  A = 'A',
  'A#' = 'A#',
  B = 'B',
}

enum NoteEs {
  C = 'Do',
  'C#' = 'Do#',
  D = 'Re',
  'D#' = 'Re#',
  E = 'Mi',
  F = 'Fa',
  'F#' = 'Fa#',
  G = 'Sol',
  'G#' = 'Sol#',
  A = 'La',
  'A#' = 'La#',
  B = 'Si',
}

export const notes: TLanguages<Notes> = {
  en: NoteEn,
  es: NoteEs,
};

const OCTAVES_COVERED = 9;
export const OCTAVE_NOTES_AMOUNT = 12;

export const MAX_PITCH_INDEX = OCTAVE_NOTES_AMOUNT * OCTAVES_COVERED - 1;
export const pitchRangeLimits = [0, MAX_PITCH_INDEX] as [number, number];

export const MIN_COUNTDOWN_VALUE = 0;
export const MAX_COUNTDOWN_VALUE = 60;
