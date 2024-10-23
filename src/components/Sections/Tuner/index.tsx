import usePitchWithValue from '@/hooks/usePitchWithValue';
import Board from './Board';
import './Tuner.css';
import {closestPitchFromFrequency, centsOffFromPitch} from '@/helpers/pitch';

const Tuner = () => {
  const frecuency = usePitchWithValue();

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
