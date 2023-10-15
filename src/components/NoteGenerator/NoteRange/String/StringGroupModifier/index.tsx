import {useContext} from 'react';
import {tunings} from '../../../../../constants/notes';
import ChevronDown from '../../../../../icons/ChevronDown';
import Reset from '../../../../../icons/Reset';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '../../../../../contexts/NoteGeneratorTuningContext';
import S from './StringGroupModifier.module.css';

const StringGroupModifier = () => {
  const {tuning, setTuning, modifyTuning} = useContext(
    NoteGeneratorTuningContext,
  ) as NoteGeneratorTuningProps;

  return (
    <div className={S.allStringsButtonsContainer}>
      <button
        className={S.resetButton}
        onClick={() => {
          setTuning(tunings.indexOf(tuning));
        }}
        style={{padding: 0}}
        title='Reset tuning'
      >
        <Reset />
      </button>
      <div>
        <button
          title='Increase all strings'
          onClick={() => modifyTuning(1)}
          style={{transform: 'rotateZ(180deg)'}}
        >
          <ChevronDown color='white' />
        </button>
        <button
          title='Decrease all strings'
          onClick={() => modifyTuning(-1)}
          style={{transform: 'translateY(2px)'}}
        >
          <ChevronDown color='white' />
        </button>
      </div>
    </div>
  );
};

export default StringGroupModifier;
