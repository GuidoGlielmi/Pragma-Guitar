import {
  MAX_BPM,
  MAX_COUNTDOWN_VALUE,
  MAX_FRETS_AMOUNT,
  MIN_BPM,
  MIN_COUNTDOWN_VALUE,
  pitchRangeLimits,
} from '@/constants';

export const valueLimiter = (value: number, ...limits: [min: number, max: number]) =>
  Math.min(limits[1], Math.max(limits[0], value));

export const createValueLimiter = (min: number, max: number) => {
  return (value: number) => valueLimiter(value, min, max);
};

export const countdownValueLimiter = createValueLimiter(MIN_COUNTDOWN_VALUE, MAX_COUNTDOWN_VALUE);

export const pitchValueLimiter = createValueLimiter(...pitchRangeLimits);

export const fretsLimiter = createValueLimiter(0, MAX_FRETS_AMOUNT);

export const fretsLimiterStateAction = (value: number): React.SetStateAction<number> => {
  return ps => {
    return fretsLimiter(ps + value);
  };
};

export const bpmLimiter = createValueLimiter(MIN_BPM, MAX_BPM);
