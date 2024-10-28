import {ToastContext, ToastProps} from '@/contexts/ToastContext';
import {MutableRefObject, useContext, useEffect, useRef} from 'react';
import {AudioContext, AudioProps} from '../contexts/AudioContext';

const usePitch = (setFrecuency: (v: TPitchToPlay) => void) => {
  const {started, startMic} = useContext(AudioContext) as AudioProps;
  const {close, setToastOptions} = useContext(ToastContext) as ToastProps;

  const timeout = useRef<number>();
  const setterRef: Readonly<MutableRefObject<(v: GetPitchReturnType) => void>> = useRef(
    ({frecuency}: GetPitchReturnType) => {
      const prepareToast = () => {
        if (timeout.current !== undefined) return;
        timeout.current = setTimeout(() => {
          timeout.current = undefined;
          setToastOptions({message: 'noAudioDetected', duration: -1});
        }, 5000);
      };

      if (frecuency === null) prepareToast();
      else {
        close();
        clearTimeout(timeout.current);
        timeout.current = undefined;
        setFrecuency(frecuency);
      }
    },
  );

  useEffect(() => {
    (async () => {
      const allowed = await startMic(setterRef.current);
      if (!allowed) return;
    })();
    return () => {
      close();
      setFrecuency(null);
      clearTimeout(timeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);
};

export default usePitch;
