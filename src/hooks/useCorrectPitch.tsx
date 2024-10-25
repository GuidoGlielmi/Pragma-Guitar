import {
  MAX_ACCEPTABLE_DETUNE,
  MS_HOLD_TIME_TO_CONSIDER_PITCH_READING_TO_BE_ACCURATE,
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
 * Executes a callback when pitch reading matches the specified target, and is held enough time for it to be consider a realistic reading.
 */
const useCorrectPitch = ({
  target,
  exactOctave,
  cb,
  extraDependencies = [],
}: TUseCorrectPitchProps) => {
  const timeoutRef = useRef<number>();
  const correctRef = useRef(false);

  // convert all dependencies in refs to avoid excessive re-rendering
  const exactOctaveRef = useRef<boolean>(exactOctave);
  const targetRef = useRef<TPitchToPlay>(target);

  usePitch(v => {
    if (correctRef.current || v === null) return;
    if (!isCorrectPitch(v, targetRef.current, exactOctaveRef.current)) {
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
    }, MS_HOLD_TIME_TO_CONSIDER_PITCH_READING_TO_BE_ACCURATE);
  });

  useEffect(() => {
    // this kind of implementation stops the excessive re-rendering of usePitch
    correctRef.current = false;
    targetRef.current = target;
    exactOctaveRef.current = exactOctave;
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
