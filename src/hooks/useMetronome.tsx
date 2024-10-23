/* eslint-disable no-empty */
import {useContext, useEffect, useState} from 'react';
import {AudioContext, AudioProps, audioEcosystem} from '../contexts/AudioContext';
import {setPreciseTimeout} from '../helpers/timer';
import useInitialBufferLoad from './useInitialBufferLoad';

const defaultSubdivision = 2 ** 2;

type TUseMetronomeProps = {
  bpm: number;
  setBpm: (value: React.SetStateAction<number>) => void;
  nextBpm: number;
  bar: [number, number];
};

const useMetronome = ({bpm, setBpm, nextBpm, bar}: TUseMetronomeProps) => {
  const {started} = useContext(AudioContext) as AudioProps;

  const firstClickAudioBuffer = useInitialBufferLoad('/audio/metronome_oct_up.mp3');
  const clickAudioBuffer = useInitialBufferLoad('/audio/metronome.mp3');

  const [position, setPosition] = useState(-1);
  const [lastPlayedAt, setLastPlayedAt] = useState<number>();

  useEffect(() => {
    if (!started) return setPosition(-1);
    if (!firstClickAudioBuffer || !clickAudioBuffer) return;

    const [numerator, denominator] = bar;

    const nextShouldBeFirst = position === numerator - 1 || position === -1;
    const task = () => {
      audioEcosystem.playBuffer(nextShouldBeFirst ? firstClickAudioBuffer : clickAudioBuffer);
      setPosition(nextShouldBeFirst ? 0 : position + 1);
      setLastPlayedAt(performance.now());
      if (!!nextBpm && position === numerator - 1) setBpm(nextBpm);
    };

    const msInterval = bpmToFrecuency(bpm) * (defaultSubdivision / 2 ** Math.log2(denominator));
    const timeoutId = setPreciseTimeout(task, msInterval, lastPlayedAt || performance.now());

    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, bpm, bar, position, firstClickAudioBuffer, clickAudioBuffer]);

  return position;
};

const bpmToFrecuency = (bpm: number) => (1 / (bpm / 60)) * 1000;

export default useMetronome;

// const isPowerOfTwo = (n: number) => {
//   if (n <= 0) return false;
//   return (n & (n - 1)) === 0;
// };
