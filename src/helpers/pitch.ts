import {
  C5_PITCH,
  CENTS_IN_OCTAVE,
  NOTES_IN_OCTAVE_AMOUNT,
  REFERENCE_FREQUENCY,
  SEMITONE_OFFSET,
  firstHalfOctavesAmount,
} from '@/constants';
import {PitchDetector} from 'pitchy';
import {audioEcosystem} from '../contexts/AudioContext';

/** Returns the same type of {@link frequency} */
export const closestPitchFromFrequency = (frequency: TPitchToPlay) => {
  if (frequency === null) return null;
  const noteIndex =
    NOTES_IN_OCTAVE_AMOUNT * (Math.log(frequency / REFERENCE_FREQUENCY) / Math.log(2));
  return Math.round(noteIndex) + SEMITONE_OFFSET;
};

/** Returns `null` if {@link frequency} or {@link pitch} are `null` */
export const centsOffFromPitch = (frequency: TPitchToPlay, pitch: TPitchToPlay) => {
  if (!frequency || !pitch) return null;
  return Math.floor(
    (CENTS_IN_OCTAVE * Math.log(frequency / frequencyFromPitch(pitch))) / Math.log(2),
  );
};

/**
 * Checks if two pitch indexes are the same, without taking octaves into account
 */
export const areSameNote = (pitch1: number, pitch2: number) =>
  areMultiples(pitch1 - pitch2, NOTES_IN_OCTAVE_AMOUNT);

const areMultiples = (n1: number, n2: number) => !(n1 % n2);

const frequencyFromPitch = (note: number) => {
  return REFERENCE_FREQUENCY * Math.pow(2, (note - SEMITONE_OFFSET) / NOTES_IN_OCTAVE_AMOUNT);
};

export const getMiddleOctavePitch = (pitch: number) => {
  const octavesDiff = Math.abs(pitch / 12 - firstHalfOctavesAmount);
  if (pitch >= C5_PITCH) {
    return pitch - 12 * Math.ceil(octavesDiff);
  }
  return pitch + 12 * Math.floor(octavesDiff);
};

const middlePitch = 69;
export const getFrecuencyFromPitch = (pitch: number) => {
  return 440 * 2 ** ((pitch - middlePitch) / 12);
};

export const getOctave = (pitch: TPitchToPlay) => {
  return pitch !== null ? Math.floor(pitch / 12) - 1 : null;
};

export const getPitch = (
  pitchDetector: PitchDetector<Float32Array>,
  buf: Float32Array,
  minFrecuency = 60,
  maxFrecuency = 10000,
): TPitchToPlay => {
  audioEcosystem.getAnalyserFloatTimeDomainData(buf);
  const [frecuency, clarity] = pitchDetector.findPitch(buf, audioEcosystem.sampleRate);
  // console.log({frecuency, clarity});
  if (frecuency < minFrecuency || frecuency > maxFrecuency || clarity < 0.9) return null;
  return frecuency;
};

export const getFrecuencyDamper = (strength = 3) => {
  let prevF: number;
  return (newFrec: number) => {
    prevF = (newFrec * strength - newFrec + (prevF ?? newFrec)) / Math.abs(strength);
    return Math.abs(prevF);
  };
};

export function getSnappedValue(value: number, snapUnit = 5, multiplier = 1) {
  return Math.round((value * multiplier) / snapUnit) * snapUnit;
}
