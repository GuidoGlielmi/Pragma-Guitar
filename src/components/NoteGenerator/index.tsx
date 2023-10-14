import {useContext, useEffect, useCallback} from 'react';
import {AnimatePresence} from 'framer-motion';
import {AudioContext, AudioProps, audioEcosystem} from '../../contexts/AudioContext';
import './NoteGenerator.css';
import {strings} from '../../constants/notes';
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

export const Component = () => {
  const {started} = useContext(AudioContext) as AudioProps;

  return (
    <OnboardingWrapper steps={noteGenerator} stepsToUpdate={started ? [13, 14] : undefined}>
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
      if ((from !== null && from !== strings[0]) || (to !== null && to !== strings.at(-1))) {
        if (pitch === pitchToPlay) return true;
      } else {
        if (pitchToPlay && !(Math.abs(pitch - pitchToPlay) % 12)) {
          return true;
        }
      }
      return false;
    },
    [pitchToPlay, from, to],
  );

  const {pitch, correct, currStreak, maxStreak} = useCorrectPitch({condition});

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
          {started && <Notes pitch={pitch} correct={correct} currStreak={currStreak} />}
        </AnimatePresence>
      </div>
      {!!maxStreak && <div>Best streak: {maxStreak}</div>}
    </>
  );
};

export function ErrorBoundary() {
  return <div />;
}

// let ringInterval: number;
// let previousMs = 0;
// const executeAtInterval = (fn: (msPassed: number) => void, delay = 50) => {
//   previousMs = new Date().getTime();
//   ringInterval = setInterval(() => {
//     const currentMs = new Date().getTime();
//     const msPassed = currentMs - previousMs;
//     previousMs = currentMs;
//     fn(msPassed);
//   }, delay);
// };
