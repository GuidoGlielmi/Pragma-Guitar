import {useState, useEffect} from 'react';

import usePitch from './usePitch';
import useDebouncedChange from './useDebouncedChange';
import {centsOffFromPitch, closestPitchFromFrequency} from '../libs/Helpers';

type ConditionFn = (pitch: number, detune: number) => boolean;

type Condition =
  | {
      target?: TPitchToPlay;
      condition: ConditionFn;
    }
  | {
      target: TPitchToPlay;
      condition?: ConditionFn;
    };

type UseCorrectPitch = {frecuency: TPitchToPlay; correct: boolean};

const MS_TO_CONSIDER_PITCH_READING_TO_BE_ACCURATE = 1000 / 12;

const useCorrectPitch = ({target, condition}: Condition): UseCorrectPitch => {
  const frecuency = usePitch();
  const [correct, setCorrect] = useState(false);
  const [correctDebounced, setCorrectDebounced] = useDebouncedChange(
    correct,
    MS_TO_CONSIDER_PITCH_READING_TO_BE_ACCURATE,
  );

  useEffect(() => {
    setCorrectDebounced(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, condition]);

  useEffect(() => {
    if (correctDebounced) return;
    const pitch = closestPitchFromFrequency(frecuency);
    const detune = centsOffFromPitch(frecuency, pitch);
    setCorrect(
      pitch !== null &&
        detune !== null &&
        (condition?.(pitch, Math.abs(detune)) ?? pitch === target),
    );
  }, [frecuency, target, condition, correctDebounced]);

  return {
    frecuency,
    correct: correctDebounced,
  };
};

export default useCorrectPitch;
