import {
  createContext,
  useMemo,
  useState,
  FC,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';

export interface AudioProps {
  setAudio: Dispatch<SetStateAction<AudioContext>>;
  audio: AudioContext;
  analyser: AnalyserNode;
  started: boolean;
  start: () => void;
  stop: () => void;
  decodeAudioData: (audioData: ArrayBuffer) => Promise<AudioBuffer>;
}
const audioCtx = new window.AudioContext();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;

type AudioProviderProps = {children: React.ReactNode};

export const AudioContext = createContext<AudioProps | null>(null);
const AudioProvider: FC<PropsWithChildren<AudioProviderProps>> = ({children}) => {
  const [audio, setAudio] = useState(audioCtx);
  const [source, setSource] = useState<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    if (source !== null) {
      source.connect(analyser);
    }
  }, [source]);

  const getMicInput = () => {
    return navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        autoGainControl: false,
        noiseSuppression: false,
        // latency: 0,
      },
    });
  };

  const start = async () => {
    console.log('getting mic source');
    const input = await getMicInput();

    if (audio.state === 'suspended') {
      await audio.resume();
    }
    setSource(audio.createMediaStreamSource(input));
  };

  const stop = () => {
    console.log('disconnecting mic');
    if (source !== null) source.disconnect(analyser);
    setSource(null);
  };

  const decodeAudioData = async (audioData: ArrayBuffer) => {
    const decodedData = await audioCtx.decodeAudioData(audioData);
    return decodedData;
  };

  const contextValue = useMemo(
    () => ({
      setAudio,
      audio,
      analyser,
      decodeAudioData,
      started: !!source,
      start,
      stop,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [audio, source],
  );
  return <AudioContext.Provider value={contextValue}>{children}</AudioContext.Provider>;
};

export default AudioProvider;
