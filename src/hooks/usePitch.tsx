import {useState, useEffect, useContext} from 'react';
import {PitchDetector} from 'pitchy';
import {AudioContext, AudioProps} from '../contexts/AudioContext';
import {getFrecuencyDamper, getMusicalInfoFromFrecuency, getPitch} from '../helpers/pitch';
import useTranslation from './useTranslation';
import {NotificationTranslationKeys} from '../helpers/translations';

const buflen = 2048;

const pitchDetector = PitchDetector.forFloat32Array(buflen);

const initialNoteInfo = {
  frecuency: null,
  note: null,
  pitch: null,
  detune: null,
} as NoteInfo;

const buf = new Float32Array(buflen);

const usePitch = ({interval = 50, minFrecuency = 60, maxFrecuency = 10000} = {}): NoteInfo => {
  const {started, getMicInputStream, setNotification} = useContext(AudioContext) as AudioProps;

  const [noAudioString, closerToTheMicString] = useTranslation([
    'No audio detected',
    'Get closer to the microphone',
  ]);

  const [noteInfo, setNoteInfo] = useState<NoteInfo>(initialNoteInfo);

  useEffect(() => {
    if (!started) return;

    let updateInterval: number;
    const dampFrecuency = getFrecuencyDamper();

    (async () => {
      await getMicInputStream();
      async function updatePitch() {
        const frecuency = getPitch(minFrecuency, maxFrecuency, pitchDetector, buf);
        if (frecuency === -1) return setNotification(noAudioString as NotificationTranslationKeys);
        if (!frecuency) return setNotification(closerToTheMicString as NotificationTranslationKeys);
        setNotification('');
        const dampedF = dampFrecuency(frecuency);
        const noteInfo = {frecuency: dampedF, ...getMusicalInfoFromFrecuency(dampedF)};
        setNoteInfo(noteInfo);
      }
      updatePitch();
      updateInterval = setInterval(updatePitch, interval);
    })();
    return () => {
      clearInterval(updateInterval);
      setNoteInfo(initialNoteInfo);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return noteInfo;
};

export default usePitch;
