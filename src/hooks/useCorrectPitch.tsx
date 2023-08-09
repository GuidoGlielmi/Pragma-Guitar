import {useState, useEffect, useContext} from 'react';
import {UsePitch} from './usePitch';
import {pitchFromFrecuency, centsOffFromPitch} from '../libs/Helpers';
import {PitchDetector} from 'pitchy';
import {AudioContext, AudioProps} from '../contexts/AudioContext';
import {notes} from '../constants/notes';

let interval: number;

const initialTries = 3;
const buflen = 2048;
const buf = new Float32Array(buflen);

type Condition = {
  delay?: number;
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
const useCorrectPitch = ({target, condition, delay = 75}: Condition): UseCorrectPitch => {
  const {audio, analyser, started, notification, setNotification} = useContext(
    AudioContext,
  ) as AudioProps;

  const [pitchDetector, setPitchDetector] = useState<PitchDetector<Float32Array> | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [frecuency, setFrecuency] = useState<number | null>(null);
  const [pitch, setPitch] = useState<number | null>(null);
  const [detune, setDetune] = useState<number | null>(null);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    setPitchDetector(PitchDetector.forFloat32Array(buflen));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!started || !pitchDetector) return;

    let remainingTries = initialTries;
    let savedPitch: number;
    const checkPitch = () => {
      analyser.getFloatTimeDomainData(buf);
      const [frecuency, clarity] = pitchDetector.findPitch(buf, audio.sampleRate);

      const pitch = pitchFromFrecuency(frecuency);
      const note = Object.values(notes)[pitch % 12] as keyof typeof notes;
      const detune = centsOffFromPitch(frecuency, pitch);

      // console.log({note, clarity});

      if (clarity <= 0.95) {
        if (clarity >= 0.85) {
          setNotification(true);
        } else setNotification(true);
        return;
      }

      setNotification(false);
      setFrecuency(~~frecuency);
      setNote(note);
      setDetune(detune);
      setNotification(false);
      setPitch(pitch);

      if (savedPitch === undefined) savedPitch = pitch;
      else {
        if (condition?.(pitch) || (savedPitch === pitch && pitch === target)) {
          if (!remainingTries) {
            clearInterval(interval);
            return setCorrect(true);
          }
          console.log({remainingTries});
          remainingTries--;
        } else {
          savedPitch = pitch;
          remainingTries = initialTries;
        }
      }
    };
    interval = setInterval(checkPitch, delay);
    return () => {
      console.log('returned main useEffect');
      setCorrect(false);
      setNotification(false);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, condition, started]);

  const getNotePosition = () => {
    return pitch ? Math.floor(pitch / 12) - 1 : null;
  };

  return {
    detune,
    note,
    pitch,
    getNotePosition,
    frecuency,
    correct,
    notification,
  };
};

export default useCorrectPitch;
