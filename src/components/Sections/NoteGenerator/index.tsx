import {useContext, useEffect, useCallback} from 'react';
import {AnimatePresence} from 'framer-motion';
import {AudioContext, AudioProps, audioEcosystem} from '@/contexts/AudioContext';
import useCorrectPitch from '@/hooks/useCorrectPitch';
import RangeSelector from './NoteRange';
import Notes from './Notes';
import useInitialBufferLoad from '@/hooks/useInitialBufferLoad';
import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NodeGeneratorContext';
import Timer from './Timer';
import './NoteGenerator.css';
import useTranslation from '@/hooks/useTranslation';
import useStreak from '@/hooks/useStreak';
import {areSameNote} from '@/libs/Helpers';
import useLocalStorage from '@/hooks/useLocalStorage';

const MAX_ACCEPTABLE_DETUNE = 15;

const NoteGenerator = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pitchToPlay, from, to, countdownInitialValue],
  );

  const {correct, frecuency} = useCorrectPitch({condition});

  const [currStreak, setCurrStreak] = useStreak(correct);
  const [maxStreaks, setMaxStreaks] = useLocalStorage<number[]>('maxStreaks', {initialValue: []});

  const [bestStreakString] = useTranslation(['bestStreak']);

  useEffect(() => {
    setMaxStreaks(ps => {
      const newStreaks = [...ps];
      newStreaks[countdownInitialValue - 1] = Math.max(
        ps[countdownInitialValue - 1] || 0,
        currStreak,
      );
      return newStreaks;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currStreak]);

  useEffect(() => {
    setCurrStreak(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdownInitialValue]);

  useEffect(() => {
    if (!correct) setCurrStreak(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition]);

  useEffect(() => {
    if (correct && !!correctNoteAudio) audioEcosystem.playBuffer(correctNoteAudio);
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
        {bestStreakString}: {maxStreaks[countdownInitialValue - 1] || 0}
      </div>
    </div>
  );
};

export default NoteGenerator;
