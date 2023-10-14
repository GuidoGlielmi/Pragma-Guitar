import {useContext} from 'react';
import Select from 'react-select';
import {convertTuningToState, tunings} from '../../../../constants/notes';
import {customStylesMaxContent} from '../../../../constants/reactSelectStyles';
import S from './String.module.css';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '../../../../contexts/NoteGeneratorTuningContext';
import TuningBoard from './TuningBoard';

const StringNoteRange = () => {
  const {tuningIndex, setTuningIndex, setTuning, changeFretsAmount, fretsAmount, addString} =
    useContext(NoteGeneratorTuningContext) as NoteGeneratorTuningProps;

  return (
    <div className={S.stringSection}>
      <Select
        isSearchable={false}
        styles={customStylesMaxContent}
        options={tunings}
        value={tunings[tuningIndex]}
        onChange={e => {
          setTuningIndex(tunings.indexOf(e!));
          setTuning(convertTuningToState(e!));
        }}
      />
      <FretModifier />
      <button title='Add Upper string' onClick={() => addString(true)}>
        Add Upper String
      </button>
      <TuningBoard />
      <button title='Add Lower string' onClick={() => addString(false)}>
        Add Lower String
      </button>
    </div>
  );
};

const FretModifier = () => {
  const {fretsAmount, changeFretsAmount} = useContext(
    NoteGeneratorTuningContext,
  ) as NoteGeneratorTuningProps;
  return (
    <div className={S.fretsContainer}>
      <h4>Frets</h4>
      <button onClick={() => changeFretsAmount(-1)}>-</button>
      <p>{fretsAmount}</p>
      <button onClick={() => changeFretsAmount(1)}>+</button>
    </div>
  );
};

export default StringNoteRange;
