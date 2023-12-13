/* eslint-disable react-refresh/only-export-components */
import {
  useContext,
  createContext,
  useMemo,
  useState,
  FC,
  PropsWithChildren,
  useEffect,
} from 'react';
import {AudioEcosystem} from '../../helpers/AudioEcosystem';
import {ToastContext, ToastProps} from '../ToastContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import useTranslation from '@/hooks/useTranslation';

export interface AudioProps {
  started: boolean | null;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  startOscillator: (frec: number) => void;
  stopOscillator: () => void;
  startMic: () => Promise<boolean>;
  stopMic: () => void;
  devices: MediaDeviceInfo[];
  setDevices: () => Promise<boolean>;
  selectedDeviceId: string | undefined;
  setSelectedDeviceId: (deviceId: string) => Promise<boolean>;
}

const DEFAULT_DEVICE_ID_STORAGE_KEY = 'defaultDeviceId';

export const audioEcosystem = new AudioEcosystem();

export const AudioContext = createContext<AudioProps | null>(null);

const AudioProvider: FC<PropsWithChildren> = ({children}) => {
  const {setToastOptions, close} = useContext(ToastContext) as ToastProps;

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useLocalStorage(
    DEFAULT_DEVICE_ID_STORAGE_KEY,
    '',
  );

  const [microphoneAccessString] = useTranslation(['microphoneAccess']);

  const [started, setStarted] = useState<boolean | null>(null);

  useEffect(() => {
    audioEcosystem.onstatechange = function () {
      setStarted(this.state === 'running');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = async () => {
    await audioEcosystem.resume();
  };

  const stop = async () => {
    await audioEcosystem.suspend();
  };

  const askDevicePermission = async (requestedDeviceId?: string) => {
    try {
      const authorizedDevice = await audioEcosystem.getMicInputStream(requestedDeviceId);
      close((message: string) => message === microphoneAccessString);

      const authorizedDeviceId = audioEcosystem.getDeviceId(authorizedDevice);
      if (!authorizedDeviceId) throw new Error();
      setSelectedDeviceId(authorizedDeviceId);

      return authorizedDevice;
    } catch (err: any) {
      if (err?.name === 'NotAllowedError') {
        setToastOptions({message: microphoneAccessString, duration: -1});
      }
      throw err;
    }
  };

  const setSelectedDeviceIdHandler = async (requestedDeviceId: string) => {
    return askDevicePermission(requestedDeviceId)
      .then(() => true)
      .catch(() => false);
  };

  const setDevicesHandler = async () => {
    // navigator.mediaDevices.enumerateDevices() will return an empty label attribute value if the permission for accessing the mediadevice is not given.
    const allowed = await setSelectedDeviceIdHandler(selectedDeviceId);
    if (!allowed) return false;
    setDevices(await audioEcosystem.getInputDevices());
    return true;
  };

  const startMic = async () => {
    return audioEcosystem
      .startMic(selectedDeviceId)
      .then(authorizedDeviceId => {
        setSelectedDeviceId(authorizedDeviceId || '');
        return true;
      })
      .catch(() => false);
  };

  const stopMic = async () => {
    audioEcosystem.pauseMic();
  };

  const startOscillator = (frec: number) => audioEcosystem.setOscillatorFrecuency(frec);
  const stopOscillator = () => audioEcosystem.setOscillatorFrecuency(0);

  const contextValue = useMemo(
    () => ({
      started,
      start,
      stop,
      startOscillator,
      stopOscillator,
      startMic,
      stopMic,
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
