import {useContext} from 'react';
import NoteWithOctave from '../../../common/NoteWithOctave';
import {NoteGeneratorContext, NoteGeneratorProps} from '../../../../contexts/NodeGeneratorContext';
import {MAX_PITCH_INDEX} from '../../../../constants/notes';

const NoteRangeToPlay = () => {
  const {
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  return (
    <div className='rangeToPlayContainer'>
      <NoteWithOctave pitch={from ?? 0} /> - <NoteWithOctave pitch={to ?? MAX_PITCH_INDEX} />
    </div>
  );
};

export default NoteRangeToPlay;
