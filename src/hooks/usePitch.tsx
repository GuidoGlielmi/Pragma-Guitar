import {micObservable} from '@/helpers/MicObservable';
import {useContext, useEffect} from 'react';
import {AudioContext, AudioProps} from '../contexts/AudioContext';

const usePitch = (setFrecuency: (v: TPitchToPlay) => void) => {
  const {started, startMic, stopMic} = useContext(AudioContext) as AudioProps;
  useEffect(() => {
    if (!started) return;

    (async () => {
      const allowed = await startMic();
      if (!allowed) return;
      micObservable.start(setFrecuency);
    })();
    return () => {
      setFrecuency(null);
      stopMic();
      micObservable.stop(setFrecuency);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);
};

export default usePitch;
