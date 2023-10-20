import {useContext, useState} from 'react';
import ChevronDown from '../../icons/ChevronDown';
import {AudioContext, AudioProps} from '../../contexts/AudioContext';
import S from './DeviceList.module.css';
import Refresh from '../../icons/Refresh';
import useTranslation from '../../hooks/useTranslation';
import OutsideClickCloser from '../common/OutsideClickCloser';

const DeviceList = () => {
  const {
    devices,
    askDevicesInfoPermission,
    setDevicesHandler,
    selectedDeviceId,
    setSelectedDeviceId,
  } = useContext(AudioContext) as AudioProps;

  const [devicesString] = useTranslation('Devices');

  const [devicesShown, setDevicesShown] = useState(false);

  const showDevices = async () => {
    if (devicesShown) return setDevicesShown(false);
    const granted = await askDevicesInfoPermission();
    if (granted) setDevicesShown(true);
  };

  return (
    <OutsideClickCloser
      shown={devicesShown}
      close={() => setDevicesShown(false)}
      id='closeDeviceList'
    >
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
                  setSelectedDeviceId(d.deviceId);
                }}
                key={d.deviceId}
                style={{filter: `invert(${d.deviceId === selectedDeviceId ? 100 : 0}%)`}}
              >
                {d.label}
              </button>
            );
          })}
      </div>
    </OutsideClickCloser>
  );
};

export default DeviceList;
