import {useState, useEffect, useContext} from 'react';
import {PitchDetector} from 'pitchy';
import {AudioContext, AudioProps} from '../contexts/AudioContext';
import {getFrecuencyDamper, getPitch} from '../helpers/pitch';
import useTranslation from './useTranslation';
import {NotificationTranslationKeys} from '../helpers/translations';
import {ToastContext, ToastProps} from '../contexts/ToastContext';
import useDebouncedChange from './useDebouncedChange';
import {centsOffFromPitch, pitchFromFrequency} from '../libs/Helpers';
import {notes} from '../constants/notes';
import {LanguageContext, LanguageProps} from '../contexts/LanguageContext';

const buflen = 2048;

const pitchDetector = PitchDetector.forFloat32Array(buflen);

const initialNoteInfo = {
  note: null,
  pitch: null,
  detune: null,
  frecuency: null,
};

const buf = new Float32Array(buflen);

const usePitch = ({interval = 50, minFrecuency = 60, maxFrecuency = 10000} = {}): NoteInfo => {
  const {eng} = useContext(LanguageContext) as LanguageProps;
  const {started, getMicInputStream, setNotification} = useContext(AudioContext) as AudioProps;
  const {setMessage} = useContext(ToastContext) as ToastProps;
  const [needMicAccessString] = useTranslation('Microphone permission is needed');

  const [noAudioString, closerToTheMicString] = useTranslation([
    'No audio detected',
    'Get closer to the microphone',
  ]);

  const [frecuency, setFrecuency] = useState<number | null>(null);
  const debouncedPitch = useDebouncedChange(pitchFromFrequency(frecuency), 50);

  useEffect(() => {
    if (!started) return;

    let updateInterval: number;

    (async () => {
      try {
        await getMicInputStream();
      } catch (err) {
        return setMessage([needMicAccessString, 5000]);
      }
      const dampFrecuency = getFrecuencyDamper();
      async function updatePitch() {
        const frecuency = getPitch(minFrecuency, maxFrecuency, pitchDetector, buf);
        if (frecuency === -1 || !frecuency) {
          setFrecuency(null);
          if (frecuency === -1)
            return setNotification(noAudioString as NotificationTranslationKeys);
          if (!frecuency)
            return setNotification(closerToTheMicString as NotificationTranslationKeys);
        }
        setNotification('');
        const dampedF = dampFrecuency(frecuency);
        setFrecuency(dampedF);
      }
      updatePitch();
      updateInterval = setInterval(updatePitch, interval);
    })();
    return () => {
      clearInterval(updateInterval);
      setFrecuency(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  const noteData =
    debouncedPitch && frecuency
      ? {
          frecuency,
          pitch: debouncedPitch,
          note: Object[eng ? 'keys' : 'values'](notes)[(debouncedPitch || 0) % 12],
          detune: centsOffFromPitch(frecuency, debouncedPitch),
        }
      : initialNoteInfo;

  console.log(noteData);

  return noteData;
};

export default usePitch;
