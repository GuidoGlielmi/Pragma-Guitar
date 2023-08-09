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

import './AudioContext.css';
import ChevronDown from '../../icons/ChevronDown';

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
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [showDevices, setShowDevices] = useState(false);
  useEffect(() => {
    (async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setDevices(devices);
      navigator.mediaDevices.ondevicechange = async function () {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setDevices(devices);
      };
    })();
  }, []);

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

  return (
    <AudioContext.Provider value={contextValue}>
      <div className='devicesContainer'>
        <div>
          <span>Devices</span>
          <button onClick={() => setShowDevices(ps => !ps)}>
            <ChevronDown />
          </button>
        </div>
        {showDevices &&
          devices
            .filter(d => d.kind === 'audioinput')
            .map(d => (
              <div key={d.deviceId}>
                {formatMediaKind(d.kind)} - {d.label}
              </div>
            ))}
      </div>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;

const formatMediaKind = (media: string) => {
  const [, type, direction] = media.match(/(\w+)(input|output)/i) as Device;
  return `${type[0].toUpperCase()}${type.slice(1)} ${direction[0].toUpperCase()}${direction.slice(
    1,
  )}`;
};
