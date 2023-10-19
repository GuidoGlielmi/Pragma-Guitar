/* eslint-disable no-empty */
import {useState, useEffect, useContext, useRef} from 'react';
import {AudioContext, AudioProps, audioEcosystem} from '../contexts/AudioContext';
import {debounce, pollTask} from '../helpers/timer';

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

  const stopPollRef = useRef<() => void>();
  const debouncedPollRef = useRef(
    debounce((msInterval: number, numerator: number) => {
      const task = () =>
        setPosition(ps => {
          const isLast = ps === numerator - 1 || ps === -1;
          audioEcosystem.playBuffer(isLast ? firstClickAudioBuffer : clickAudioBuffer);
          return isLast ? 0 : ps + 1;
        });
      stopPollRef.current = pollTask(msInterval, task);
    }, 2000),
  );

  useEffect(() => {
    if (!started) return;
    const [numerator, denominator] = bar;
    const msInterval = bpmToFrecuency(bpm) * (defaultSubdivision / 2 ** Math.log2(denominator));

    const cancelPollingSchedule = debouncedPollRef.current(msInterval, numerator);

    return () => {
      cancelPollingSchedule();
      stopPollRef.current?.();
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
