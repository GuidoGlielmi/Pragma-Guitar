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
  const {source, analyserNode: analyser} = useContext(AudioContext) as AudioProps;

  const [pitchDetector, setPitchDetector] = useState<PitchDetector<Float32Array> | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [frecuency, setFrecuency] = useState<number | null>(null);
  const [pitch, setPitch] = useState<number | null>(null);
  const [detune, setDetune] = useState<number | null>(null);

  useEffect(() => {
    setPitchDetector(PitchDetector.forFloat32Array(buflen));
  }, []);

  useEffect(() => {
    if (!pitchDetector || !source) return;
    const updatePitch = () => {
      analyser.getFloatTimeDomainData(buf);
      const [frecuency, clarity] = pitchDetector.findPitch(buf, source?.context.sampleRate);

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
    if (started && source) {
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
  }, [started, source]);

  return {detune, note, pitch, frecuency};
};

export default usePitch;
