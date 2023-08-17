import {pitchToNote} from '../../../helpers/pitch';
import S from './NoteWithOctave.module.css';

const NoteWithOctave = ({pitch}: {pitch: number | null}) => {
  const [note, octave] = pitchToNote(pitch);
  return (
    <p className={S.container}>
      <span>{note}</span>
      <span>{octave}</span>
    </p>
  );
};

export default NoteWithOctave;
