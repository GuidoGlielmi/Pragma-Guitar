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
import {AudioEcosystem} from '../../helpers/AudioEnvironment';
import useChange from '../../hooks/useChange';

export interface AudioProps {
  started: boolean | null;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  notification: boolean;
  setNotification: Dispatch<SetStateAction<boolean>>;
  startOscillator: (frec: number) => void;
  stopOscillator: () => void;
  getMicInputStream: () => Promise<void>;
  devices: MediaDeviceInfo[];
  askDevicesInfoPermission: () => Promise<void>;
  setDevicesHandler: () => void;
  selectedDevice: MediaDeviceInfo | undefined;
  setSelectedDevice: Dispatch<SetStateAction<MediaDeviceInfo | undefined>>;
}

export const audioEcosystem = new AudioEcosystem();

export const AudioContext = createContext<AudioProps | null>(null);

const AudioProvider: FC<PropsWithChildren> = ({children}) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | undefined>(devices[0]);
  const [selectedDeviceChanged, setSelectedDeviceUnchanged] = useChange(selectedDevice);
  const [notification, setNotification] = useState(false);
  const [started, setStarted] = useState<boolean | null>(null);

  useEffect(() => {
    audioEcosystem.onstatechange = function () {
      setStarted(this.state === 'running');
    };
  }, []);

  const askDevicesInfoPermission = async () => {
    if (devices.length > 0) return;
    let permittedDeviceId;
    if (!audioEcosystem.micStream) {
      // navigator.mediaDevices.enumerateDevices() will return an empty label attribute value if the permission for accessing the mediadevice is not given.
      permittedDeviceId = await audioEcosystem.getPermittedDeviceId();
    }
    setDevicesHandler(permittedDeviceId);
  };

  const setDevicesHandler = async (permittedDeviceId = selectedDevice?.deviceId) => {
    const devices = await audioEcosystem.getInputDevices();
    setSelectedDevice(devices.find(d => d.deviceId === permittedDeviceId));
    setDevices(devices);
  };

  const start = async () => {
    await audioEcosystem.resume();
  };

  const stop = async () => {
    await audioEcosystem.suspend();
  };

  const getMicInputStream = async () => {
    if (selectedDeviceChanged) {
      const permittedDeviceId = await audioEcosystem.setMicInputStreamHandler();
      if (devices.length === 0) setDevicesHandler(permittedDeviceId);
      setSelectedDeviceUnchanged();
    }
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
      selectedDevice,
      setSelectedDevice,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [notification, devices, selectedDevice, started],
  );

  return (
    <AudioContext.Provider value={contextValue}>
      {notification && <Notification />}
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;

const Notification = () => {
  return (
    <div
      style={{
        position: 'fixed',
        padding: '10px',
        margin: '10px',
        top: '0',
        left: '0',
        backgroundColor: 'rgb(150, 76, 76)',
        borderRadius: '5px',
      }}
    >
      Please, get closer to the microphone
    </div>
  );
};

// const formatMediaKind = (media: string) => {
//   const [, type, direction] = media.match(/(\w+)(input|output)/i) as Device;
//   return `${type[0].toUpperCase()}${type.slice(1)} ${direction[0].toUpperCase()}${direction.slice(
//     1,
//   )}`;
// };
