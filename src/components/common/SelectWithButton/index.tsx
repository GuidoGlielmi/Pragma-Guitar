import {useContext} from 'react';
import {MenuListProps, OptionProps, components} from 'react-select';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '../../../contexts/NoteGeneratorTuningContext';

export const TuningOptionWithButton = (props: OptionProps<Tuning>) => {
  const {deleteTuning} = useContext(NoteGeneratorTuningContext) as NoteGeneratorTuningProps;

  return (
    <components.Option {...props}>
      <div className='flexCentered'>
        {props.children}
        <button className='painterButton' onClick={() => deleteTuning(props.data.label)}>
          X
        </button>
      </div>
    </components.Option>
  );
};
