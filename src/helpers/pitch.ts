import {PitchDetector} from 'pitchy';
import {audioEcosystem} from '../contexts/AudioContext';

const c5Pitch = 72;
const firstHalfOctavesAmount = c5Pitch / 12;
export const getMiddleOctavePitch = (pitch: number) => {
  const octavesDiff = Math.abs(pitch / 12 - firstHalfOctavesAmount);
  if (pitch >= c5Pitch) {
    return pitch - 12 * Math.ceil(octavesDiff);
  }
  return pitch + 12 * Math.floor(octavesDiff);
};

const middlePitch = 69;
export const getFrecuencyFromPitch = (pitch: number) => {
  return 440 * 2 ** ((pitch - middlePitch) / 12);
};

export const getOctave = (pitch: number | null) => {
  return pitch !== null ? Math.floor(pitch / 12) - 1 : null;
};

export const getPitch = (
  minFrecuency = 60,
  maxFrecuency = 10000,
  pitchDetector: PitchDetector<Float32Array>,
  buf: Float32Array,
) => {
  audioEcosystem.analyserNode.getFloatTimeDomainData(buf);
  const [frecuency, clarity] = pitchDetector.findPitch(buf, audioEcosystem.sampleRate);
  // console.log(frecuency, clarity);
  if (frecuency < minFrecuency || frecuency > maxFrecuency || clarity < 0.5) return -1;
  if (clarity < 0.9) return;
  return frecuency;
};

export const getFrecuencyDamper = (strength = 3) => {
  let prevF: number;
  return (newFrec: number) => {
    prevF = (newFrec * strength - newFrec + (prevF ?? newFrec)) / Math.abs(strength);
    return Math.abs(prevF);
  };
};
