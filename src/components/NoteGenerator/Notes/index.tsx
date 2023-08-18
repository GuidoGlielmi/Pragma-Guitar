import {AnimatePresence, motion} from 'framer-motion';
import ArrowRight from '../../../icons/ArrowRight';
import Tick from '../../../icons/Tick';
import Ellipsis from '../../common/Ellipsis';
import Streak from '../Streak';
import NoteToPlay from './NoteToPlay';
import NotePlayed from './NotePlayed';
import './Notes.css';

interface NotesProps {
  pitch: number | null;
  pitchToPlay: number | null;
  correct: boolean;
  anyOctave: boolean;
  currStreak: number;
}

const Notes = ({correct, pitch, pitchToPlay, anyOctave, currStreak}: NotesProps) => {
  return (
    <motion.div
      style={{overflow: 'hidden'}}
      className='mainBoard'
      initial={{opacity: 0, height: 0}}
      animate={{
        opacity: 1,
        height: 160,
        marginBottom: 6,
        transitionEnd: {
          overflow: 'visible',
        },
      }}
      exit={{opacity: 0.5, height: 0, marginBottom: 0, overflow: 'hidden'}}
    >
      <div className='notesDisplay'>
        <NoteToPlay pitchToPlay={pitchToPlay} anyOctave={anyOctave} />
        <ArrowRight />
        <NotePlayed pitch={pitch} anyOctave={anyOctave} />
      </div>
      <AnimatePresence mode='wait'>
        <motion.div
          className='result'
          key={correct ? 'tick' : 'ellipsis'}
          initial={{opacity: 0, y: '50%'}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, ...(correct && {y: -30})}}
          transition={{duration: 0.1}}
        >
          {correct ? <Tick /> : <Ellipsis />}
          {correct && <Streak multiplier={currStreak} />}
          {/* <Streak multiplier={currStreak} /> */}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
export default Notes;
