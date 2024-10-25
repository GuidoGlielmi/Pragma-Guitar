import {micObservable} from '@/helpers/MicObservable';
import {MutableRefObject, useContext, useEffect, useRef} from 'react';
import {AudioContext, AudioProps} from '../contexts/AudioContext';

const usePitch = (setFrecuency: (v: TPitchToPlay) => void) => {
  const {started, startMic, stopMic} = useContext(AudioContext) as AudioProps;
  const setterRef: Readonly<MutableRefObject<(v: number) => void>> = useRef(setFrecuency);

  useEffect(() => {
    if (!started) return;

    (async () => {
      const allowed = await startMic();
      if (!allowed) return;
      micObservable.start(setterRef.current);
    })();
    return () => {
      setFrecuency(null);
      stopMic();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      micObservable.stop(setterRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return [
    () => micObservable.start(setterRef.current),
    () => micObservable.stop(setterRef.current),
  ] as [suscriber: () => void, unsuscriber: () => void];
};

export default usePitch;
