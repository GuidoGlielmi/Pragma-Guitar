import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NodeGeneratorContext';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '@/contexts/NoteGeneratorTuningContext';
import ChevronDown from '@/icons/ChevronDown';
import {useContext} from 'react';

const Buttons = ({id}: {id: number}) => {
  const {changePitchRange} = useContext(NoteGeneratorContext) as NoteGeneratorProps;
  const {selectedStringId, stringModifiedChecker, incrementPitch, decrementPitch, removeString} =
    useContext(NoteGeneratorTuningContext) as NoteGeneratorTuningProps;

  const modifyTuningHandler = (n: number) => {
    if (n > 0) incrementPitch(id);
    else decrementPitch(id);
    if (selected) changePitchRange(ps => [ps[0], ps[1] + n]);
  };

  const selected = id === selectedStringId;

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
