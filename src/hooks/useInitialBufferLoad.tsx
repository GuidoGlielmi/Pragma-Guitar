import {useRef, useEffect} from 'react';
import {audioEcosystem} from '../contexts/AudioContext';

const useInitialBufferLoad = (path: string) => {
  const bufferRef = useRef<AudioBuffer>();

  useEffect(() => {
    audioEcosystem.loadAudioFile(path).then(af => (bufferRef.current = af));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return bufferRef;
};

export default useInitialBufferLoad;
