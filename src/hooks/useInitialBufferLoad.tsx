import {useRef, useEffect} from 'react';
import {audioEcosystem} from '../contexts/AudioContext';

const useInitialBufferLoad = (path: string) => {
  const bufferRef = useRef<AudioBuffer>();

  useEffect(() => {
    (async () => {
      bufferRef.current = await audioEcosystem.loadAudioFile(path);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return bufferRef;
};

export default useInitialBufferLoad;
