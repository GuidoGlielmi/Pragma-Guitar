/* eslint-disable no-empty */
import {useState, useEffect, useContext} from 'react';
import {AudioContext, AudioProps, audioCtx} from '../contexts/AudioContext';

interface MetronomeProps {
  bpm: number;
  initialNumerator?: number;
  initialDenominator?: number;
}

const defaultSubdivision = 2 ** 2;

const useMetronome = ({bpm, initialNumerator = 4, initialDenominator = 4}: MetronomeProps) => {
  const {source, playClick} = useContext(AudioContext) as AudioProps;
  const [position, setPosition] = useState(0);
  const [bar, setBar] = useState<[number, number]>([initialNumerator, initialDenominator]);

  useEffect(() => {
    if (!source) return;

    new Audio('/audio/metronome_oct_up.mp3').play();
    const [, denominator] = bar;
    const msInterval = bpmToFrecuency(bpm) * (defaultSubdivision / 2 ** Math.log2(denominator));

    const stopFlag = {stop: false};
    const task = () => {
      setPosition(ps => {
        const isLast = ps === bar[0] - 1;
        playClick(isLast);
        return isLast ? 0 : ps + 1;
      });
    };
    iterateTask(msInterval, task, stopFlag);

    return () => {
      setPosition(0);
      stopFlag.stop = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, bpm, bar]);

  return [bar, setBar, position] as [
    [number, number],
    React.Dispatch<React.SetStateAction<[number, number]>>,
    number,
  ];
};

const bpmToFrecuency = (bpm: number) => (1 / (bpm / 60)) * 1000;

const iterateTask = (msInterval: number, task: () => void, stopFlag: {stop: boolean}) => {
  let interval: number;
  let targetTime = performance.now() + msInterval;

  const startTimer = () => {
    interval = setInterval(() => {
      if (stopFlag.stop) return clearInterval(interval);
      if (performance.now() >= targetTime - 20) {
        while (performance.now() < targetTime) {}
        requestAnimationFrame(task);
        targetTime += msInterval;
      }
    });
  };
  startTimer();
};

// const isPowerOfTwo = (n: number) => {
//   if (n <= 0) return false;
//   return (n & (n - 1)) === 0;
// };

export default useMetronome;
