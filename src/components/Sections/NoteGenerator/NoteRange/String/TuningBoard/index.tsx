import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '@/contexts/NoteGeneratorTuningContext';
import {AnimatePresence, motion} from 'framer-motion';
import {forwardRef, useContext} from 'react';
import StringDisplay from './StringDisplay';
import StringGroupModifier from './StringGroupModifier';
import S from './TuningBoard.module.css';

const TuningBoard = forwardRef<HTMLDivElement>((_props, boardRef) => {
  const {tuning} = useContext(NoteGeneratorTuningContext) as NoteGeneratorTuningProps;

  return (
    <div ref={boardRef} className={S.tuningBoard}>
      <div>
        <div>
          <AnimatePresence initial={false}>
            {tuning.strings.map((_s, i, arr) => {
              const inverseIndex = arr.length - 1 - i;
              const inverseIndexString = arr[inverseIndex];
              return (
                <motion.div
                  id={`${inverseIndexString.id}`}
                  key={inverseIndexString.id}
                  style={{scrollMarginTop: 50}}
                  layoutId={`${inverseIndexString.id}`}
                  initial={{opacity: 0, background: '#ffffff55'}}
                  animate={{
                    opacity: [0, 0, 0, 1],
                    background: ['#ffffff55', '#ffffff55', '#ffffff22', '#ffffff00'],
                  }}
                  exit={{opacity: 0, x: '100%'}}
                  transition={{duration: 0.5, ease: [0, 1, 1, 1]}}
                >
                  <StringDisplay string={inverseIndexString} height={i + 1} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      <StringGroupModifier />
    </div>
  );
});

export default TuningBoard;
