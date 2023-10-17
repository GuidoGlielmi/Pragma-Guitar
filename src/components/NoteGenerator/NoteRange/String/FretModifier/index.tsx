import {useContext} from 'react';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '../../../../../contexts/NoteGeneratorTuningContext';

import S from './FretModifier.module.css';
import useTranslation from '../../../../../hooks/useTranslation';

const FretModifier = () => {
  const {fretsAmount, changeFretsAmount} = useContext(
    NoteGeneratorTuningContext,
  ) as NoteGeneratorTuningProps;

  const [fretsString] = useTranslation('Frets');

  return (
    <div className={S.fretsContainer}>
      <h4>{fretsString}</h4>
      <button onClick={() => changeFretsAmount(-1)}>-</button>
      <p>{fretsAmount}</p>
      <button onClick={() => changeFretsAmount(1)}>+</button>
    </div>
  );
};
export default FretModifier;
