import {useContext} from 'react';
import NoteWithOctave from '../../../common/NoteWithOctave';
import {NoteGeneratorContext, NoteGeneratorProps} from '../../../../contexts/NodeGeneratorContext';

const NoteRangeToPlay = () => {
  const {
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  return (
    <div className='rangeToPlayContainer'>
      <NoteWithOctave pitch={from?.value!} />
      <NoteWithOctave pitch={to?.value!} />
    </div>
  );
};

export default NoteRangeToPlay;
