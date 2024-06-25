/* eslint-disable no-empty */
import {
  MetronomeContext,
  MetronomeProps as MetronomeContextProps,
} from '@/contexts/MetronomeContext';
import {useContext, useEffect, useState} from 'react';
import {AudioContext, AudioProps, audioEcosystem} from '../contexts/AudioContext';
import {setPreciseTimeout} from '../helpers/timer';
import useInitialBufferLoad from './useInitialBufferLoad';

interface MetronomeProps {
  initialNumerator?: number;
  initialDenominator?: number;
}

const defaultSubdivision = 2 ** 2;

const useMetronome = ({initialNumerator = 4, initialDenominator = 4}: MetronomeProps = {}) => {
  const {bpm, setBpm, nextBpm} = useContext(MetronomeContext) as MetronomeContextProps;
  const {started} = useContext(AudioContext) as AudioProps;

  const firstClickAudioBuffer = useInitialBufferLoad('/audio/metronome_oct_up.mp3');
  const clickAudioBuffer = useInitialBufferLoad('/audio/metronome.mp3');

  const [position, setPosition] = useState(-1);
  const [bar, setBar] = useState<[number, number]>([initialNumerator, initialDenominator]);
  const [lastPlayedAt, setLastPlayedAt] = useState<number>();

  useEffect(() => {
    if (!started) return setPosition(-1);
    if (!firstClickAudioBuffer || !clickAudioBuffer) return;
    const [numerator, denominator] = bar;
    const msInterval = bpmToFrecuency(bpm) * (defaultSubdivision / 2 ** Math.log2(denominator));
    const nextShouldBeFirst = position === numerator - 1 || position === -1;
    const task = () => {
      audioEcosystem.playBuffer(nextShouldBeFirst ? firstClickAudioBuffer : clickAudioBuffer);
      setPosition(nextShouldBeFirst ? 0 : position + 1);
      setLastPlayedAt(performance.now());
      if (!!nextBpm && position === numerator - 1) setBpm(nextBpm);
    };

    const fromTimestamp = lastPlayedAt || performance.now();
    const timeoutId = setPreciseTimeout(task, msInterval, fromTimestamp);

    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, bpm, bar, position, firstClickAudioBuffer, clickAudioBuffer]);

  return [bar, setBar, position] as [
    [number, number],
    React.Dispatch<React.SetStateAction<[number, number]>>,
    number,
  ];
};

const bpmToFrecuency = (bpm: number) => (1 / (bpm / 60)) * 1000;

export default useMetronome;

// const isPowerOfTwo = (n: number) => {
//   if (n <= 0) return false;
//   return (n & (n - 1)) === 0;
// };
