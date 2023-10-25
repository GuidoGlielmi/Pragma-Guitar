import {useContext} from 'react';
import ChevronDown from '../../../../../icons/ChevronDown';
import Reset from '../../../../../icons/Reset';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '../../../../../contexts/NoteGeneratorTuningContext';
import S from './StringGroupModifier.module.css';

const StringGroupModifier = () => {
  const {reset, incrementPitch, decrementPitch} = useContext(
    NoteGeneratorTuningContext,
  ) as NoteGeneratorTuningProps;

  return (
    <div className={S.allStringsButtonsContainer}>
      <button className={S.resetButton} onClick={reset} style={{padding: 0}} title='Reset tuning'>
        <Reset />
      </button>
      <div>
        <button
          title='Increase all strings'
          onClick={() => incrementPitch()}
          style={{transform: 'rotateZ(180deg)'}}
        >
          <ChevronDown color='white' />
        </button>
        <button
          title='Decrease all strings'
          onClick={() => decrementPitch()}
          style={{transform: 'translateY(2px)'}}
        >
          <ChevronDown color='white' />
        </button>
      </div>
    </div>
  );
};

export default StringGroupModifier;
