import {OptionProps, components} from 'react-select';
import NoteWithOctave from '../../NoteWithOctave';

export const OptionWithNoteWithOctave = (props: OptionProps<GtrString, false>) => {
  return (
    <components.Option {...props}>
      <NoteWithOctave pitch={props.data.value} withShadow={false} />
    </components.Option>
  );
};
