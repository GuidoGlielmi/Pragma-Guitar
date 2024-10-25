import {MAX_PITCH_INDEX} from '@/constants';
import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NoteGeneratorContext';
import {useContext} from 'react';
import Note from './Note';

const NoteRangeToPlay = ({canScroll}: {canScroll?: boolean}) => {
  const {
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  return (
    <div className='rangeToPlayContainer'>
      <Note pitch={from ?? 0} canScroll={canScroll} />
      -
      <Note pitch={to ?? MAX_PITCH_INDEX} canScroll={canScroll} />
    </div>
  );
};

export default NoteRangeToPlay;
