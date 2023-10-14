import {useContext} from 'react';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '../../../../../contexts/NoteGeneratorTuningContext';
import ChevronDown from '../../../../../icons/ChevronDown';
import NoteWithOctave from '../../../../common/NoteWithOctave';
import S from './StringDisplay.module.css';

interface StringDisplayProps {
  height: number;
  pitch: TuningStateValue;
  index: number;
}

const StringDisplay = ({height, pitch, index}: StringDisplayProps) => {
  const {selectedStringIndex, setSelectedStringIndex, changeTuning, removeString} = useContext(
    NoteGeneratorTuningContext,
  ) as NoteGeneratorTuningProps;

  const selected = selectedStringIndex === index;

  return (
    <div className={S.stringContainer}>
      <div>
        <input
          type='checkbox'
          name='string'
          checked={selected}
          onChange={() => {
            setSelectedStringIndex(ps => (ps === index ? null : index));
          }}
        />
        <NoteWithOctave pitch={pitch.value} />
      </div>
      <div
        style={{
          ...(selected && {filter: 'drop-shadow(0 0 7px #999)'}),
        }}
      >
        <div className={S.stringBall} />
        <div className={S.string} style={{height}} />
      </div>
      <div>
        <div>
          <button
            title='Increase semitone'
            className='button'
            style={{
              transform: 'rotateZ(180deg)',
              ...(!!pitch.original && pitch.original < pitch.value && {background: '#ff5151ad'}),
            }}
            onClick={() => changeTuning(1, index)}
          >
            <ChevronDown color='white' />
          </button>
          <button
            title='Decrease semitone'
            style={{
              transform: 'translateY(2px)',
              ...(!!pitch.original && pitch.original > pitch.value && {background: '#ff5151ad'}),
            }}
            className='button'
            onClick={() => changeTuning(-1, index)}
          >
            <ChevronDown color='white' />
          </button>
        </div>
        <button title='Remove string' onClick={() => removeString(index)}>
          X
        </button>
      </div>
    </div>
  );
};

export default StringDisplay;
