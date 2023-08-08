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

  const [detune, setDetune] = useState(0);
  const [note, setNote] = useState<Note | null>(null);
  const [notePosition, setNotePosition] = useState(4);
  const [frecuency, setFrecuency] = useState(0);
  const [notification, setNotification] = useState(false);
  const [noteNumber, setNoteNumber] = useState(0);

  useEffect(() => {
    clearInterval(updateInterval);
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
        setNoteNumber(noteNumber);
        console.log({noteNumber, note, notePosition, detune, frecuency});
      }
    };
    if (started) {
      updateInterval = setInterval(updatePitch, interval);
    }
    return () => {
      clearInterval(updateInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return {detune, note, noteNumber, notePosition, frecuency: `${frecuency} Hz`, notification};
};

export default usePitch;
