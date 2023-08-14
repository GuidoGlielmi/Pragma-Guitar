import {useState, useEffect, useContext} from 'react';
import {AudioContext, AudioProps} from '../contexts/AudioContext';

interface MetronomeProps {
  bpm: number;
  lastPosition: number;
  initialNumerator?: number;
  initialDenominator?: number;
}

const defaultSubdivision = 2 ** 2;

const useMetronome = ({bpm, initialNumerator = 4, initialDenominator = 4}: MetronomeProps) => {
  const {source} = useContext(AudioContext) as AudioProps;
  const [position, setPosition] = useState(0);
  const [bar, setBar] = useState<[number, number]>([initialNumerator, initialDenominator]);

  useEffect(() => {
    if (!source) return;

    new Audio('/audio/metronome_oct_up.mp3').play();
    const [, denominator] = bar;

    const interval = setInterval(() => {
      setPosition(ps => {
        const isLast = ps === bar[0] - 1;
        console.log(123);
        new Audio(`/audio/metronome${isLast ? '_oct_up' : ''}.mp3`).play();
        return isLast ? 0 : ps + 1;
      });
    }, bpmToFrecuency(bpm) * (defaultSubdivision / 2 ** Math.log2(denominator)));

    return () => {
      setPosition(0);
      clearInterval(interval);
    };
  }, [source, bpm, bar]);

  return [bar, setBar, position] as [
    [number, number],
    React.Dispatch<React.SetStateAction<[number, number]>>,
    number,
  ];
};

// const isPowerOfTwo = (n: number) => {
//   if (n <= 0) return false;
//   return (n & (n - 1)) === 0;
// };

const bpmToFrecuency = (bpm: number) => (1 / (bpm / 60)) * 1000;

export default useMetronome;
