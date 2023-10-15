import {useContext} from 'react';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '../../../../../contexts/NoteGeneratorTuningContext';
import ChevronDown from '../../../../../icons/ChevronDown';
import NoteWithOctave from '../../../../common/NoteWithOctave';
import S from './StringDisplay.module.css';
import {
  NoteGeneratorContext,
  NoteGeneratorProps,
} from '../../../../../contexts/NodeGeneratorContext';

interface StringDisplayProps {
  height: number;
  pitch: number;
  index: number;
  selected: boolean;
  select: (i: number) => void;
}

const StringDisplay = ({height, pitch, index, selected, select}: StringDisplayProps) => {
  const {changePitchRange} = useContext(NoteGeneratorContext) as NoteGeneratorProps;
  const {stringModifiedChecker, modifyTuning, removeString} = useContext(
    NoteGeneratorTuningContext,
  ) as NoteGeneratorTuningProps;

  const modifyTuningHandler = (n: number) => {
    modifyTuning(n, index);
    if (selected) changePitchRange(ps => [undefined, ps[1]! + n]);
  };

  return (
    <div className={S.stringContainer}>
      <div>
        <input type='radio' name='string' checked={selected} onChange={() => select(index)} />
        <NoteWithOctave pitch={pitch} />
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
              ...(stringModifiedChecker(index) === true && {background: '#ff5151ad'}),
            }}
            onClick={() => modifyTuningHandler(1)}
          >
            <ChevronDown color='white' />
          </button>
          <button
            title='Decrease semitone'
            style={{
              transform: 'translateY(2px)',
              ...(stringModifiedChecker(index) === false && {background: '#ff5151ad'}),
            }}
            className='button'
            onClick={() => modifyTuningHandler(-1)}
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
