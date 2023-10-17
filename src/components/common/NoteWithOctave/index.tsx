import {useContext} from 'react';
import {pitchToNote} from '../../../helpers/pitch';
import S from './NoteWithOctave.module.css';
import {LanguageContext, LanguageProps} from '../../../contexts/LanguageContext';

const NoteWithOctave = ({pitch}: {pitch: number | null}) => {
  const {eng} = useContext(LanguageContext) as LanguageProps;

  const [note, octave] = pitchToNote(pitch, eng);
  return (
    <p className={S.container}>
      <span>{note}</span>
      <span>{octave}</span>
    </p>
  );
};

export default NoteWithOctave;
