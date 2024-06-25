import {useEffect, useState} from 'react';
import {audioEcosystem} from '../contexts/AudioContext';

const useInitialBufferLoad = (path: string) => {
  const [buffer, setBuffer] = useState<AudioBuffer>();

  useEffect(() => {
    audioEcosystem.loadAudioFile(path).then(af => setBuffer(af));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return buffer;
};

export default useInitialBufferLoad;
