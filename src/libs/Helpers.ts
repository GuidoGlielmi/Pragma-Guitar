const REFERENCE_FREQUENCY = 440;
const NOTES_IN_OCTAVE_AMOUNT = 12;
const SEMITONE_OFFSET = 69;
const CENTS_IN_WHOLE_TONE = 100;
const CENTS_IN_OCTAVE = NOTES_IN_OCTAVE_AMOUNT * CENTS_IN_WHOLE_TONE;

export const closestPitchFromFrequency = (frequency: number | null) => {
  if (frequency === null) return null;
  const noteNum =
    NOTES_IN_OCTAVE_AMOUNT * (Math.log(frequency / REFERENCE_FREQUENCY) / Math.log(2));
  return Math.round(noteNum) + SEMITONE_OFFSET;
};

export const centsOffFromClosestPitch = (frequency: number | null) => {
  if (frequency === null) return null;
  const pitch = closestPitchFromFrequency(frequency) as number;
  return centsOffFromPitch(frequency, pitch);
};

export const centsOffFromPitch = (frequency: number | null, pitch: number | null) => {
  if (!frequency || !pitch) return null;
  return Math.floor(
    (CENTS_IN_OCTAVE * Math.log(frequency / frequencyFromPitch(pitch))) / Math.log(2),
  );
};

export const getDetunePercent = (detune: number) => {
  return CENTS_IN_WHOLE_TONE / 2 + (detune > 0 ? detune : -detune);
};

export const areSameNote = (pitch1: number, pitch2: number) =>
  areMultiples(pitch1 - pitch2, NOTES_IN_OCTAVE_AMOUNT);

const areMultiples = (n1: number, n2: number) => !(n1 % n2);

const frequencyFromPitch = (note: number) => {
  return REFERENCE_FREQUENCY * Math.pow(2, (note - SEMITONE_OFFSET) / NOTES_IN_OCTAVE_AMOUNT);
};

// --------------

// const semitoneRatio = Math.pow(2, 1 / notesInOctaveAmount);

// export const getAdjacentFrequencies = (
//   frequency: number,
//   amount = 1,
// ): [lowerFreqs: number[], closestFreq: number, higherFreqs: number[]] => {
//   const targetF = getClosestFrecuency(frequency);

//   const lowerFrecs = [];
//   for (let index = 1; index <= amount; index++) {
//     lowerFrecs.unshift(subtractSemitones(targetF, index));
//     // lowerFrecs.unshift(A4Frequency * Math.pow(semitoneRatio, Math.floor(semitones - index)));
//   }
//   const higherFrecs = [];
//   for (let index = 1; index <= amount; index++) {
//     higherFrecs.push(addSemitones(targetF, index));
//   }

//   return [lowerFrecs, targetF, higherFrecs];
// };

// export const getClosestFrecuency = (frequency: number) => {
//   const semitones = notesInOctaveAmount * (Math.log2(frequency) - Math.log2(referenceFrequency));

//   const lowerF = referenceFrequency * Math.pow(semitoneRatio, Math.floor(semitones));
//   const higherF = referenceFrequency * Math.pow(semitoneRatio, Math.ceil(semitones));

//   const lowerCents = Math.floor((1200 * Math.log(frequency / lowerF)) / Math.log(2)) || 0;
//   const higherCents = Math.floor((1200 * Math.log(higherF / frequency)) / Math.log(2)) || 0;
//   return lowerCents < higherCents ? lowerF : higherF;
// };

// const addSemitones = (frequency: number, semitones: number) => {
//   return frequency * Math.pow(2, semitones / notesInOctaveAmount);
// };

// const subtractSemitones = (frequency: number, semitones: number) => {
//   return frequency / Math.pow(2, semitones / notesInOctaveAmount);
// };
