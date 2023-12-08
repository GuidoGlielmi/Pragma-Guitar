import {useContext} from 'react';
import {OptionProps, components} from 'react-select';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '@/contexts/NoteGeneratorTuningContext';

export const TuningOptionWithButton = (props: OptionProps<ISelectableTuning, false>) => {
  const {deleteTuning} = useContext(NoteGeneratorTuningContext) as NoteGeneratorTuningProps;

  return (
    <components.Option {...props}>
      <div className='flexCentered'>
        <span>{props.children}</span>
        {props.data.deletable && (
          <button
            style={{background: 'transparent', color: '#222'}}
            className='painterButton'
            onClick={e => {
              e.stopPropagation();
              deleteTuning(props.data.label);
            }}
            title='Delete Tuning'
          >
            X
          </button>
        )}
      </div>
    </components.Option>
  );
};
