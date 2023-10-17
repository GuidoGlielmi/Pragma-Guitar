import {useEffect, useContext} from 'react';
import Select from 'react-select';
import {customStyles} from '../../../../constants/reactSelectStyles';
import {strings} from '../../../../constants/notes';
import {NoteGeneratorContext, NoteGeneratorProps} from '../../../../contexts/NodeGeneratorContext';
import useTranslation from '../../../../hooks/useTranslation';
import {LanguageContext, LanguageProps} from '../../../../contexts/LanguageContext';

const CustomNoteRange = () => {
  const {
    changePitchRange,
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const {eng} = useContext(LanguageContext) as LanguageProps;

  const [fromString, toString] = useTranslation(['From', 'To']);

  useEffect(() => {
    changePitchRange([0, strings.length - 1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div id='customNoteRange' style={{display: 'flex', gap: 10, justifyContent: 'center'}}>
      <div>
        <label htmlFor='from'>{fromString}</label>
        <Select
          id='from'
          isSearchable={false}
          styles={customStyles}
          getOptionLabel={o => (eng ? o.label : o.labelEs)}
          options={strings}
          value={from}
          onChange={e => changePitchRange([e!.value, undefined])} // value is index
        />
      </div>
      <div>
        <label htmlFor='to'>{toString}</label>
        <Select
          id='to'
          isSearchable={false}
          styles={customStyles}
          getOptionLabel={o => (eng ? o.label : o.labelEs)}
          options={strings}
          value={to}
          onChange={e => changePitchRange([undefined, e!.value])} // value is index
        />
      </div>
    </div>
  );
};
export default CustomNoteRange;
