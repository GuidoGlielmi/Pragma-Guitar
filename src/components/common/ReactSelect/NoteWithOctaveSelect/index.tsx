import {MAX_PITCH_INDEX} from '@/constants';
import {customStyles} from '@/constants/reactSelectStyles';
import Select, {GroupBase, Props} from 'react-select';
import {OptionWithNoteWithOctave} from '../OptionWithNoteWithOctave';
import SingleValueWithNoteWithOctave from '../SingleValueWithNoteWithOctave';

const pitches = Array(MAX_PITCH_INDEX + 1)
  .fill(null)
  .map((_, i) => ({value: i}));

function NoteWithOctaveSelect({
  value,
  ...props
}: Omit<
  Props<{value: number}, false, GroupBase<{value: number}>>,
  'components' | 'getOptionLabel' | 'options' | 'styles' | 'value'
> & {value: number}) {
  return (
    <Select
      {...props}
      value={pitches.find(p => p.value === value)} //
      aria-label='Note selector'
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
