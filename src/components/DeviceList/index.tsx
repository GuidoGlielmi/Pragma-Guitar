import {useContext, useState} from 'react';
import ChevronDown from '../../icons/ChevronDown';
import {AudioContext, AudioProps} from '../../contexts/AudioContext';
import S from './DeviceList.module.css';
import Refresh from '../../icons/Refresh';
import useTranslation from '../../hooks/useTranslation';

const DeviceList = () => {
  const {devices, askDevicesInfoPermission, setDevicesHandler, selectedDevice, setSelectedDevice} =
    useContext(AudioContext) as AudioProps;

  const [devicesString] = useTranslation('Devices');

  const [devicesShown, setDevicesShown] = useState(false);

  const showDevices = async () => {
    if (devicesShown) return setDevicesShown(false);
    try {
      await askDevicesInfoPermission();
      setDevicesShown(true);
    } catch (err) {
      console.log('error');
    }
  };

  return (
    <div className={S.devicesContainer}>
      <div>
        <div className={S.titleContainer}>
          <span>{devicesString}</span>
          <button onClick={showDevices}>
            <ChevronDown />
          </button>
        </div>
        <button onClick={() => setDevicesHandler()} className={devicesShown ? S.floatRight : ''}>
          <Refresh />
        </button>
      </div>
      {devicesShown &&
        devices.map(d => {
          return (
            <button
              onClick={() => {
                setSelectedDevice(d);
              }}
              key={d.deviceId}
              style={{filter: `invert(${d === selectedDevice ? 100 : 0}%)`}}
            >
              {d.label}
            </button>
          );
        })}
    </div>
  );
};

export default DeviceList;
