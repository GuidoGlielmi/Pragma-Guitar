import {AudioContext, AudioProps, audioEcosystem} from '@/contexts/AudioContext';
import {setPreciseTimeout} from '@/helpers/timer';
import {useContext, useEffect, useRef} from 'react';

const usePlayAudio = (msInterval: number, cb: () => void) => {
  const {started} = useContext(AudioContext) as AudioProps;
  const audioRef = useRef<AudioBuffer>();
  const cancelRef = useRef<() => void>();

  useEffect(() => {
    if (!audioRef.current || !started) return;

    let timeoutId = setPreciseTimeout(task, msInterval);
    function task() {
      timeoutId = setPreciseTimeout(task, msInterval);
      cb();
      audioEcosystem.playBuffer(audioRef.current!, false);
    }

    cancelRef.current = () => clearTimeout(timeoutId);
    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, msInterval]);

  useEffect(() => {
    if (!started) cancelRef.current?.();
  }, [started]);

  return audioRef;
};

export default usePlayAudio;
