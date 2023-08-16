type PitchRange = [from: number | undefined, to: number | undefined];

type PitchRangeSetter = (range: PitchRange | ((range: PitchRange) => PitchRange)) => void;

interface NoteRangeProps {
  setPitchRange: PitchRangeSetter;
}
