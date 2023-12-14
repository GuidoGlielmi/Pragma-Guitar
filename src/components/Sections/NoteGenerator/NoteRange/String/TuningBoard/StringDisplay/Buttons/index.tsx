import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NodeGeneratorContext';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '@/contexts/NoteGeneratorTuningContext';
import ChevronDown from '@/icons/ChevronDown';
import {useContext} from 'react';

interface StringDisplayProps {
  id: number;
  index: number;
  selected: boolean;
}

const Buttons = ({id, index, selected}: StringDisplayProps) => {
  const {changePitchRange} = useContext(NoteGeneratorContext) as NoteGeneratorProps;
  const {stringModifiedChecker, incrementPitch, decrementPitch, removeString} = useContext(
    NoteGeneratorTuningContext,
  ) as NoteGeneratorTuningProps;

  const modifyTuningHandler = (n: number) => {
    if (n > 0) incrementPitch(index);
    else decrementPitch(index);
    if (selected) changePitchRange(ps => [ps[0], ps[1] + n]);
  };

  return (
    <div>
      <div>
        <button
          title='Increase semitone'
          className='button'
          style={{
            transform: 'rotateZ(180deg)',
            ...(stringModifiedChecker(id) === true && {background: '#ff5151ad'}),
          }}
          onClick={() => modifyTuningHandler(1)}
        >
          <ChevronDown color='white' />
        </button>
        <button
          title='Decrease semitone'
          style={{
            transform: 'translateY(2px)',
            ...(stringModifiedChecker(id) === false && {background: '#ff5151ad'}),
          }}
          className='button'
          onClick={() => modifyTuningHandler(-1)}
        >
          <ChevronDown color='white' />
        </button>
      </div>
      <button title='Remove string' onClick={() => removeString(id)}>
        X
      </button>
    </div>
  );
};

export default Buttons;
