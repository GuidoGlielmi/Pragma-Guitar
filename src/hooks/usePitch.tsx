import {useContext, useEffect} from 'react';
import {AudioContext, AudioProps} from '../contexts/AudioContext';

const usePitch = (setFrecuency: (v: TPitchToPlay) => void) => {
  const {started, startMic} = useContext(AudioContext) as AudioProps;

  useEffect(() => {
    (async () => {
      const allowed = await startMic(({frecuency}: GetPitchReturnType) => setFrecuency(frecuency));
      if (!allowed) return;
    })();
    return () => {
      close();
      setFrecuency(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);
};

export default usePitch;
