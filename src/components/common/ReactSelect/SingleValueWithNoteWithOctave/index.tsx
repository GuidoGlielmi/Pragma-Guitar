import {SingleValueProps, components} from 'react-select';
import NoteWithOctave from '../../NoteWithOctave';

const SingleValueWithNoteWithOctave = (props: SingleValueProps<{value: number}, false>) => {
  return (
    <components.SingleValue {...props}>
      <NoteWithOctave pitch={props.data.value} withShadow={false} />
    </components.SingleValue>
  );
};

export default SingleValueWithNoteWithOctave;
