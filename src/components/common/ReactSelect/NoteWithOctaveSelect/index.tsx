import {Props} from 'react-select';
import Select, {GroupBase} from 'react-select';
import {OptionWithNoteWithOctave} from '../OptionWithNoteWithOctave';
import SingleValueWithNoteWithOctave from '../SingleValueWithNoteWithOctave';
import {customStyles} from '../../../../constants/reactSelectStyles';
import {MAX_PITCH_INDEX} from '../../../../constants/notes';

const pitches = Array(MAX_PITCH_INDEX + 1)
  .fill(null)
  .map((_, i) => ({value: i}));

function NoteWithOctaveSelect(
  props: Omit<
    Props<{value: number}, false, GroupBase<{value: number}>>,
    'components' | 'getOptionLabel' | 'options' | 'styles'
  >,
) {
  return (
    <Select
      {...props}
      components={{
        Option: OptionWithNoteWithOctave,
        SingleValue: SingleValueWithNoteWithOctave,
      }}
      isSearchable={props.isSearchable ?? false}
      styles={customStyles}
      options={pitches}
    />
  );
}

export default NoteWithOctaveSelect;
