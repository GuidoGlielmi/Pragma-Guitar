type PitchRangeSetter = (range: [i1: number | undefined, i2: number | undefined]) => void;
interface NoteRangeProps {
  setPitchRange: PitchRangeSetter;
}

// interface NoteRangeProps {
//   setPitchRange: (
//     range: [i1: number, i2: number] | ((range: [gtrString, gtrString]) => void),
//   ) => void;
// }
