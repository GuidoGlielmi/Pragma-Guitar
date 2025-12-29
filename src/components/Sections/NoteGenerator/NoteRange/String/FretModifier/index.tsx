import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '@/contexts/NoteGeneratorTuningContext';
import {useContext} from 'react';

import {useTranslation} from 'react-i18next';
import S from './FretModifier.module.css';

const FretModifier = () => {
  const {fretsAmount, decrementFretsAmount, incrementFretsAmount} = useContext(
    NoteGeneratorTuningContext,
  ) as NoteGeneratorTuningProps;

  const {t} = useTranslation('app');

  return (
    <div className={S.fretsContainer}>
      <h4>{t('frets')}</h4>
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
