import {PitchDetector} from 'pitchy';
import {notes, strings} from '../constants/notes';
import {audioEcosystem} from '../contexts/AudioContext';
import {centsOffFromPitch, pitchFromFrequency} from '../libs/Helpers';

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

export const pitchToNote = (pitch: number | null, eng = true) => {
  if (pitch === null) return [null, null];
  const coveredOctaves = Math.floor(pitch / 12) * 12;
  return [Object[eng ? 'keys' : 'values'](notes)[pitch - coveredOctaves], getOctave(pitch)] as [
    string,
    number,
  ];
};

export const getOctave = (pitch: number | null) => {
  return pitch !== null ? Math.floor(pitch / 12) - 1 : null;
};

export const getPitchAndOctave = (pitch: number | null) => {
  if (strings[pitch!] === undefined) return ['', ''];
  return strings[pitch!].label.split(/(\d)/);
};

export const getPitch = (
  minFrecuency = 60,
  maxFrecuency = 10000,
  pitchDetector: PitchDetector<Float32Array>,
  buf: Float32Array,
) => {
  audioEcosystem.analyserNode.getFloatTimeDomainData(buf);
  const [frecuency, clarity] = pitchDetector.findPitch(buf, audioEcosystem.sampleRate);
  if (frecuency < minFrecuency || frecuency > maxFrecuency) return;
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

export const getMusicalInfoFromFrecuency = (f: number) => {
  const pitch = pitchFromFrequency(f);
  return {
    pitch,
    note: Object.values(notes)[pitch % 12] as keyof typeof notes,
    detune: centsOffFromPitch(f, pitch),
  };
};
