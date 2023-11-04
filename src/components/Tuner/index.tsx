import usePitch from '../../hooks/usePitch';
import './Tuner.css';
import Board from './Board';
import {centsOffFromPitch, closestPitchFromFrequency} from '../../libs/Helpers';

const Tuner = () => {
  const frecuency = usePitch();
  const pitch = closestPitchFromFrequency(frecuency);
  const detune = centsOffFromPitch(frecuency, pitch);
  return (
    <div className='tunerContainer'>
      <Board pitch={pitch} detune={detune} />
      <span>{frecuency ? ~~frecuency : null} Hz</span>
    </div>
  );
};

export default Tuner;
