export const minBPS = 10;
export const maxBPS = 300;
export const notes = {
  C: 'C',
  'C#': 'C#',
  D: 'D',
  'D#': 'D#',
  E: 'E',
  F: 'F',
  'F#': 'F#',
  G: 'G',
  'G#': 'G#',
  A: 'A',
  'A#': 'A#',
  B: 'B',
};

export type Tuning = {label: string; value: number[]};
export type TuningStateValue = {original: number | null; value: number; id: number};
export type TuningState = {label: string; value: TuningStateValue[]};

export const convertTuningToState = (t: Tuning): TuningState => ({
  ...t,
  value: t.value.map(v => ({original: v, value: v, id: Math.random()})),
});
export const pitchRange = [0, 108] as [number, number];

export const tunings = [
  // Standard Tuning
  {label: 'Standard Tuning', value: [40, 45, 50, 55, 59, 64]},

  // Major Open Guitar Tunings
  {label: 'Open A', value: [40, 45, 49, 52, 57, 64]},
  {label: 'Open B', value: [35, 42, 47, 54, 59, 63]},
  {label: 'Open C', value: [36, 43, 48, 55, 60, 64]},
  {label: 'Open D', value: [38, 45, 50, 54, 57, 62]},
  {label: 'Open E', value: [40, 47, 52, 56, 59, 64]},
  {label: 'Open F', value: [41, 45, 48, 53, 60, 65]},
  {label: 'Open G', value: [38, 43, 50, 55, 59, 62]},

  // Regular Guitar Tunings
  {label: 'Minor Thirds', value: [36, 39, 41, 44, 47, 50]},
  {label: 'Major Thirds', value: [44, 48, 52, 56, 60, 76]},
  {label: 'Fourths', value: [40, 45, 50, 55, 60, 65]},
  {label: 'Augmented Fourths', value: [36, 42, 48, 54, 60, 66]},
  {label: 'Fifths', value: [36, 43, 50, 57, 64, 71]},

  // Other Guitar Tunings
  {label: 'The Iommi', value: [41, 46, 50, 55, 58, 63]},
  {label: 'The Nick Drake', value: [40, 45, 50, 55, 60, 64]},
  {label: 'DAD GAD', value: [38, 45, 50, 55, 59, 62]},
  {label: 'C6 Modal', value: [48, 45, 48, 55, 60, 67]},
  {label: 'Nashville', value: [52, 57, 62, 67, 71, 76]},
] as Tuning[];

const notesArray = Object.values(notes);
const C1_NUMBER = 24;
const OCTAVES_COVERED = 8;

export const strings: gtrString[] = [];
for (let octave = 0; octave <= OCTAVES_COVERED; octave++) {
  for (let noteIndex = 0; noteIndex < notesArray.length; noteIndex++) {
    const label = `${notesArray[noteIndex]}${octave}` as NoteWithOctave;
    strings.push({value: octave * 12 + noteIndex, label});
  }
}
