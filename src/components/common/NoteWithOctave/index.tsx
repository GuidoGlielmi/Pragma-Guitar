import {useContext} from 'react';
import S from './NoteWithOctave.module.css';
import {LanguageContext, LanguageProps} from '@/contexts/LanguageContext';

const NoteWithOctave = ({
  pitch,
  withShadow = true,
}: {
  pitch: TPitchToPlay;
  withShadow?: boolean;
}) => {
  const {getNoteWithOctave} = useContext(LanguageContext) as LanguageProps;

  const [note, octave] = getNoteWithOctave(pitch);

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
