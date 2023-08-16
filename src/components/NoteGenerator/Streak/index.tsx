import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import Flame from '../../../icons/Flame';
import './Streak.css';

const Streak = ({multiplier}: {multiplier: number}) => {
  const [currStreak, setCurrStreak] = useState(multiplier);

  useEffect(() => {
    setCurrStreak(multiplier);
    setTimeout(() => setCurrStreak(0), 500);
  }, [multiplier]);

  return (
    <AnimatePresence>
      {!!currStreak && (
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
