import {getPitchAndOctave} from '../../../../helpers/pitch';
import './NotePlayed.css';

interface NotePlayedProps {
  anyOctave: boolean;
  pitch: number | null;
}

const NotePlayed = ({anyOctave, pitch}: NotePlayedProps) => {
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
