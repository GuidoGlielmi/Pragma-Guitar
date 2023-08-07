import {useState, useEffect, useContext} from 'react';
import {AudioContext, AudioProps} from '../contexts/AudioContext';
import autoCorrelate from '../libs/AutoCorrelate';
import {noteFromPitch, centsOffFromPitch} from '../libs/Helpers';
import {notes} from '../constants/notes';

const buflen = 2048;
const buf = new Float32Array(buflen);
let updateInterval: number;
const usePitch = () => {
  const {audio: audioCtx, analyser, started} = useContext(AudioContext) as AudioProps;

  const [detune, setDetune] = useState(0);
  const [note, setNote] = useState<keyof typeof notes | null>(null);
  const [notePosition, setNotePosition] = useState(4);
  const [frecuency, setFrecuency] = useState(0);
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    const updatePitch = () => {
      analyser.getFloatTimeDomainData(buf);
      const frecuency = autoCorrelate(buf, audioCtx.sampleRate);
      if (frecuency > -1) {
        const noteNumber = noteFromPitch(frecuency);
        const note = Object.values(notes)[noteNumber % 12] as keyof typeof notes;
        const notePosition = Math.floor(noteNumber / 12) - 1;
        const detune = centsOffFromPitch(frecuency, noteNumber);
        setFrecuency(+frecuency.toFixed(2));
        setNote(note);
        setNotePosition(notePosition);
        setDetune(detune);
        setNotification(false);
        console.log({noteNumber, note, notePosition, detune, frecuency});
      }
    };
    if (started) {
      updateInterval = setInterval(updatePitch, 50);
    }
    return () => {
      clearInterval(updateInterval);
    };
  }, [audioCtx, started, analyser]);

  return {detune, note, notePosition, frecuency: `${frecuency} Hz`, notification};
};

export default usePitch;
