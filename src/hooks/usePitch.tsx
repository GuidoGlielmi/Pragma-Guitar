import {useState, useEffect, useContext} from 'react';
import {PitchDetector} from 'pitchy';
import {AudioContext, AudioProps} from '../contexts/AudioContext';
import {getPitch} from '../helpers/pitch';

const buflen = 2048;

const pitchDetector = PitchDetector.forFloat32Array(buflen);

const buf = new Float32Array(buflen);

const usePitch = ({interval = 50, minFrecuency = 60, maxFrecuency = 10000} = {}) => {
  const {started, startMic, stopMic} = useContext(AudioContext) as AudioProps;

  const [frecuency, setFrecuency] = useState<TPitchToPlay>(null);

  useEffect(() => {
    if (!started) return;

    let updateInterval: number;

    (async () => {
      const allowed = await startMic();
      if (!allowed) return;
      async function updatePitch() {
        const frecuency = getPitch(minFrecuency, maxFrecuency, pitchDetector, buf);
        setFrecuency(frecuency === -1 || !frecuency ? null : frecuency);
      }
      updatePitch();
      updateInterval = setInterval(updatePitch, interval);
    })();
    return () => {
      clearInterval(updateInterval);
      setFrecuency(null);
      stopMic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return frecuency;
};

export default usePitch;
