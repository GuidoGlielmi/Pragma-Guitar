import {useContext} from 'react';
import NoteWithOctave from '../../../common/NoteWithOctave';
import {NoteGeneratorContext, NoteGeneratorProps} from '../../../../contexts/NodeGeneratorContext';
import {strings} from '../../../../constants/notes';

const NoteRangeToPlay = () => {
  const {
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  return (
    <div className='rangeToPlayContainer'>
      <NoteWithOctave pitch={from?.value! ?? strings[0].value} />
      <NoteWithOctave pitch={to?.value! ?? strings.at(-1)!.value} />
    </div>
  );
};

export default NoteRangeToPlay;
