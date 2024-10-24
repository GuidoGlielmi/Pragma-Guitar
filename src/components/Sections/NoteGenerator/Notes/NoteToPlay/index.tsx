import {AudioContext, AudioProps, audioEcosystem} from '@/contexts/AudioContext';
import {LanguageContext, LanguageProps} from '@/contexts/LanguageContext';
import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NoteGeneratorContext';
import {getFrecuencyFromPitch, getMiddleOctavePitch} from '@/helpers/pitch';
import {useContext} from 'react';
import './NoteToPlay.css';

const NoteToPlay = () => {
  const {getNoteWithOctave} = useContext(LanguageContext) as LanguageProps;
  const {startOscillator, stopOscillator} = useContext(AudioContext) as AudioProps;

  const {
    pitchToPlay,
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const [noteToPlay, octaveToPlay] = getNoteWithOctave(pitchToPlay);

  const anyOctave = from === null && to === null;

  const startOscillatorHandler = () => {
    const pitch = anyOctave ? getMiddleOctavePitch(pitchToPlay || 0) : pitchToPlay || 0;
    audioEcosystem.pauseMic();
    startOscillator(getFrecuencyFromPitch(pitch));
  };

  const stopOscillatorHandler = () => {
    stopOscillator();
    audioEcosystem.startMic();
  };

  return (
    <button
      id='noteToPlay'
      title='Press to listen'
      className='noteToPlay button'
      onMouseDown={startOscillatorHandler}
      onTouchStart={startOscillatorHandler}
      onMouseUp={stopOscillatorHandler}
      onTouchEnd={stopOscillatorHandler}
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
