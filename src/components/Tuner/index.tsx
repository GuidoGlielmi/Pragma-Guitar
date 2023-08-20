import usePitch from '../../hooks/usePitch';
import './Tuner.css';
import Board from './Board';
const Tuner = () => {
  const {detune, frecuency, pitch} = usePitch();

  return (
    <div className='tunerContainer'>
      <Board frecuency={frecuency} pitch={pitch} detune={detune} />
      <span>{frecuency ? ~~frecuency : frecuency} Hz</span>
    </div>
  );
};

export default Tuner;
