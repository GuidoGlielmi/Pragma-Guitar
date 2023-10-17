import {useContext} from 'react';
import {OptionProps, components} from 'react-select';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '../../../contexts/NoteGeneratorTuningContext';

export const TuningOptionWithButton = (props: OptionProps<Tuning>) => {
  const {deleteTuning} = useContext(NoteGeneratorTuningContext) as NoteGeneratorTuningProps;

  return (
    <components.Option {...props}>
      <div className='flexCentered'>
        <span>{props.children}</span>
        <button
          className='painterButton'
          onClick={e => {
            e.stopPropagation();
            deleteTuning(props.data.label);
          }}
        >
          X
        </button>
      </div>
    </components.Option>
  );
};
