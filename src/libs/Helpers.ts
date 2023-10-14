const A4Frequency = 440;
const semitoneRatio = Math.pow(2, 1 / 12);

export const pitchFromFrequency = (frequency: number) => {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
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
  const semitones = 12 * (Math.log2(frequency) - Math.log2(A4Frequency));

  const lowerF = A4Frequency * Math.pow(semitoneRatio, Math.floor(semitones));
  const higherF = A4Frequency * Math.pow(semitoneRatio, Math.ceil(semitones));

  const lowerCents = Math.floor((1200 * Math.log(frequency / lowerF)) / Math.log(2)) || 0;
  const higherCents = Math.floor((1200 * Math.log(higherF / frequency)) / Math.log(2)) || 0;
  return lowerCents < higherCents ? lowerF : higherF;
};

export const centsOffFromClosestPitch = (frequency: number) => {
  const closestFreq = getClosestFrecuency(frequency);
  return Math.floor((1200 * Math.log(frequency / closestFreq)) / Math.log(2)) || 0;
};

export const centsOffFromPitch = (frequency: number, pitch: number) => {
  return Math.floor((1200 * Math.log(frequency / frequencyFromPitch(pitch))) / Math.log(2));
};

export const getDetunePercent = (detune: number) => {
  if (detune > 0) {
    return 50 + detune;
  } else {
    return 50 + -detune;
  }
};

const addSemitones = (frequency: number, semitones: number) => {
  return frequency * Math.pow(2, semitones / 12);
};

const subtractSemitones = (frequency: number, semitones: number) => {
  return frequency / Math.pow(2, semitones / 12);
};

const frequencyFromPitch = (note: number) => {
  return 440 * Math.pow(2, (note - 69) / 12);
};
