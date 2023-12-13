import {useContext} from 'react';
import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NodeGeneratorContext';
import {MAX_PITCH_INDEX} from '@/constants/notes';
import Note from './Note';

const NoteRangeToPlay = ({canWheel}: {canWheel?: boolean}) => {
  const {
    changePitchRange,
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  return (
    <div className='rangeToPlayContainer'>
      <div
        // like a x-axis spinning wheel, when scrolling in a certain direction, the value goes in the other
        onWheel={e => canWheel && changePitchRange(ps => [ps[0] + (e.deltaY > 0 ? 1 : -1), ps[1]])}
      >
        <Note pitch={from ?? 0} />
      </div>
      -
      <div
        onWheel={e => canWheel && changePitchRange(ps => [ps[0], ps[1] + (e.deltaY > 0 ? 1 : -1)])}
      >
        <Note pitch={to ?? MAX_PITCH_INDEX} />
      </div>
    </div>
  );
};

export default NoteRangeToPlay;
