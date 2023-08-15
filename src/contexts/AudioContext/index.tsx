/* eslint-disable react-refresh/only-export-components */
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
  analyserNode: AnalyserNode;
  started: boolean;
  start: () => void;
  stop: () => void;
  decodeAudioData: (audioData: ArrayBuffer) => Promise<AudioBuffer>;
  notification: boolean;
  setNotification: Dispatch<SetStateAction<boolean>>;
  chosenDevice: MediaDeviceInfo;
  startOscillator: (frec: number) => void;
  stopOscillator: () => void;
  playClick: (isFirstBeat: boolean) => Promise<void>;
  getMicInputStream: () => Promise<void>;
}
// the audio context is, among other things, a NODES factory.
// each possible NODE represents a media processor of some kind, for example:
// const gainNode = audioContext.createGain();
// track.connect(gainNode).connect(audioContext.destination);

export const audioCtx = new window.AudioContext(); // starts suspended
const analyserNode = audioCtx.createAnalyser();
analyserNode.fftSize = 2048;
let oscillatorNode: OscillatorNode;
let gainNode: GainNode;

let clickAudioBuffer: AudioBuffer;
let firstClickAudioBuffer: AudioBuffer;

export let clickSourceNode: AudioBufferSourceNode;
export let firstClickSourceNode: AudioBufferSourceNode;

// audio stream NODE to manipulate, the source that gets connected through the context to its destination (the analyser NODE)
export let micInputStream: MediaStream;

// AUDIO STREAM, to get into an AudioContext it must be transformed into a NODE
let micInputNode: MediaStreamAudioSourceNode;

async function loadAudioFile(filePath: string) {
  const response = await fetch(filePath);
  const buffer = await response.arrayBuffer();
  return audioCtx.decodeAudioData(buffer);
}

type AudioProviderProps = {children: React.ReactNode};

export const AudioContext = createContext<AudioProps | null>(null);

const AudioProvider: FC<PropsWithChildren<AudioProviderProps>> = ({children}) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [showDevices, setShowDevices] = useState(false);
  const [notification, setNotification] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    (async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setDevices(devices.filter(d => d.kind === 'audioinput'));
      navigator.mediaDevices.ondevicechange = async function () {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setDevices(ps => [
          ps[0],
          ...devices.filter(d => d.kind === 'audioinput' && d.deviceId !== ps[0].deviceId),
        ]);
      };
    })();
  }, []);

  const start = async () => {
    await audioCtx.resume();
    setStarted(true);
  };

  const stop = () => {
    audioCtx.suspend();
    setStarted(false);
  };

  const setDevice = (device: MediaDeviceInfo) => {
    setDevices(ps => [device, ...ps.filter(d => d.deviceId !== device.deviceId)]);
  };

  const decodeAudioData = async (audioData: ArrayBuffer) => {
    const decodedData = await audioCtx.decodeAudioData(audioData);
    return decodedData;
  };

  const getMicInputStream = async () => {
    micInputStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: devices[0].deviceId || undefined,
        echoCancellation: true,
        autoGainControl: false,
        noiseSuppression: false,
        // latency: 0,
      },
    });
    micInputNode = audioCtx.createMediaStreamSource(micInputStream);
    micInputNode?.connect(analyserNode);
  };

  const setOscillatorFrecuency = async (frecuency: number) => {
    if (frecuency) {
      micInputNode?.disconnect(analyserNode);
      oscilatorOn(frecuency);
    } else {
      oscillatorOff();
      micInputNode?.connect(analyserNode);
    }
  };

  const playClick = async (isFirstBeat: boolean) => {
    if (!firstClickAudioBuffer) {
      firstClickAudioBuffer = await loadAudioFile('/audio/metronome_oct_up.mp3');
    } else {
      firstClickSourceNode?.stop();
      firstClickSourceNode?.disconnect();
    }
    if (!clickAudioBuffer) {
      clickAudioBuffer = await loadAudioFile('/audio/metronome.mp3');
    } else {
      clickSourceNode?.stop();
      clickSourceNode?.disconnect();
    }

    if (isFirstBeat) {
      // creating another node without stopping the other
      // can cause it to resume when the context does
      firstClickSourceNode = audioCtx.createBufferSource();
      firstClickSourceNode.buffer = firstClickAudioBuffer;
      firstClickSourceNode.connect(audioCtx.destination);
      firstClickSourceNode.start();
    } else {
      clickSourceNode = audioCtx.createBufferSource();
      clickSourceNode.buffer = clickAudioBuffer;
      clickSourceNode.connect(audioCtx.destination);
      clickSourceNode.start();
    }
  };

  const contextValue = useMemo(
    () => ({
      analyserNode,
      decodeAudioData,
      started,
      start,
      stop,
      notification,
      setNotification,
      chosenDevice: devices[0],
      startOscillator: (frec: number) => setOscillatorFrecuency(frec),
      stopOscillator: () => setOscillatorFrecuency(0),
      playClick,
      getMicInputStream,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [notification, devices, started, firstClickSourceNode, clickSourceNode],
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
          devices.map(d => (
            <button onClick={() => setDevice(d)} key={d.deviceId}>
              {d.label}
            </button>
          ))}
      </div>
      {notification && <div className='notification'>Please, get closer to the microphone</div>}
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;

const oscilatorOn = (oscFrecuency: number) => {
  oscillatorOff();
  oscillatorNode = audioCtx.createOscillator();
  oscillatorNode.frequency.value = oscFrecuency;

  gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.01;

  const stopTime = audioCtx.currentTime + 0.01;
  gainNode.gain.linearRampToValueAtTime(1, stopTime);

  oscillatorNode.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  // changing a gain node value while live create a pop

  oscillatorNode.start();
};

const oscillatorOff = () => {
  if (!oscillatorNode) return;
  const stopTime = audioCtx.currentTime + 0.1;
  gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.0001, stopTime);
  try {
    oscillatorNode.stop(stopTime);
  } catch (err) {
    console.log(err);
  }
  // when an AudioNode get stopped and no references are left it will disconnect itself and it is thus not needed to explicitly call disconnect() after stop().
};

const formatMediaKind = (media: string) => {
  const [, type, direction] = media.match(/(\w+)(input|output)/i) as Device;
  return `${type[0].toUpperCase()}${type.slice(1)} ${direction[0].toUpperCase()}${direction.slice(
    1,
  )}`;
};
