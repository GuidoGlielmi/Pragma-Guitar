import {useState, useEffect} from 'react';
import usePitch, {UsePitch} from './usePitch';

let interval: number;

const initialTries = 3;

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
const useCorrectPitch = ({target, condition, delay}: Condition): UseCorrectPitch => {
  const {detune, note, pitch, getNotePosition, frecuency, notification} = usePitch();
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCorrect(false);
  }, [target, condition]);

  useEffect(() => {
    if (pitch === null) {
      setCorrect(false);
      clearInterval(interval);
    }
  }, [pitch]);

  useEffect(() => {
    if (correct || pitch === null) return;

    let remainingTries = initialTries;
    let savedPitch: number;
    const checkPitch = () => {
      // console.log({pitch, correct: target === pitch || condition?.(savedPitch)});
      if (savedPitch === undefined) savedPitch = pitch;
      else {
        if (condition?.(savedPitch) || (savedPitch === pitch && savedPitch === target)) {
          if (!remainingTries) {
            clearInterval(interval);
            return setCorrect(true);
          }
          remainingTries--;
        } else {
          savedPitch = pitch;
          remainingTries = initialTries;
        }
      }
    };
    interval = setInterval(checkPitch, delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, condition, pitch]);

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
