import {useState, useEffect, useContext, useRef} from 'react';
import {AudioContext, AudioProps, micInputStream} from '../contexts/AudioContext';

import usePitch from './usePitch';

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

const useAsd = ({target, condition}: Condition): UseCorrectPitch => {
  const {detune, frecuency, pitch, note} = usePitch();
  const {started, getMicInputStream} = useContext(AudioContext) as AudioProps;

  const [currStreak, setCurrStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correct, setCorrect] = useState(false);

  const prevCorrect = useRef(correct);

  useEffect(() => {
    if (!micInputStream && started) {
      getMicInputStream();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  useEffect(() => {
    if (!prevCorrect.current) setCurrStreak(0);
    setCorrect(false);
  }, [target, condition]);

  useEffect(() => {
    setMaxStreak(ps => Math.max(ps, currStreak));
  }, [currStreak]);

  useEffect(() => {
    if (correct) return;
    const isCorrect = !!pitch && (condition?.(pitch) || pitch === target);
    if (isCorrect) {
      const timer = setTimeout(() => {
        setCorrect(true);
      }, 400);
      return () => {
        clearTimeout(timer);
      };
    }
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
    correct,
    currStreak,
    maxStreak,
  };
};

export default useAsd;
