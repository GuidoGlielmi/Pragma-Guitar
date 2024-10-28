import {AudioContext, AudioProps, audioEcosystem} from '@/contexts/AudioContext';
import {setPreciseTimeout} from '@/helpers/timer';
import {useContext, useEffect, useRef} from 'react';

const usePlayAudioLooped = (msInterval: number, cb: () => void, audioBuffer?: AudioBuffer) => {
  const {started} = useContext(AudioContext) as AudioProps;
  const cancelRef = useRef<() => void>();

  useEffect(() => {
    if (!audioBuffer || !started) return;

    let timeoutId = setPreciseTimeout(task, msInterval);
    function task() {
      timeoutId = setPreciseTimeout(task, msInterval);
      cb();
      audioEcosystem.playBuffer(audioBuffer!, false);
    }

    cancelRef.current = () => clearTimeout(timeoutId);
    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, msInterval, audioBuffer]);

  useEffect(() => {
    if (!started) cancelRef.current?.();
  }, [started]);
};

export default usePlayAudioLooped;
