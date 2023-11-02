import {useState, useEffect, useRef} from 'react';

import usePitch from './usePitch';
import useDebouncedChange from './useDebouncedChange';
import {pitchFromFrequency} from '../libs/Helpers';

type Condition =
  | {
      target?: number | null;
      condition: (pitch: number) => boolean;
    }
  | {
      target: number | null;
      condition?: (pitch: number) => boolean;
    };

type UseCorrectPitch = {frecuency: number | null; correct: boolean};

const MS_TO_CONSIDER_PITCH_READING_TO_BE_ACCURATE = 1000 / 12;

const useCorrectPitch = ({target, condition}: Condition): UseCorrectPitch => {
  const frecuency = usePitch();
  const [correct, setCorrect] = useState(false);
  const [correctDebounced, setCorrectDebounced] = useDebouncedChange(
    correct,
    MS_TO_CONSIDER_PITCH_READING_TO_BE_ACCURATE,
  );

  const prevCorrect = useRef(correct);

  useEffect(() => {
    setCorrectDebounced(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, condition]);

  useEffect(() => {
    if (correctDebounced) return;
    const pitch = pitchFromFrequency(frecuency);
    setCorrect(pitch !== null && (condition?.(pitch) ?? pitch === target));
  }, [frecuency, target, condition, correctDebounced]);

  useEffect(() => {
    prevCorrect.current = correctDebounced;
  }, [correctDebounced]);

  return {
    frecuency,
    correct: correctDebounced,
  };
};

export default useCorrectPitch;
