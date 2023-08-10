import {useState, useEffect, useContext} from 'react';
import {PitchDetector} from 'pitchy';
import {AudioContext, AudioProps} from '../contexts/AudioContext';
import {pitchFromFrecuency, centsOffFromPitch} from '../libs/Helpers';
import {notes} from '../constants/notes';

const buflen = 2048;
const buf = new Float32Array(buflen);

export type UsePitch = {
  note: Note | null;
  frecuency: number | null;
  pitch: number | null;
  detune: number | null;
};

let updateInterval: number;
const usePitch = ({
  interval = 50,
  started = true,
  minFrecuency = 60,
  maxFrecuency = 10000,
} = {}): UsePitch => {
  const {audio, analyser, started: contextStarted} = useContext(AudioContext) as AudioProps;

  const [pitchDetector, setPitchDetector] = useState<PitchDetector<Float32Array> | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [frecuency, setFrecuency] = useState<number | null>(null);
  const [pitch, setPitch] = useState<number | null>(null);
  const [detune, setDetune] = useState<number | null>(null);

  useEffect(() => {
    setPitchDetector(PitchDetector.forFloat32Array(buflen));
  }, []);

  useEffect(() => {
    if (!pitchDetector) return;
    const updatePitch = () => {
      analyser.getFloatTimeDomainData(buf);
      const [frecuency, clarity] = pitchDetector.findPitch(buf, audio.sampleRate);

      if (frecuency < minFrecuency || frecuency > maxFrecuency) return;
      if (clarity < 0.9) return;

      const pitch = pitchFromFrecuency(frecuency);
      const note = Object.values(notes)[pitch % 12] as keyof typeof notes;
      const detune = centsOffFromPitch(frecuency, pitch);
      setFrecuency(~~frecuency);
      setNote(note);
      setDetune(detune);
      setPitch(pitch);
      // console.log({pitch, note, detune, frecuency});
    };
    if (started && contextStarted) {
      console.log('usePitch started!');
      updateInterval = setInterval(updatePitch, interval);
      return () => {
        clearInterval(updateInterval);
      };
    } else {
      console.log('usePitch stopped!');
      setFrecuency(null);
      setPitch(null);
      setNote(null);
      setDetune(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, contextStarted]);

  return {detune, note, pitch, frecuency};
};

export const getNoteFromPitch = (pitch: number | null) => {
  if (pitch === null) return null;
  const coveredOctaves = Math.floor(pitch / 12) * 12;
  return Object.values(notes)[pitch - coveredOctaves];
};

export const getOctave = (pitch: number | null) => {
  return pitch ? Math.floor(pitch / 12) - 1 : null;
};
export default usePitch;
