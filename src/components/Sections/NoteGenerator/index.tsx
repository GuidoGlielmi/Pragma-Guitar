import {AudioContext, AudioProps} from '@/contexts/AudioContext';
import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NoteGeneratorContext';
import {AnimatePresence} from 'framer-motion';
import {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import './NoteGenerator.css';
import RangeSelector from './NoteRange';
import Notes from './Notes';
import Timer from './Timer';

const NoteGenerator = () => {
  const {started} = useContext(AudioContext) as AudioProps;
  const {maxStreaks, countdownInitialValue} = useContext(
    NoteGeneratorContext,
  ) as NoteGeneratorProps;

  const {t} = useTranslation('app');

  return (
    <div className='noteContainer sectionBorder'>
      <RangeSelector />
      <Timer />
      <AnimatePresence>{started && <Notes />}</AnimatePresence>
      <div className='painterFont'>
        {t('bestStreak')}: {maxStreaks[countdownInitialValue - 1] || 0}
      </div>
    </div>
  );
};

export default NoteGenerator;
