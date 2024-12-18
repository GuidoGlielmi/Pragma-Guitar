/* eslint-disable react-refresh/only-export-components */
import {DEFAULT_DEVICE_ID_STORAGE_KEY} from '@/constants';
import {MicObservable} from '@/helpers/MicObservable';
import {Section} from '@/routes';
import {FC, PropsWithChildren, createContext, useContext, useMemo, useState} from 'react';
import {AudioEcosystem} from '../helpers/AudioEcosystem';
import useLocalStorageWithValue from '../hooks/useLocalStorageWithValue';
import {ToastContext, ToastProps} from './ToastContext';

export interface AudioProps {
  started: Section | null;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  startOscillator: (frec: number) => void;
  stopOscillator: () => void;
  /**
   * @param observer callback to get the frecuency and amplitude recorded
   */
  startMic: (observer: TObserver<GetPitchReturnType>) => Promise<boolean>;
  stopMic: () => void;
  subscribeMicListener: (observer: TObserver<GetPitchReturnType>) => void;
  devices: MediaDeviceInfo[];
  setDevices: () => Promise<boolean>;
  selectedDeviceId: string | undefined;
  setSelectedDeviceId: (deviceId: string) => Promise<boolean>;
}

const microphoneAccessMessage = 'microphoneAccess';

export const audioEcosystem = new AudioEcosystem();
const micObservable = new MicObservable(audioEcosystem);

export const AudioContext = createContext<AudioProps | null>(null);

const AudioProvider: FC<PropsWithChildren> = ({children}) => {
  const {setToastOptions, close} = useContext(ToastContext) as ToastProps;

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useLocalStorageWithValue(
    DEFAULT_DEVICE_ID_STORAGE_KEY,
    {
      initialValue: '',
    },
  );
  const [started, setStarted] = useState<Section | null>(null);

  const start = async () => {
    await audioEcosystem.resume();
    setStarted(window.location.pathname as Section);
  };

  const stop = async () => {
    await audioEcosystem.suspend();
    setStarted(null);
    if (!started) micObservable.stop();
  };

  const askDevicePermission = async (requestedDeviceId: string) => {
    try {
      const authorizedDevice = await audioEcosystem.getMicInputStream(requestedDeviceId);
      close((message: string) => message === microphoneAccessMessage);

      const authorizedDeviceId = audioEcosystem.getDeviceId(authorizedDevice);
      setSelectedDeviceId(authorizedDeviceId ?? requestedDeviceId);
    } catch (err: any) {
      if (err?.name === 'NotAllowedError') {
        setToastOptions({
          message: microphoneAccessMessage,
          duration: audioEcosystem.areStreamsEmpty ? 5000 : -1,
        });
      }
      throw err;
    }
  };

  const setSelectedDeviceIdHandler = async (requestedDeviceId: string) => {
    return askDevicePermission(requestedDeviceId)
      .then(() => {
        audioEcosystem.stopMic();
        return true;
      })
      .catch(() => false);
  };

  const setDevicesHandler = async () => {
    try {
      await askDevicePermission(selectedDeviceId);
      setDevices(await audioEcosystem.getInputDevices());
      audioEcosystem.stopMic();
      return true;
    } catch (err: any) {
      return false;
    }
  };

  const startMic = async (listener: TObserver<GetPitchReturnType>) => {
    if (!started) return false;
    try {
      await askDevicePermission(selectedDeviceId);
      await audioEcosystem.startMic();
      micObservable.subscribe(listener);
      micObservable.start();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const startOscillator = (frec: number) => audioEcosystem.setOscillatorFrecuency(frec);
  const stopOscillator = () => audioEcosystem.setOscillatorFrecuency(0);
  const subscribeMicListener = (listener: TObserver<GetPitchReturnType>) => {
    micObservable.subscribe(listener);
  };
  const contextValue = useMemo(
    () => ({
      started,
      start,
      stop,
      startOscillator,
      stopOscillator,
      startMic,
      stopMic: () => audioEcosystem.stopMic(),
      subscribeMicListener,
      devices,
      setDevices: setDevicesHandler,
      selectedDeviceId,
      setSelectedDeviceId: setSelectedDeviceIdHandler,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [devices, selectedDeviceId, started],
  );

  return <AudioContext.Provider value={contextValue}>{children}</AudioContext.Provider>;
};

export default AudioProvider;

// const formatMediaKind = (media: string) => {
//   const [, type, direction] = media.match(/(\w+)(input|output)/i) as Device;
//   return `${type[0].toUpperCase()}${type.slice(1)} ${direction[0].toUpperCase()}${direction.slice(
//     1,
//   )}`;
// };
