import NoteWithOctave from '@/components/common/NoteWithOctave';
import {AnimatePresence, motion} from 'framer-motion';

const Note = ({pitch}: {pitch: number}) => {
  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={pitch}
        transition={{
          opacity: {duration: 0.05},
          color: {duration: 0.3, ease: 'easeIn'},
        }}
        initial={{opacity: 0, color: '#b53f3f'}}
        animate={{
          opacity: 1,
          color: '#e2e2e2',
        }}
        exit={{opacity: 0}}
      >
        <NoteWithOctave pitch={pitch} />
      </motion.div>
    </AnimatePresence>
  );
};

export default Note;
