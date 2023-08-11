import {notes} from '../constants/notes';

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

export const getNoteFromPitch = (pitch: number | null) => {
  if (pitch === null) return null;
  const coveredOctaves = Math.floor(pitch / 12) * 12;
  return Object.values(notes)[pitch - coveredOctaves];
};

export const getOctave = (pitch: number | null) => {
  return pitch ? Math.floor(pitch / 12) - 1 : null;
};
