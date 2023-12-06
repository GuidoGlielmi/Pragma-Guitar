import {useContext} from 'react';
import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NodeGeneratorContext';
import {MAX_PITCH_INDEX} from '@/constants/notes';
import Note from './Note';

const NoteRangeToPlay = () => {
  const {
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  return (
    <div className='rangeToPlayContainer'>
      <div>
        <Note pitch={from ?? 0} />
      </div>
      -
      <div>
        <Note pitch={to ?? MAX_PITCH_INDEX} />
      </div>
    </div>
  );
};

export default NoteRangeToPlay;
