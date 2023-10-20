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
import {AudioEcosystem} from '../../helpers/AudioEcosystem';
import {NotificationTranslationKeys} from '../../helpers/translations';
import useChangeDebounce from '../../hooks/useChangeDebounce';

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
  askDevicesInfoPermission: () => Promise<void>;
  setDevicesHandler: () => void;
  selectedDeviceId: string | undefined;
  setSelectedDeviceId: (deviceId: string) => void;
}

const DEFAULT_DEVICE_ID_STORAGE_NAME = 'defaultDeviceId';

export const audioEcosystem = new AudioEcosystem();

export const AudioContext = createContext<AudioProps | null>(null);

const AudioProvider: FC<PropsWithChildren> = ({children}) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(
    localStorage.getItem(DEFAULT_DEVICE_ID_STORAGE_NAME)!,
  );
  const [notification, setNotification] = useState<NotificationTranslationKeys | ''>('');
  const [started, setStarted] = useState<boolean | null>(null);

  useEffect(() => {
    audioEcosystem.onstatechange = function () {
      setStarted(this.state === 'running');
      if (this.state !== 'running') setNotification('');
    };
  }, []);

  const setSelectedDeviceIdHandler = async (requestedDeviceId: string) => {
    try {
      const permittedDevice = await audioEcosystem.getMicInputStream(requestedDeviceId);
      const permittedDeviceId = permittedDevice.getAudioTracks()[0].getSettings().deviceId;
      if (permittedDeviceId) {
        localStorage.setItem(DEFAULT_DEVICE_ID_STORAGE_NAME, permittedDeviceId);
        setSelectedDeviceId(permittedDeviceId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const askDevicesInfoPermission = async () => {
    if (devices.length > 0) return;
    // navigator.mediaDevices.enumerateDevices() will return an empty label attribute value if the permission for accessing the mediadevice is not given.
    const permittedDevice = await audioEcosystem.getMicInputStream(selectedDeviceId);
    setDevicesHandler(permittedDevice?.getAudioTracks()[0].getSettings().deviceId);
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

  return (
    <AudioContext.Provider value={contextValue}>
      {!!notification && <Notification message={notification} />}
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;

const Notification = ({message}: {message: NotificationTranslationKeys}) => {
  const notification = useChangeDebounce<NotificationTranslationKeys | ''>(message, 3000);

  return (
    <div
      style={{
        position: 'fixed',
        padding: '10px',
        margin: '10px',
        bottom: '0',
        left: '0',
        background:
          'linear-gradient(to bottom, rgb(179, 85, 85), rgb(141, 59, 59), rgb(179, 85, 85))',
        borderRadius: '5px',
      }}
    >
      {notification}
    </div>
  );
};

// const formatMediaKind = (media: string) => {
//   const [, type, direction] = media.match(/(\w+)(input|output)/i) as Device;
//   return `${type[0].toUpperCase()}${type.slice(1)} ${direction[0].toUpperCase()}${direction.slice(
//     1,
//   )}`;
// };
