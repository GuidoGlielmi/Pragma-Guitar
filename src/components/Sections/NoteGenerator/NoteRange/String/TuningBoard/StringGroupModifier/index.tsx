import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '@/contexts/NoteGeneratorTuningContext';
import ChevronDown from '@/icons/ChevronDown';
import ResetIcon from '@/icons/Reset';
import {useContext} from 'react';
import S from './StringGroupModifier.module.css';

const StringGroupModifier = () => {
  const {reset, modifyPitch} = useContext(NoteGeneratorTuningContext) as NoteGeneratorTuningProps;

  return (
    <div className={S.allStringsButtonsContainer}>
      <button
        className={S.resetButton}
        onClick={reset}
        style={{padding: 0}}
        title='Reset tuning'
        aria-label='Reset tuning'
      >
        <ResetIcon />
      </button>
      <div>
        <button
          aria-label='Increase all strings by a half step'
          title='Increase all strings'
          onClick={() => modifyPitch(true)}
          style={{transform: 'rotateZ(180deg)'}}
        >
          <ChevronDown color='white' />
        </button>
        <button
          aria-label='Decrease all strings by a half step'
          title='Decrease all strings'
          onClick={() => modifyPitch(false)}
          style={{transform: 'translateY(2px)'}}
        >
          <ChevronDown color='white' />
        </button>
      </div>
    </div>
  );
};

export default StringGroupModifier;
