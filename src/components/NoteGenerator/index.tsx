import {useContext, useEffect, useCallback} from 'react';
import {AnimatePresence} from 'framer-motion';
import {AudioContext, AudioProps, audioEcosystem} from '../../contexts/AudioContext';
import OnboardingWrapper from '../OnboardingWrapper';
import {noteGenerator} from '../../constants/steps';
import useCorrectPitch from '../../hooks/useCorrectPitch';
import RangeSelector from './NoteRange';
import Notes from './Notes';
import useInitialBufferLoad from '../../hooks/useInitialBufferLoad';
import NoteGeneratorProvider, {
  NoteGeneratorContext,
  NoteGeneratorProps,
} from '../../contexts/NodeGeneratorContext';
import Timer from './Timer';
import './NoteGenerator.css';
import useTranslation from '../../hooks/useTranslation';
import useStreak from '../../hooks/useStreak';
import {MAX_PITCH_INDEX} from '../../constants/notes';

const NoteGenerator = () => {
  const {started} = useContext(AudioContext) as AudioProps;

  return (
    <OnboardingWrapper steps={noteGenerator} stepsToUpdate={started ? [12, 13] : undefined}>
      <div className='container'>
        <NoteGeneratorProvider>
          <Note />
        </NoteGeneratorProvider>
      </div>
    </OnboardingWrapper>
  );
};

const Note = () => {
  const {started} = useContext(AudioContext) as AudioProps;

  const {
    pitchToPlay,
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const correctNoteAudio = useInitialBufferLoad('/audio/correct.mp3');

  const condition = useCallback(
    (pitch: number) => {
      if ((from !== null && from !== 0) || (to !== null && to !== MAX_PITCH_INDEX)) {
        if (pitch === pitchToPlay) return true;
      } else if (pitchToPlay && !(Math.abs(pitch - pitchToPlay) % 12)) return true;
      return false;
    },
    [pitchToPlay, from, to],
  );

  const {correct, frecuency} = useCorrectPitch({condition});

  const [currStreak, maxStreak] = useStreak(correct, 'maxStreak');

  const [bestStreakString] = useTranslation(['Best Streak']);

  useEffect(() => {
    if (correct && correctNoteAudio.current) audioEcosystem.playBuffer(correctNoteAudio.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correct]);

  return (
    <>
      <div className='noteContainer sectionBorder'>
        <RangeSelector />
        <Timer />
        <AnimatePresence>
          {started && <Notes frecuency={frecuency} correct={correct} currStreak={currStreak} />}
        </AnimatePresence>
      </div>
      {!!maxStreak && (
        <div className='painterFont'>
          {bestStreakString}: {maxStreak}
        </div>
      )}
    </>
  );
};

export default NoteGenerator;
