import {useContext} from 'react';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '@/contexts/NoteGeneratorTuningContext';

import S from './FretModifier.module.css';
import useTranslation from '@/hooks/useTranslation';

const FretModifier = () => {
  const {fretsAmount, decrementFretsAmount, incrementFretsAmount} = useContext(
    NoteGeneratorTuningContext,
  ) as NoteGeneratorTuningProps;

  const [fretsString] = useTranslation('Frets');

  return (
    <div className={S.fretsContainer}>
      <h4>{fretsString}</h4>
      <button onClick={decrementFretsAmount}>-</button>
      <p>{fretsAmount}</p>
      <button onClick={incrementFretsAmount}>+</button>
    </div>
  );
};
export default FretModifier;
