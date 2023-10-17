import {useContext, useRef} from 'react';
import Select from 'react-select';
import {customStylesMaxContent} from '../../../../constants/reactSelectStyles';
import S from './String.module.css';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '../../../../contexts/NoteGeneratorTuningContext';
import TuningBoard from './TuningBoard';
import {TuningOptionWithButton} from '../../../common/SelectWithButton';
import {convertStateToTuning} from '../../../../constants/notes';
import FretModifier from './FretModifier';
import TuningSaver from './TuningSaver';
import useTranslation from '../../../../hooks/useTranslation';

enum AddStringMessages {
  Upper = 'Add Upper string',
  Lower = 'Add Lower string',
}

const StringNoteRange = () => {
  const {tuning, tunings, setTuning, addString} = useContext(
    NoteGeneratorTuningContext,
  ) as NoteGeneratorTuningProps;

  const boardRef = useRef<HTMLDivElement>(null);

  const [tuningString, addLowerString, addUpperString] = useTranslation([
    'Tuning',
    'Add Lower String',
    'Add Upper String',
  ]);

  const addStringHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.currentTarget.title === AddStringMessages.Upper) {
      addString(true);
      setTimeout(() => boardRef.current?.scrollTo({top: 0, behavior: 'smooth'}));
    } else if (e.currentTarget.title === AddStringMessages.Lower) {
      addString(false);
      setTimeout(() =>
        boardRef.current?.scrollTo({
          top: boardRef.current?.scrollHeight,
          behavior: 'smooth',
        }),
      );
    }
  };

  return (
    <div className={S.stringSection}>
      <Select
        components={{Option: TuningOptionWithButton}}
        isSearchable={false}
        styles={customStylesMaxContent}
        options={tunings}
        // menuIsOpen={true}
        value={convertStateToTuning(tuning)}
        onChange={e => {
          setTuning(tunings.indexOf(e as Tuning));
        }}
        placeholder={tuningString}
      />
      <FretModifier />
      <button title={AddStringMessages.Upper} onClick={addStringHandler}>
        {addUpperString}
      </button>
      <TuningBoard ref={boardRef} />
      <button title={AddStringMessages.Lower} onClick={addStringHandler}>
        {addLowerString}
      </button>
      <TuningSaver />
    </div>
  );
};

export default StringNoteRange;
