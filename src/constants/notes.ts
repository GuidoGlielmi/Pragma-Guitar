export const minBPS = 10;
export const maxBPS = 300;
export const notes = {
  C: 'Do',
  'C#': 'Do#',
  D: 'Re',
  'D#': 'Re#',
  E: 'Mi',
  F: 'Fa',
  'F#': 'Fa#',
  G: 'Sol',
  'G#': 'Sol#',
  A: 'La',
  'A#': 'La#',
  B: 'Si',
};

export const convertTuningToState = (t: Tuning): TuningState => ({
  ...t,
  pitches: t.pitches.map(v => ({original: v, pitch: v, id: Math.random()})),
});

export const convertStateToTuning = (t: TuningState): Tuning => ({
  ...t,
  pitches: t.pitches.map(p => p.pitch),
});

export const pitchRangeLimits = [0, 108] as [number, number];

export const tunings = [
  // Standard Tuning
  {label: 'Standard Tuning', pitches: [40, 45, 50, 55, 59, 64]},

  // Major Open Guitar Tunings
  {label: 'Open A', pitches: [40, 45, 49, 52, 57, 64]},
  {label: 'Open B', pitches: [35, 42, 47, 54, 59, 63]},
  {label: 'Open C', pitches: [36, 43, 48, 55, 60, 64]},
  {label: 'Open D', pitches: [38, 45, 50, 54, 57, 62]},
  {label: 'Open E', pitches: [40, 47, 52, 56, 59, 64]},
  {label: 'Open F', pitches: [41, 45, 48, 53, 60, 65]},
  {label: 'Open G', pitches: [38, 43, 50, 55, 59, 62]},

  // Regular Guitar Tunings
  {label: 'Minor Thirds', pitches: [36, 39, 41, 44, 47, 50]},
  {label: 'Major Thirds', pitches: [44, 48, 52, 56, 60, 76]},
  {label: 'Fourths', pitches: [40, 45, 50, 55, 60, 65]},
  {label: 'Augmented Fourths', pitches: [36, 42, 48, 54, 60, 66]},
  {label: 'Fifths', pitches: [36, 43, 50, 57, 64, 71]},

  // Other Guitar Tunings
  {label: 'The Iommi', pitches: [41, 46, 50, 55, 58, 63]},
  {label: 'The Nick Drake', pitches: [40, 45, 50, 55, 60, 64]},
  {label: 'DAD GAD', pitches: [38, 45, 50, 55, 59, 62]},
  {label: 'C6 Modal', pitches: [48, 45, 48, 55, 60, 67]},
  {label: 'Nashville', pitches: [52, 57, 62, 67, 71, 76]},
] as Tuning[];

const notesArray = Object.entries(notes);
const A4_PITCH = 69;
const OCTAVES_COVERED = 8;
const LOWER_OCTAVE_INDEX = -1;

export const strings: GtrString[] = [];
for (let octave = 0; octave <= OCTAVES_COVERED; octave++) {
  for (let noteIndex = 0; noteIndex < notesArray.length; noteIndex++) {
    const label = `${notesArray[noteIndex][0]}${LOWER_OCTAVE_INDEX + octave}` as NoteWithOctave;
    const labelEs = `${notesArray[noteIndex][1]}${LOWER_OCTAVE_INDEX + octave}` as NoteWithOctave;
    strings.push({value: octave * 12 + noteIndex, label, labelEs});
  }
}

export const MIN_COUNTDOWN_VALUE = 0;
export const MAX_COUNTDOWN_VALUE = 60;
