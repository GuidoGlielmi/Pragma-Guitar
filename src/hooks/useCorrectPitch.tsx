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

const useCorrectPitch = ({target, condition}: Condition): UseCorrectPitch => {
  const frecuency = usePitch();
  const [correct, setCorrect] = useState(false);
  const [correctDebounced, setCorrectDebounced] = useDebouncedChange(correct, 200);

  const prevCorrect = useRef(correct);

  useEffect(() => {
    setCorrect(false);
    setCorrectDebounced(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, condition]);

  useEffect(() => {
    if (correct) return;
    const pitch = pitchFromFrequency(frecuency);
    setCorrect(!!pitch && (condition?.(pitch) ?? pitch === target));
  }, [frecuency, target, condition, correct]);

  useEffect(() => {
    prevCorrect.current = correctDebounced;
  }, [correctDebounced]);

  return {
    frecuency,
    correct: correctDebounced,
  };
};

export default useCorrectPitch;
