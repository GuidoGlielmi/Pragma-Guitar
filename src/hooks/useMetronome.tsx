/* eslint-disable no-empty */
import {useState, useEffect, useContext} from 'react';
import {
  AudioContext,
  AudioProps,
  clickSourceNode,
  firstClickSourceNode,
} from '../contexts/AudioContext';

interface MetronomeProps {
  bpm: number;
  initialNumerator?: number;
  initialDenominator?: number;
}

const defaultSubdivision = 2 ** 2;

const useMetronome = ({bpm, initialNumerator = 4, initialDenominator = 4}: MetronomeProps) => {
  const {started, playClick} = useContext(AudioContext) as AudioProps;
  const [position, setPosition] = useState(-1);
  const [bar, setBar] = useState<[number, number]>([initialNumerator, initialDenominator]);

  useEffect(() => {
    if (!started) return;
    setPosition(0);
    const stopFlag = {stop: false};

    (async () => {
      await playClick(true);

      const denominator = bar[1];
      const msInterval = bpmToFrecuency(bpm) * (defaultSubdivision / 2 ** Math.log2(denominator));

      const task = () => {
        setPosition(ps => {
          const isLast = ps === bar[0] - 1;
          playClick(isLast);
          return isLast ? 0 : ps + 1;
        });
      };
      iterateTask(msInterval, task, stopFlag);
    })();

    return () => {
      if (started) {
        clickSourceNode?.stop();
        firstClickSourceNode?.stop();
        clickSourceNode?.disconnect();
        firstClickSourceNode?.disconnect();
      }
      setPosition(-1);
      stopFlag.stop = true;
    };
  }, [started, bpm, bar, playClick]);

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
      if (performance.now() >= targetTime - 10) {
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
