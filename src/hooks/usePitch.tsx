import {useState, useEffect, useContext, useRef} from 'react';
import {PitchDetector} from 'pitchy';
import {pitchFromFrequency, centsOffFromPitch} from '../libs/Helpers';
import {notes} from '../constants/notes';
import {AudioContext, AudioProps, audioEcosystem} from '../contexts/AudioContext';

const buflen = 2048;

const pitchDetector = PitchDetector.forFloat32Array(buflen);

const buf = new Float32Array(buflen);

const usePitch = ({interval = 50, minFrecuency = 60, maxFrecuency = 10000} = {}): UsePitch => {
  const {started, getMicInputStream} = useContext(AudioContext) as AudioProps;

  const [note, setNote] = useState<Note | null>(null);
  const [frecuency, setFrecuency] = useState<number | null>(null);
  const prevFrec = useRef<number | null>(null);
  const [pitch, setPitch] = useState<number | null>(null);
  const [detune, setDetune] = useState<number | null>(null);

  useEffect(() => {
    if (!started) return;

    let updateInterval: number;
    (async () => {
      await getMicInputStream();
      async function updatePitch() {
        const audioData = getPitch(minFrecuency, maxFrecuency);
        if (audioData) {
          console.log(audioData);
          const {pitch, note, detune, frecuency} = audioData;
          const f = (frecuency + (prevFrec.current || 0)) / 2;
          setFrecuency(f);
          prevFrec.current = f;
          setNote(note);
          setDetune(detune);
          setPitch(pitch);
        }
        // console.log('usePitch started!');
      }
      updatePitch();
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

const getPitch = (minFrecuency = 60, maxFrecuency = 10000) => {
  audioEcosystem.analyserNode.getFloatTimeDomainData(buf);
  const [frecuency, clarity] = pitchDetector.findPitch(buf, audioEcosystem.sampleRate);
  if (frecuency < minFrecuency || frecuency > maxFrecuency) return;
  if (clarity < 0.9) return;

  const pitch = pitchFromFrequency(frecuency);
  const note = Object.values(notes)[pitch % 12] as keyof typeof notes;
  const detune = centsOffFromPitch(frecuency, pitch);
  return {pitch, note, detune, frecuency};
};
