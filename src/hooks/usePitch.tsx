import {useState, useEffect, useContext} from 'react';
import {PitchDetector} from 'pitchy';
import {AudioContext, AudioProps} from '../contexts/AudioContext';
import {getFrecuencyDamper, getPitch} from '../helpers/pitch';
import useTranslation from './useTranslation';
import {ToastContext, ToastProps} from '../contexts/ToastContext';
import {NotificationTranslation} from '../helpers/translations';

const buflen = 2048;

const pitchDetector = PitchDetector.forFloat32Array(buflen);

const buf = new Float32Array(buflen);

const usePitch = ({interval = 50, minFrecuency = 60, maxFrecuency = 10000} = {}) => {
  const {started, getMicInputStream, setNotification} = useContext(AudioContext) as AudioProps;
  const {setMessage} = useContext(ToastContext) as ToastProps;

  const [noAudioString, closerToTheMicString, needMicAccessString] = useTranslation([
    'No audio detected',
    'Get closer to the microphone',
    'Microphone permission is needed',
  ]);

  const [frecuency, setFrecuency] = useState<number | null>(null);

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
            return setNotification(noAudioString as keyof NotificationTranslation);
          if (!frecuency)
            return setNotification(closerToTheMicString as keyof NotificationTranslation);
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

  return frecuency;
};

export default usePitch;
