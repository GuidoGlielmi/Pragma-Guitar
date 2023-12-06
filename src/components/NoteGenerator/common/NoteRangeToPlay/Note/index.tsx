import {useEffect, useRef} from 'react';

import {AnimatePresence, motion} from 'framer-motion';
import NoteWithOctave from '@/components/common/NoteWithOctave';

const Note = ({pitch}: {pitch: number}) => {
  const prevPitchRef = useRef(pitch);

  useEffect(() => {
    prevPitchRef.current = pitch;
  }, [pitch]);

  const isNext = pitch > prevPitchRef.current;

  return (
    <AnimatePresence initial={false} custom={isNext}>
      <motion.div
        variants={variants}
        key={pitch}
        custom={isNext}
        initial='enter'
        animate='center'
        exit='exit'
      >
        <NoteWithOctave pitch={pitch} />
      </motion.div>
    </AnimatePresence>
  );
};

const variants = {
  enter: (isNext: boolean) => {
    return {
      x: '-50%',
      y: `${isNext ? '-' : ''}200%`,
    };
  },
  center: {x: '-50%', opacity: 1, y: '-50%'},
  exit: (isNext: boolean) => {
    return {
      x: '-50%',
      y: `${!isNext ? '-' : ''}200%`,
    };
  },
};

export default Note;
