/* eslint-disable no-empty */
import {useState, useEffect, useContext} from 'react';
import {AudioContext, AudioProps, audioEcosystem} from '../contexts/AudioContext';

interface MetronomeProps {
  bpm: number;
  initialNumerator?: number;
  initialDenominator?: number;
}

let firstClickAudioBuffer: AudioBuffer;
let clickAudioBuffer: AudioBuffer;

const defaultSubdivision = 2 ** 2;

(async () => {
  firstClickAudioBuffer = await audioEcosystem.loadAudioFile('/audio/metronome_oct_up.mp3');
  clickAudioBuffer = await audioEcosystem.loadAudioFile('/audio/metronome.mp3');
})();

const useMetronome = ({bpm, initialNumerator = 4, initialDenominator = 4}: MetronomeProps) => {
  const {started} = useContext(AudioContext) as AudioProps;

  const [position, setPosition] = useState(-1);
  const [bar, setBar] = useState<[number, number]>([initialNumerator, initialDenominator]);

  useEffect(() => {
    if (!started) return;

    const denominator = bar[1];
    const msInterval = bpmToFrecuency(bpm) * (defaultSubdivision / 2 ** Math.log2(denominator));

    const task = () => {
      setPosition(ps => {
        const isLast = ps === bar[0] - 1 || ps === -1;
        audioEcosystem.playBuffer(isLast ? firstClickAudioBuffer : clickAudioBuffer);
        return isLast ? 0 : ps + 1;
      });
    };
    const stopTask = pollTask(msInterval, task);

    return () => {
      stopTask?.();
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

function pollTask(msInterval: number, task: () => void) {
  let interval: number;
  task();
  let targetTime = performance.now() + msInterval;
  const poll = () => {
    if (performance.now() >= targetTime - 15) {
      clearInterval(interval);
      while (performance.now() < targetTime - 2);
      task();
      targetTime += msInterval;
      interval = setInterval(poll);
    }
  };
  interval = setInterval(poll);
  return () => clearInterval(interval);
}

// const isPowerOfTwo = (n: number) => {
//   if (n <= 0) return false;
//   return (n & (n - 1)) === 0;
// };
