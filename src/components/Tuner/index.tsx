import usePitch from '../../hooks/usePitch';
import './Tuner.css';
import Board from './Board';

export const Component = () => {
  const {detune, frecuency, pitch} = usePitch();

  return (
    <div className='tunerContainer'>
      <Board frecuency={frecuency} pitch={pitch} detune={detune} />
      <span>{frecuency ? ~~frecuency : null} Hz</span>
    </div>
  );
};

export function ErrorBoundary() {
  return <div />;
}
