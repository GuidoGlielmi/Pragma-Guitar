import {useState, useEffect, useContext, useRef} from 'react';
import {PitchDetector} from 'pitchy';
import {AudioContext, AudioProps, audioCtx, micInputStream} from '../contexts/AudioContext';
import {pitchFromFrequency, centsOffFromPitch} from '../libs/Helpers';
import {notes} from '../constants/notes';

const buflen = 2048;

let updateInterval: number;
const usePitch = ({interval = 50, minFrecuency = 60, maxFrecuency = 10000} = {}): UsePitch => {
  const {started, analyserNode, getMicInputStream} = useContext(AudioContext) as AudioProps;

  const pitchDetector = useRef(PitchDetector.forFloat32Array(buflen));
  const [note, setNote] = useState<Note | null>(null);
  const [frecuency, setFrecuency] = useState<number | null>(null);
  const prevFrec = useRef<number | null>(null);
  const [pitch, setPitch] = useState<number | null>(null);
  const [detune, setDetune] = useState<number | null>(null);

  useEffect(() => {
    if (!started) return;
    const buf = new Float32Array(buflen);
    (async () => {
      if (!micInputStream) await getMicInputStream();
      const updatePitch = () => {
        analyserNode.getFloatTimeDomainData(buf);
        const [frecuency, clarity] = pitchDetector.current.findPitch(buf, audioCtx.sampleRate);

        if (frecuency < minFrecuency || frecuency > maxFrecuency) return;
        if (clarity < 0.9) return;

        const pitch = pitchFromFrequency(frecuency);
        const note = Object.values(notes)[pitch % 12] as keyof typeof notes;
        const detune = centsOffFromPitch(frecuency, pitch);
        const f = (frecuency + (prevFrec.current || 0)) / 2;
        setFrecuency(f);
        prevFrec.current = f;
        setNote(note);
        setDetune(detune);
        setPitch(pitch);
        // console.log({pitch, note, detune, frecuency});
      };
      console.log('usePitch started!');
      updateInterval = setInterval(updatePitch, interval);
    })();
    return () => {
      console.log('usePitch stopped!');
      clearInterval(updateInterval);
      setFrecuency(null);
      setPitch(null);
      setNote(null);
      setDetune(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return {detune, note, pitch, frecuency};
};

export default usePitch;
