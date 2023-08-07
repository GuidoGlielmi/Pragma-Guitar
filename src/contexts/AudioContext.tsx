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
  const [started, setStarted] = useState(false);
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
    const input = await getMicInput();

    if (audio.state === 'suspended') {
      await audio.resume();
    }
    setStarted(true);
    setSource(audio.createMediaStreamSource(input));
  };

  const stop = () => {
    if (source !== null) source.disconnect(analyser);
    setStarted(false);
  };

  const decodeAudioData = async (audioData: ArrayBuffer) => {
    const decodedData = await audioCtx.decodeAudioData(audioData);
    console.log(decodedData);
    return decodedData;
  };

  const contextValue = useMemo(
    () => ({
      setAudio,
      audio,
      analyser,
      decodeAudioData,
      started,
      start,
      stop,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [audio, started],
  );
  return <AudioContext.Provider value={contextValue}>{children}</AudioContext.Provider>;
};

export default AudioProvider;
