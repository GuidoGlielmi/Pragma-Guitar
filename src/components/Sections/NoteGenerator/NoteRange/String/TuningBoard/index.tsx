import {useContext, forwardRef} from 'react';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '@/contexts/NoteGeneratorTuningContext';
import {AnimatePresence, motion} from 'framer-motion';
import StringDisplay from './StringDisplay';
import StringGroupModifier from './StringGroupModifier';
import S from './TuningBoard.module.css';

const TuningBoard = forwardRef<HTMLDivElement>((_props, boardRef) => {
  const {tuning, selectedStringId, setSelectedStringId} = useContext(
    NoteGeneratorTuningContext,
  ) as NoteGeneratorTuningProps;

  return (
    <div ref={boardRef} className={S.tuningBoard}>
      <div>
        <div>
          <AnimatePresence initial={false}>
            {[...tuning.strings].reverse().map((v, inverseIndex, arr) => {
              const index = arr.length - 1 - inverseIndex;
              return (
                <motion.div
                  id={`${v.id}`}
                  key={v.id}
                  style={{scrollMarginTop: 50}}
                  layoutId={`${v.id}`}
                  initial={{opacity: 0, background: '#ffffff55'}}
                  animate={{
                    opacity: [0, 0, 0, 1],
                    background: ['#ffffff55', '#ffffff55', '#ffffff22', '#ffffff00'],
                  }}
                  exit={{opacity: 0, x: '100%'}}
                  transition={{duration: 0.5, ease: [0, 1, 1, 1]}}
                >
                  <StringDisplay
                    pitch={v}
                    height={inverseIndex + 1}
                    index={index}
                    selected={selectedStringId === v.id}
                    select={setSelectedStringId}
                  />
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
