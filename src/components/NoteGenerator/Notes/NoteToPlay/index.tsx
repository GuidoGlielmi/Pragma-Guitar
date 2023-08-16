import {AudioContext, AudioProps} from '../../../../contexts/AudioContext';
import {
  getFrecuencyFromPitch,
  getMiddleOctavePitch,
  getPitchAndOctave,
} from '../../../../helpers/pitch';
import {useContext} from 'react';
import './NoteToPlay.css';

interface NoteToPlayProps {
  anyOctave: boolean;
  pitchToPlay: number | null;
}

const NoteToPlay = ({anyOctave, pitchToPlay}: NoteToPlayProps) => {
  const {startOscillator, stopOscillator} = useContext(AudioContext) as AudioProps;

  const [noteToPlay, octaveToPlay] = getPitchAndOctave(pitchToPlay);

  return (
    <button
      title='Press to listen'
      className='noteToPlay button'
      onMouseDown={() => {
        const pitch = anyOctave ? getMiddleOctavePitch(pitchToPlay || 0) : pitchToPlay || 0;
        startOscillator(getFrecuencyFromPitch(pitch));
      }}
      onTouchStart={() => {
        const pitch = anyOctave ? getMiddleOctavePitch(pitchToPlay || 0) : pitchToPlay || 0;
        startOscillator(getFrecuencyFromPitch(pitch));
      }}
      onMouseUp={() => stopOscillator()}
      onTouchEnd={() => stopOscillator()}
    >
      <span>Play</span>
      <p style={{...(!anyOctave && {transform: 'translateX(-0.15em)'})}}>
        <span className={`octave${anyOctave ? ' transparent' : ''}`}>{octaveToPlay}</span>
        <span>{noteToPlay}</span>
      </p>
    </button>
  );
};
export default NoteToPlay;
