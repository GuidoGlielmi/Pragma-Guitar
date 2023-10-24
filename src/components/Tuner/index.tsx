import usePitch from '../../hooks/usePitch';
import './Tuner.css';
import Board from './Board';
import {centsOffFromClosestPitch, pitchFromFrequency} from '../../libs/Helpers';

const Tuner = () => {
  const frecuency = usePitch();
  const pitch = pitchFromFrequency(frecuency);
  const detune = centsOffFromClosestPitch(frecuency);
  return (
    <div className='tunerContainer'>
      <Board pitch={pitch} detune={detune} />
      <span>{frecuency ? ~~frecuency : null} Hz</span>
    </div>
  );
};

export default Tuner;
