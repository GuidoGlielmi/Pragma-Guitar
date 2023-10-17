import {useContext} from 'react';
import {pitchToNote} from '../../../helpers/pitch';
import S from './NoteWithOctave.module.css';
import {LanguageContext, LanguageProps} from '../../../contexts/LanguageContext';

const NoteWithOctave = ({
  pitch,
  withShadow = true,
}: {
  pitch: number | null;
  withShadow?: boolean;
}) => {
  const {eng} = useContext(LanguageContext) as LanguageProps;

  const [note, octave] = pitchToNote(pitch === undefined ? null : pitch, eng);

  return (
    <p
      className={S.container}
      style={{boxShadow: withShadow ? 'text-shadow: 2px 2px 1px #111' : 'none'}}
    >
      <span>{note}</span>
      <span>{octave}</span>
    </p>
  );
};

export default NoteWithOctave;
