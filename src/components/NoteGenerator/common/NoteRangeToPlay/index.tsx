import {useContext} from 'react';
import NoteWithOctave from '../../../common/NoteWithOctave';
import {NoteGeneratorContext, NoteGeneratorProps} from '../../../../contexts/NodeGeneratorContext';
import {MAX_PITCH_INDEX} from '../../../../constants/notes';
import {AnimatePresence, motion} from 'framer-motion';

const NoteRangeToPlay = () => {
  const {
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  return (
    <div className='rangeToPlayContainer'>
      <AnimatePresence>
        <div>
          <motion.div
            key={from ?? 0}
            initial={{x: '-50%', opacity: 0.5, y: '-150%'}}
            animate={{x: '-50%', opacity: 1, y: '-50%'}}
            exit={{x: '-50%', y: '50%'}}
          >
            <NoteWithOctave pitch={from ?? 0} />
          </motion.div>
        </div>
      </AnimatePresence>
      -
      <AnimatePresence>
        <div>
          <motion.div
            key={to ?? MAX_PITCH_INDEX}
            initial={{x: '-50%', opacity: 0.5, y: '-150%'}}
            animate={{x: '-50%', opacity: 1, y: '-50%'}}
            exit={{x: '-50%', y: '50%'}}
          >
            <NoteWithOctave pitch={to ?? MAX_PITCH_INDEX} />
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  );
};

export default NoteRangeToPlay;
