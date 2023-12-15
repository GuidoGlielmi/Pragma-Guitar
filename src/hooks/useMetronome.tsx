/* eslint-disable no-empty */
import {useState, useEffect, useContext, useRef} from 'react';
import {AudioContext, AudioProps, audioEcosystem} from '../contexts/AudioContext';
import {setPreciseInterval} from '../helpers/timer';
import useInitialBufferLoad from './useInitialBufferLoad';

interface MetronomeProps {
  bpm: number;
  initialNumerator?: number;
  initialDenominator?: number;
}

const defaultSubdivision = 2 ** 2;

const useMetronome = ({bpm, initialNumerator = 4, initialDenominator = 4}: MetronomeProps) => {
  const {started} = useContext(AudioContext) as AudioProps;

  const firstClickAudioBuffer = useInitialBufferLoad('/audio/metronome_oct_up.mp3');
  const clickAudioBuffer = useInitialBufferLoad('/audio/metronome.mp3');

  const [position, setPosition] = useState(-1);
  const [bar, setBar] = useState<[number, number]>([initialNumerator, initialDenominator]);

  const startMetronomeIntervalRef = useRef((msInterval: number, numerator: number) => {
    const task = () => {
      setPosition(ps => {
        const nextShouldBeFirst = ps === numerator - 1 || ps === -1;
        audioEcosystem.playBuffer(
          nextShouldBeFirst ? firstClickAudioBuffer.current! : clickAudioBuffer.current!,
        );
        return nextShouldBeFirst ? 0 : ps + 1;
      });
    };
    return setPreciseInterval(task, msInterval);
  });

  useEffect(() => {
    if (!started) return;
    const [numerator, denominator] = bar;
    const msInterval = bpmToFrecuency(bpm) * (defaultSubdivision / 2 ** Math.log2(denominator));

    const interval = startMetronomeIntervalRef.current(msInterval, numerator);

    return () => {
      clearInterval(interval.id);
      setPosition(-1);
    };
  }, [started, bpm, bar]);

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
