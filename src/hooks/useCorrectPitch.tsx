import {useState, useEffect, useContext} from 'react';
import {UsePitch} from './usePitch';
import {pitchFromFrecuency, centsOffFromPitch} from '../libs/Helpers';
import {PitchDetector} from 'pitchy';
import {AudioContext, AudioProps} from '../contexts/AudioContext';
import {notes} from '../constants/notes';
import {persistentChecker} from '../helpers/persistentChecker';

let interval: number;

const buflen = 2048;
const buf = new Float32Array(buflen);

type Condition = {
  delay?: number;
  minFrecuency?: number;
  maxFrecuency?: number;
} & (
  | {
      target?: number | null;
      condition: (pitch: number) => boolean;
    }
  | {
      target: number | null;
      condition?: (pitch: number) => boolean;
    }
);

type UseCorrectPitch = UsePitch & {correct: boolean};

/**
 * @param condition Should be memoized
 */
const useCorrectPitch = ({
  target,
  condition,
  delay = 75,
  minFrecuency = 60,
  maxFrecuency = 10000,
}: Condition): UseCorrectPitch => {
  const {audio, analyser, started, setNotification} = useContext(AudioContext) as AudioProps;

  const [pitchDetector, setPitchDetector] = useState<PitchDetector<Float32Array> | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [frecuency, setFrecuency] = useState<number | null>(null);
  const [pitch, setPitch] = useState<number | null>(null);
  const [detune, setDetune] = useState<number | null>(null);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    setPitchDetector(PitchDetector.forFloat32Array(buflen));
  }, []);

  useEffect(() => {
    if (!started || !pitchDetector) return;

    const notificationIntent = debounce(() => setNotification(true), 500);
    const cancelNotificationIntent = () => notificationIntent(true);

    const notificationCancelIntent = debounce(() => setNotification(false), 200);
    const cancelNotificationCancelIntent = () => notificationCancelIntent(true);

    let savedPitch: number;

    const getPitch = () => {
      analyser.getFloatTimeDomainData(buf);

      const [frecuency, clarity] = pitchDetector.findPitch(buf, audio.sampleRate);

      if (frecuency < minFrecuency || frecuency > maxFrecuency) return;

      const pitch = pitchFromFrecuency(frecuency);
      const note = Object.values(notes)[pitch % 12] as keyof typeof notes;
      const detune = centsOffFromPitch(frecuency, pitch);

      console.log({
        frecuency,
        pitch,
        note,
        clarity,
        status: clarity >= 0.95 ? 'Clear' : clarity <= 0.85 ? 'Unclear' : 'Almost clear',
      });

      if (clarity <= 0.95) {
        if (clarity >= 0.87) {
          cancelNotificationCancelIntent();
          notificationIntent();
        }
        return;
      }

      cancelNotificationIntent();
      notificationCancelIntent();
      setNotification(false);
      setFrecuency(~~frecuency);
      setNote(note);
      setDetune(detune);
      setPitch(pitch);

      return pitch;
    };

    const checker = (pitch: number) => {
      const isCorrect =
        !!pitch && (condition?.(pitch) || (savedPitch === pitch && pitch === target));
      if (!isCorrect) savedPitch = pitch;
      return isCorrect;
    };

    const onSuccess = () => setCorrect(true);

    const consultPlayedNote = persistentChecker(getPitch, checker, onSuccess);

    interval = setInterval(consultPlayedNote, delay);

    return () => {
      setCorrect(false);
      setNotification(false);
      clearInterval(interval);
      cancelNotificationIntent();
      cancelNotificationCancelIntent();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, condition, started]);

  return {
    detune,
    note,
    pitch,
    frecuency,
    correct,
  };
};

export default useCorrectPitch;

export const debounce = (fn: () => any, delay = 50): ((cancel?: boolean) => any) => {
  let timer: number;

  return (cancel = false) => {
    if (cancel) return clearTimeout(timer);
    if (timer === undefined) timer = setTimeout(fn, delay);
  };
};

// const checkPitch = () => {
//   analyser.getFloatTimeDomainData(buf);
//   const [frecuency, clarity] = pitchDetector.findPitch(buf, audio.sampleRate);

//   const pitch = pitchFromFrecuency(frecuency);
//   const note = Object.values(notes)[pitch % 12] as keyof typeof notes;
//   const detune = centsOffFromPitch(frecuency, pitch);

//   console.log({note, clarity});

//   if (clarity <= 0.95) {
//     if (clarity >= 0.85) {
//       setNotification(true);
//     } else setNotification(true);
//     return;
//   }

//   setNotification(false);
//   setFrecuency(~~frecuency);
//   setNote(note);
//   setDetune(detune);
//   setPitch(pitch);

//   if (savedPitch === undefined) savedPitch = pitch;
//   else {
//     if (condition?.(pitch) || (savedPitch === pitch && pitch === target)) {
//       if (!remainingTries) {
//         clearInterval(interval);
//         return setCorrect(true);
//       }
//       console.log({remainingTries});
//       remainingTries--;
//     } else {
//       savedPitch = pitch;
//       remainingTries = initialTries;
//     }
//   }
// };
