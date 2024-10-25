import {AudioContext, AudioProps} from '@/contexts/AudioContext';
import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NoteGeneratorContext';
import useTranslation from '@/hooks/useTranslation';
import {AnimatePresence} from 'framer-motion';
import {useContext} from 'react';
import './NoteGenerator.css';
import RangeSelector from './NoteRange';
import Notes from './Notes';
import Timer from './Timer';

const NoteGenerator = () => {
  const {started} = useContext(AudioContext) as AudioProps;
  const {maxStreaks, countdownInitialValue} = useContext(
    NoteGeneratorContext,
  ) as NoteGeneratorProps;

  const [bestStreakString] = useTranslation('bestStreak');

  return (
    <div className='noteContainer sectionBorder'>
      <RangeSelector />
      <Timer />
      <AnimatePresence>{started && <Notes />}</AnimatePresence>
      <div className='painterFont'>
        {bestStreakString}: {maxStreaks[countdownInitialValue - 1] || 0}
      </div>
    </div>
  );
};

export default NoteGenerator;
