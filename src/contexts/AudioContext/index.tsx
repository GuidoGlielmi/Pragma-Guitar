/* eslint-disable react-refresh/only-export-components */
import {
  useContext,
  createContext,
  useMemo,
  useState,
  FC,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import {AudioEcosystem} from '../../helpers/AudioEcosystem';
import {NotificationTranslationKeys} from '../../helpers/translations';
import useDebouncedChange from '../../hooks/useDebouncedChange';
import {ToastContext, ToastProps} from '../ToastContext';

export interface AudioProps {
  started: boolean | null;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  notification: NotificationTranslationKeys | '';
  setNotification: Dispatch<SetStateAction<NotificationTranslationKeys | ''>>;
  startOscillator: (frec: number) => void;
  stopOscillator: () => void;
  getMicInputStream: () => Promise<void>;
  devices: MediaDeviceInfo[];
  askDevicesInfoPermission: () => Promise<boolean>;
  setDevicesHandler: () => void;
  selectedDeviceId: string | undefined;
  setSelectedDeviceId: (deviceId: string) => void;
}

const DEFAULT_DEVICE_ID_STORAGE_NAME = 'defaultDeviceId';

export const audioEcosystem = new AudioEcosystem();

export const AudioContext = createContext<AudioProps | null>(null);

const AudioProvider: FC<PropsWithChildren> = ({children}) => {
  const {setMessage} = useContext(ToastContext) as ToastProps;

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(
    localStorage.getItem(DEFAULT_DEVICE_ID_STORAGE_NAME)! || undefined,
  );

  const [notification, setNotification] = useState<NotificationTranslationKeys | ''>('');
  const debouncedNotification = useDebouncedChange(notification, 10_000, {['']: 500});

  const [started, setStarted] = useState<boolean | null>(null);

  useEffect(() => {
    setMessage([debouncedNotification as string, -1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNotification]);

  useEffect(() => {
    audioEcosystem.onstatechange = function () {
      setStarted(this.state === 'running');
      if (this.state !== 'running') setNotification('');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSelectedDeviceIdHandler = async (requestedDeviceId: string) => {
    try {
      const permittedDevice = await audioEcosystem.getMicInputStream(requestedDeviceId);
      const permittedDeviceId = audioEcosystem.getDeviceId(permittedDevice);
      if (permittedDeviceId) setSelectedDeviceId(permittedDeviceId);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    localStorage.setItem(DEFAULT_DEVICE_ID_STORAGE_NAME, selectedDeviceId || '');
  }, [selectedDeviceId]);

  const askDevicesInfoPermission = async () => {
    // navigator.mediaDevices.enumerateDevices() will return an empty label attribute value if the permission for accessing the mediadevice is not given.
    try {
      const permittedDevice = await audioEcosystem.getMicInputStream(selectedDeviceId);
      setDevicesHandler(audioEcosystem.getDeviceId(permittedDevice));
      return true;
    } catch (err) {
      setSelectedDeviceId(undefined);
      return false;
    }
  };

  const setDevicesHandler = async (permittedDeviceId = selectedDeviceId) => {
    const devices = await audioEcosystem.getInputDevices();
    setSelectedDeviceId(permittedDeviceId);
    setDevices(devices);
  };

  const start = async () => {
    await audioEcosystem.resume();
  };

  const stop = async () => {
    await audioEcosystem.suspend();
  };

  const getMicInputStream = async () => {
    const permittedDeviceId = await audioEcosystem.setMicInputStreamHandler(selectedDeviceId);
    setSelectedDeviceId(permittedDeviceId);
    console.log(audioEcosystem.micStream?.getAudioTracks()[0].label);
  };

  const contextValue = useMemo(
    () => ({
      started,
      start,
      stop,
      notification,
      setNotification,
      startOscillator: (frec: number) => audioEcosystem.setOscillatorFrecuency(frec),
      stopOscillator: () => audioEcosystem.setOscillatorFrecuency(0),
      getMicInputStream,
      devices,
      setDevicesHandler,
      askDevicesInfoPermission,
      selectedDeviceId,
      setSelectedDeviceId: setSelectedDeviceIdHandler,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [notification, devices, selectedDeviceId, started],
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
