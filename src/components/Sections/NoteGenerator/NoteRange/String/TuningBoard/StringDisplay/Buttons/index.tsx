import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '@/contexts/NoteGeneratorTuningContext';
import ChevronDown from '@/icons/ChevronDown';
import {useContext} from 'react';

const StringButtons = ({id}: {id: number}) => {
  const {stringModifiedChecker, modifyPitch, removeString} = useContext(
    NoteGeneratorTuningContext,
  ) as NoteGeneratorTuningProps;

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
          onClick={() => modifyPitch(true, id)}
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
          onClick={() => modifyPitch(false, id)}
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

export default StringButtons;
