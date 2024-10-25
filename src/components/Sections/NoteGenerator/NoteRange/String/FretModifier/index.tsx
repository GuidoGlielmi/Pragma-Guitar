import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '@/contexts/NoteGeneratorTuningContext';
import {useContext} from 'react';

import useTranslation from '@/hooks/useTranslation';
import S from './FretModifier.module.css';

const FretModifier = () => {
  const {fretsAmount, decrementFretsAmount, incrementFretsAmount} = useContext(
    NoteGeneratorTuningContext,
  ) as NoteGeneratorTuningProps;

  const [fretsString] = useTranslation('frets');

  return (
    <div className={S.fretsContainer}>
      <h4>{fretsString}</h4>
      <button onClick={decrementFretsAmount} aria-label='Increase frets amount by 1'>
        -
      </button>
      <p>{fretsAmount}</p>
      <button onClick={incrementFretsAmount} aria-label='Decrease frets amount by 1'>
        +
      </button>
    </div>
  );
};
export default FretModifier;
