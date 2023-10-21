import {useState, useEffect, useRef} from 'react';

import usePitch from './usePitch';
import useDebouncedChange from './useDebouncedChange';

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
type UseCorrectPitch = UsePitch & {correct: boolean; currStreak: number; maxStreak: number};

const useCorrectPitch = ({target, condition}: Condition): UseCorrectPitch => {
  const {detune, frecuency, pitch, note} = usePitch();
  const [currStreak, setCurrStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(+localStorage.getItem('maxStreak')! || 0);
  const [correct, setCorrect] = useState(false);
  const correctDebounced = useDebouncedChange(correct, 200);

  const prevCorrect = useRef(correct);

  useEffect(() => {
    if (!prevCorrect.current) setCurrStreak(0);
    setCorrect(false);
  }, [target, condition]);

  useEffect(() => {
    setMaxStreak(ps => Math.max(ps, currStreak));
  }, [currStreak]);

  useEffect(() => {
    localStorage.setItem('maxStreak', maxStreak.toString());
  }, [maxStreak]);

  useEffect(() => {
    if (correct) return;
    setCorrect(!!pitch && (condition?.(pitch) ?? pitch === target));
  }, [pitch, target, condition, correct]);

  useEffect(() => {
    prevCorrect.current = correct;
    if (correct) {
      setCurrStreak(ps => ps + 1);
    }
  }, [correct]);

  return {
    detune,
    note,
    pitch,
    frecuency,
    correct: correctDebounced ?? false,
    currStreak,
    maxStreak,
  };
};

export default useCorrectPitch;
