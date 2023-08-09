import {useState, useEffect, useContext} from 'react';
import {AudioContext, AudioProps} from '../contexts/AudioContext';
import autoCorrelate from '../libs/AutoCorrelate';
import {noteFromPitch, centsOffFromPitch} from '../libs/Helpers';
import {notes} from '../constants/notes';

const buflen = 2048;
const buf = new Float32Array(buflen);

let updateInterval: number;

const usePitch = ({interval = 50} = {}) => {
  const {audio: audioCtx, analyser, started} = useContext(AudioContext) as AudioProps;

  const [note, setNote] = useState<Note | null>(null);
  const [frecuency, setFrecuency] = useState<number | null>(0);
  const [pitch, setPitch] = useState<number | null>(0);
  const [detune, setDetune] = useState<number | null>(0);
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    clearInterval(updateInterval);
    const updatePitch = () => {
      analyser.getFloatTimeDomainData(buf);
      const frecuency = autoCorrelate(buf, audioCtx.sampleRate);
      if (frecuency > -1) {
        const pitch = noteFromPitch(frecuency);
        const note = Object.values(notes)[pitch % 12] as keyof typeof notes;
        const detune = centsOffFromPitch(frecuency, pitch);
        setFrecuency(~~frecuency);
        setNote(note);
        setDetune(detune);
        setNotification(false);
        setPitch(pitch);
        console.log({pitch, note, detune, frecuency});
      }
    };
    if (started) {
      updateInterval = setInterval(updatePitch, interval);
    } else {
      setFrecuency(null);
      setPitch(null);
      setNote(null);
      setDetune(null);
      setNotification(false);
    }
    return () => {
      clearInterval(updateInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  const getNotePosition = () => {
    return pitch ? Math.floor(pitch / 12) - 1 : null;
  };

  return {detune, note, pitch, getNotePosition, frecuency: `${frecuency} Hz`, notification};
};

export default usePitch;
