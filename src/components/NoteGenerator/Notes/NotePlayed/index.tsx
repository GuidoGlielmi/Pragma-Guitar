import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NodeGeneratorContext';
import {useContext} from 'react';
import './NotePlayed.css';
import {centsOffFromPitch, closestPitchFromFrequency} from '@/libs/Helpers';
import {LanguageContext, LanguageProps} from '@/contexts/LanguageContext';

const MAX_SHADOW_Y_POSITION = 8;

const NotePlayed = ({frecuency}: {frecuency: number | null}) => {
  const {getNoteWithOctave} = useContext(LanguageContext) as LanguageProps;
  const {
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;
  const pitch = closestPitchFromFrequency(frecuency) as number;
  const detune = centsOffFromPitch(frecuency, pitch);
  const [notePlayed, octavePlayed] = getNoteWithOctave(pitch);

  const computedShadowYPosition = MAX_SHADOW_Y_POSITION * -(((detune || 0) * 2) / 100);
  const textShadow = `0 ${computedShadowYPosition}px 0px #ffffff20`;

  const anyOctave = from === null && to === null;

  return (
    <div className='notePlayedContainer'>
      <span>You Played</span>
      <p key={pitch} style={{textShadow}}>
        <span className={`octave${anyOctave ? ' transparent' : ''}`}>{octavePlayed}</span>
        {notePlayed}
      </p>
    </div>
  );
};

export default NotePlayed;
