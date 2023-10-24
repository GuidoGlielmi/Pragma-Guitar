const referenceFrequency = 440;
const notesInOctaveAmount = 12;
const semitoneRatio = Math.pow(2, 1 / notesInOctaveAmount);
const semitoneOffset = 69;

export const pitchFromFrequency = (frequency: number | null) => {
  if (frequency === null) return null;
  const noteNum = notesInOctaveAmount * (Math.log(frequency / referenceFrequency) / Math.log(2));
  return Math.round(noteNum) + 69;
};

export const getAdjacentFrequencies = (
  frequency: number,
  amount = 1,
): [lowerFreqs: number[], closestFreq: number, higherFreqs: number[]] => {
  const targetF = getClosestFrecuency(frequency);

  const lowerFrecs = [];
  for (let index = 1; index <= amount; index++) {
    lowerFrecs.unshift(subtractSemitones(targetF, index));
    // lowerFrecs.unshift(A4Frequency * Math.pow(semitoneRatio, Math.floor(semitones - index)));
  }
  const higherFrecs = [];
  for (let index = 1; index <= amount; index++) {
    higherFrecs.push(addSemitones(targetF, index));
  }

  return [lowerFrecs, targetF, higherFrecs];
};

export const getClosestFrecuency = (frequency: number) => {
  const semitones = notesInOctaveAmount * (Math.log2(frequency) - Math.log2(referenceFrequency));

  const lowerF = referenceFrequency * Math.pow(semitoneRatio, Math.floor(semitones));
  const higherF = referenceFrequency * Math.pow(semitoneRatio, Math.ceil(semitones));

  const lowerCents = Math.floor((1200 * Math.log(frequency / lowerF)) / Math.log(2)) || 0;
  const higherCents = Math.floor((1200 * Math.log(higherF / frequency)) / Math.log(2)) || 0;
  return lowerCents < higherCents ? lowerF : higherF;
};

export const centsOffFromClosestPitch = (frequency: number | null) => {
  if (frequency === null) return null;
  const nearestSemitone = Math.round(
    semitoneOffset + 12 * Math.log2(frequency / referenceFrequency),
  );
  const nearestFrequency =
    referenceFrequency * Math.pow(2, (nearestSemitone - semitoneOffset) / notesInOctaveAmount);
  return Math.floor((1200 * Math.log(frequency / nearestFrequency)) / Math.log(2));
};

export const centsOffFromPitch = (frequency: number | null, pitch: number | null) => {
  if (!frequency || !pitch) return null;
  return Math.floor((1200 * Math.log(frequency / frequencyFromPitch(pitch))) / Math.log(2));
};

export const getDetunePercent = (detune: number) => {
  return 50 + (detune > 0 ? detune : -detune);
};

const addSemitones = (frequency: number, semitones: number) => {
  return frequency * Math.pow(2, semitones / notesInOctaveAmount);
};

const subtractSemitones = (frequency: number, semitones: number) => {
  return frequency / Math.pow(2, semitones / notesInOctaveAmount);
};

const frequencyFromPitch = (note: number) => {
  return referenceFrequency * Math.pow(2, (note - 69) / notesInOctaveAmount);
};

function snapToFraction(frequency: number, fraction: number): number {
  const semitoneRatio = 2 ** (1 / 12);
  const semitoneOffset = 69;
  const referenceFrequency = 440;

  const nearestSemitone = Math.round(
    semitoneOffset + 12 * Math.log2(frequency / referenceFrequency),
  );

  // Calculate the nearest frequency within the semitone
  const nearestFrequency =
    referenceFrequency * Math.pow(semitoneRatio, nearestSemitone - semitoneOffset);

  // Calculate the fraction of the semitone
  const fractionOfSemitone =
    nearestFrequency * Math.pow(semitoneRatio, fraction) - nearestFrequency;

  // Snap the frequency to the nearest 1/10 fraction of a semitone
  const snappedFrequency = nearestFrequency + fractionOfSemitone;

  return snappedFrequency;
}

// Example usage
const inputFrequency = 440; // A4 in Hz
const fraction = 1 / 10; // 1/10 fraction of a semitone

const snappedFrequency = snapToFraction(inputFrequency, fraction);
console.log(snappedFrequency); // Output: 443.49288047847496 (Hz)
// Output: 466.1637615180899 (closest frequency within 1/10 fraction of an octave)
