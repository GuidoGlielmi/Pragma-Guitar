import {useContext} from 'react';
import {Props} from 'react-select';
import Select, {GroupBase} from 'react-select';
import {OptionWithNoteWithOctave} from '../OptionWithNoteWithOctave';
import SingleValueWithNoteWithOctave from '../SingleValueWithNoteWithOctave';
import {customStyles} from '../../../../constants/reactSelectStyles';
import {strings} from '../../../../constants/notes';
import {LanguageContext, LanguageProps} from '../../../../contexts/LanguageContext';

function NoteWithOctaveSelect(
  props: Omit<
    Props<GtrString, false, GroupBase<GtrString>>,
    'components' | 'getOptionLabel' | 'options' | 'styles'
  >,
) {
  const {eng} = useContext(LanguageContext) as LanguageProps;

  return (
    <Select
      {...props}
      components={{
        Option: OptionWithNoteWithOctave,
        SingleValue: SingleValueWithNoteWithOctave,
      }}
      getOptionLabel={o => (eng ? o.label : o.labelEs)}
      isSearchable={props.isSearchable ?? false}
      styles={customStyles}
      options={strings}
    />
  );
}

export default NoteWithOctaveSelect;
