const pitchFromFrecuency = (frequency: number) => {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
};

const frequencyFromNoteNumber = (note: number) => {
  return 440 * Math.pow(2, (note - 69) / 12);
};

const centsOffFromPitch = (frequency: number, note: number) => {
  return Math.floor((1200 * Math.log(frequency / frequencyFromNoteNumber(note))) / Math.log(2));
};

const getDetunePercent = (detune: number) => {
  if (detune > 0) {
    return 50 + detune;
  } else {
    return 50 + -detune;
  }
};

export {pitchFromFrecuency, centsOffFromPitch, getDetunePercent};
