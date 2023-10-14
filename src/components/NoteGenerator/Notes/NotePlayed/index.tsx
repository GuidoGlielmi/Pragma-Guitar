import {NoteGeneratorContext, NoteGeneratorProps} from '../../../../contexts/NodeGeneratorContext';
import {getPitchAndOctave} from '../../../../helpers/pitch';
import {useContext} from 'react';
import './NotePlayed.css';

interface NotePlayedProps {
  pitch: number | null;
}

const NotePlayed = ({pitch}: NotePlayedProps) => {
  const {
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const anyOctave = from === null && to === null;

  const [notePlayed, octavePlayed] = getPitchAndOctave(pitch);
  return (
    <div className='notePlayedContainer'>
      <span>You Played</span>
      <p>
        <span className={`octave${anyOctave ? ' transparent' : ''}`}>{octavePlayed}</span>
        {notePlayed}
      </p>
    </div>
  );
};
export default NotePlayed;
