import {getDetunePercent} from '../../libs/Helpers';
import usePitch from '../../hooks/usePitch';
import './Tuner.css';
import {pitchToNote, getOctave} from '../../helpers/pitch';
const Tuner = () => {
  const {detune, frecuency, pitch} = usePitch();

  return (
    <div className='tunerContainer'>
      <div className=''>
        <div className='detuneBar'>
          <NoteWithOctave pitch={pitch === null ? null : pitch - 1} />
          <NoteWithOctave pitch={pitch === null ? null : pitch} />
          <NoteWithOctave pitch={pitch === null ? null : pitch + 1} />
          <div className='middleBar' />
          <div
            className='detuneLeft'
            style={{
              width: (detune !== null && detune < 0 ? getDetunePercent(detune) : '50') + '%',
            }}
          />
          <div
            className='detuneRight'
            style={{
              width: (detune !== null && detune > 0 ? getDetunePercent(detune) : '50') + '%',
            }}
          />
        </div>
        <div>
          <span>{frecuency} Hz</span>
        </div>
      </div>
    </div>
  );
};

const NoteWithOctave = ({pitch}: {pitch: number | null}) => {
  return (
    <p>
      <span>{pitchToNote(pitch)}</span>
      <span>{getOctave(pitch)}</span>
    </p>
  );
};

export default Tuner;
