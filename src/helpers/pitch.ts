import {
  C5_PITCH,
  CENTS_IN_OCTAVE,
  HIGHER_MIC_AMPLITUDE_THRESHOLD,
  MAX_ACCEPTABLE_DETUNE,
  NOTES_IN_OCTAVE_AMOUNT,
  REFERENCE_FREQUENCY,
  SEMITONE_OFFSET,
  firstHalfOctavesAmount,
} from '@/constants';
import {PitchDetector} from 'pitchy';
import {audioEcosystem} from '../contexts/AudioContext';
import {AudioEcosystem} from './AudioEcosystem';

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

const pitchDetector = PitchDetector.forFloat32Array(AudioEcosystem.buflen);

/**
 * Returns `undefined` if audio levels is too low, otherwise
 */
export const getPitch = (audioEcosystem: AudioEcosystem): GetPitchReturnType => {
  audioEcosystem.getAnalyserFloatTimeDomainData(AudioEcosystem.buf);
  const [frecuency] = pitchDetector.findPitch(AudioEcosystem.buf, audioEcosystem.sampleRate);
  const micAmplitude = getMicAmplitude();
  // console.log({frecuency, micAmplitude});
  return {
    frecuency: micAmplitude > HIGHER_MIC_AMPLITUDE_THRESHOLD ? frecuency : null,
    amplitude: micAmplitude,
  };
};

export function getMicAmplitude() {
  const bufferLength = audioEcosystem.getAnalyserFrequencyBitCount();
  let sum = 0;
  for (let i = 0; i < bufferLength; i++) {
    sum += Math.abs(AudioEcosystem.buf[i]); // Values between -1.0 and 1.0
  }
  return sum / bufferLength; // Values between 0 and 1
}

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

export function isCorrectPitch(
  frecuency: TPitchToPlay,
  target: TPitchToPlay,
  exactOctave: boolean,
) {
  if (frecuency === null || target === null) return false;

  const pitch = closestPitchFromFrequency(frecuency) as number;
  if (!(exactOctave ? pitch === target : areSameNote(pitch, target))) return false;

  const detune = centsOffFromPitch(frecuency, target) as number;
  return Math.abs(detune) > MAX_ACCEPTABLE_DETUNE;
}

// const FRECUENCY_SNAP_RATIO = 12;

// function snapFrequency(frequency: number) {
//   const steps = Math.round(FRECUENCY_SNAP_RATIO * 12 * Math.log2(frequency / REFERENCE_FREQUENCY));
//   const snappedFrequency = REFERENCE_FREQUENCY * Math.pow(2, steps / (FRECUENCY_SNAP_RATIO * 12));
//   return ~~snappedFrequency;
// }
