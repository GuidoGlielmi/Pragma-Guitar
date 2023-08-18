type PitchRange = [from: number | undefined | null, to: number | undefined | null];

type PitchRangeSetter = (range: PitchRange | ((range: PitchRange) => PitchRange)) => void;

interface NoteRangeProps {
  setPitchRange: PitchRangeSetter;
}
