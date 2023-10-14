import {useContext} from 'react';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '../../../../../contexts/NoteGeneratorTuningContext';
import {AnimatePresence, motion} from 'framer-motion';
import StringDisplay from '../StringDisplay';
import StringGroupModifier from '../StringGroupModifier';

const TuningBoard = () => {
  const {tuning} = useContext(NoteGeneratorTuningContext) as NoteGeneratorTuningProps;

  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        height: 200,
        overflow: 'scroll',
        overflowX: 'hidden',
        position: 'relative',
        padding: 10,
        borderBottom: '2px solid #999',
        borderTop: '2px solid #999',
        margin: 0,
        boxShadow: 'inset 0 0 23px black',
      }}
    >
      <div style={{flexGrow: 1}}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            marginBottom: 10,
          }}
        >
          <AnimatePresence initial={false}>
            {[...tuning.pitches].reverse().map((v, i, arr) => {
              const mirroredIndex = arr.length - 1 - i;
              return (
                <motion.div
                  id={v.id.toString()}
                  key={v.id}
                  style={{scrollMarginTop: 50}}
                  layoutId={v.id.toString()}
                  initial={{opacity: 0, background: '#ffffff55'}}
                  animate={{
                    opacity: [0, 0, 0, 1],
                    background: ['#ffffff55', '#ffffff55', '#ffffff22', '#ffffff00'],
                  }}
                  exit={{opacity: 0, x: '100%'}}
                  transition={{duration: 0.5, ease: [0, 1, 1, 1]}}
                >
                  <StringDisplay pitch={v} key={v.id} height={i + 1} index={mirroredIndex} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      <StringGroupModifier />
    </div>
  );
};

export default TuningBoard;
