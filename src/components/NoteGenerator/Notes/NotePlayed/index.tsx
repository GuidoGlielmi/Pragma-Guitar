import {NoteGeneratorContext, NoteGeneratorProps} from '../../../../contexts/NodeGeneratorContext';
import {getPitchAndOctave} from '../../../../helpers/pitch';
import {useContext} from 'react';
import './NotePlayed.css';

interface NotePlayedProps {
  pitch: number | null;
  detune: number | null;
}

const MAX_SHADOW_Y_POSITION = 8;

const NotePlayed = ({pitch, detune}: NotePlayedProps) => {
  const {
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const [notePlayed, octavePlayed] = getPitchAndOctave(pitch);

  const computedShadowYPosition = MAX_SHADOW_Y_POSITION * -(((detune || 0) * 2) / 100);
  const textShadow = `0 ${computedShadowYPosition}px 0px #ffffff15`;

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
