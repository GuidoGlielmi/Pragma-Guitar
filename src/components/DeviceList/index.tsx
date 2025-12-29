import {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {AudioContext, AudioProps} from '../../contexts/AudioContext';
import ChevronDown from '../../icons/ChevronDown';
import Refresh from '../../icons/Refresh';
import OutsideClickCloser from '../common/OutsideClickCloser';
import S from './DeviceList.module.css';

const DeviceList = () => {
  const {t} = useTranslation('app');
  const {devices, setDevices, selectedDeviceId, setSelectedDeviceId} = useContext(
    AudioContext,
  ) as AudioProps;

  const [devicesShown, setDevicesShown] = useState(false);

  const showDevices = async () => {
    if (devicesShown) return setDevicesShown(false);
    if (devices.length > 0) return setDevicesShown(true);
    const allowed = await setDevices();
    if (allowed) setDevicesShown(true);
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
            <span>{t('devices')}</span>
            <button onClick={setDevices}>
              <Refresh />
            </button>
          </div>
          <button onClick={showDevices}>
            <ChevronDown />
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
