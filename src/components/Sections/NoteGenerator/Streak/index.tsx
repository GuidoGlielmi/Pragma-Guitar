import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NoteGeneratorContext';
import Flame from '@/icons/Flame';
import {AnimatePresence, motion} from 'framer-motion';
import {useContext, useEffect, useState} from 'react';
import './Streak.css';

const Streak = () => {
  const {currStreak: multiplier} = useContext(NoteGeneratorContext) as NoteGeneratorProps;
  const [showed, setShowed] = useState(false);

  useEffect(() => {
    setShowed(!!multiplier);
    const timeoutId = setTimeout(() => setShowed(false), 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [multiplier]);

  return (
    <AnimatePresence mode='wait'>
      {showed && (
        <motion.div
          initial={{opacity: 0, y: '50%', x: '0%'}}
          animate={{opacity: 1, y: '50%', x: '0%'}}
          exit={{opacity: 0, y: 0, x: '0%'}}
          transition={{duration: 0.5}}
          className='streak'
        >
          <Flame />
          <span>{multiplier}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default Streak;
