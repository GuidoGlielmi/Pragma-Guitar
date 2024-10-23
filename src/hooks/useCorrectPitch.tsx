import {
  HOLD_TIME_TO_CONSIDER_PITCH_READING_TO_BE_ACCURATE,
  MAX_ACCEPTABLE_DETUNE,
} from '@/constants';
import {areSameNote, centsOffFromPitch, closestPitchFromFrequency} from '@/helpers/pitch';
import {useEffect, useRef} from 'react';
import usePitch from './usePitch';

type TUseCorrectPitchProps = {
  target: TPitchToPlay;
  exactOctave: boolean;
  cb: () => void;
  extraDependencies?: any[];
};

/**
 * Executes a callback when pitch reading matches the condition or target specified, and is held enough time for it to be consider a realistic reading.
 * @param {Function} o.condition Should be memoized
 * @param {TPitchToPlay} o.target Should be memoized
 */
const useCorrectPitch = ({
  target,
  exactOctave,
  cb,
  extraDependencies = [],
}: TUseCorrectPitchProps) => {
  const timeoutRef = useRef<number>();
  const correctRef = useRef(false);
  const targetRef = useRef<TPitchToPlay>(target);

  usePitch(v => {
    if (correctRef.current || v === null) return;
    if (!isCorrectPitch(v, targetRef.current, exactOctave)) {
      // console.log('Hitting incorrect note');
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
      return;
    }
    // console.log('Hitting correct note');
    if (timeoutRef.current !== undefined) return;
    timeoutRef.current = setTimeout(() => {
      cb();
      correctRef.current = true;
      timeoutRef.current = undefined;
    }, HOLD_TIME_TO_CONSIDER_PITCH_READING_TO_BE_ACCURATE);
  });

  useEffect(() => {
    correctRef.current = false;
    targetRef.current = target;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, exactOctave, ...extraDependencies]);
};

function isCorrectPitch(frecuency: TPitchToPlay, target: TPitchToPlay, exactOctave: boolean) {
  if (frecuency === null || target === null) return false;

  const pitch = closestPitchFromFrequency(frecuency) as number;
  if (!(exactOctave ? pitch === target : areSameNote(pitch, target))) return false;

  const detune = centsOffFromPitch(frecuency, target) as number;
  return Math.abs(detune) > MAX_ACCEPTABLE_DETUNE;
}

export default useCorrectPitch;
