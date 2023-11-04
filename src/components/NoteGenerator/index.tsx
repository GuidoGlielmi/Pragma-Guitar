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
import useMaxValue from '../../hooks/useMaxValue';
import {areSameNote} from '../../libs/Helpers';

const MAX_ACCEPTABLE_DETUNE = 15;

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
    countdownInitialValue,
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const correctNoteAudio = useInitialBufferLoad('/audio/correct.mp3');

  const condition = useCallback(
    (pitch: number, detune: number) => {
      if (detune > MAX_ACCEPTABLE_DETUNE || pitchToPlay === null) return false;
      return from !== null && to !== null ? pitch === pitchToPlay : areSameNote(pitch, pitchToPlay);
    },
    [pitchToPlay, from, to],
  );

  const {correct, frecuency} = useCorrectPitch({condition});

  const [currStreak, setCurrStreak] = useStreak(correct);
  const maxStreak = useMaxValue(currStreak, `maxStreakFor${countdownInitialValue}Seconds`);

  const [bestStreakString] = useTranslation(['Best Streak']);

  useEffect(() => {
    if (!correct) setCurrStreak(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition]);

  useEffect(() => {
    if (correct && correctNoteAudio.current) audioEcosystem.playBuffer(correctNoteAudio.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correct]);

  return (
    <div className='noteContainer sectionBorder'>
      <RangeSelector />
      <Timer />
      <AnimatePresence>
        {started && <Notes frecuency={frecuency} correct={correct} currStreak={currStreak} />}
      </AnimatePresence>
      <div className='painterFont'>
        {bestStreakString}: {maxStreak}
      </div>
    </div>
  );
};

export default NoteGenerator;
