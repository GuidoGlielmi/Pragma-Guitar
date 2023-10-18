import {useState, useEffect, useContext, forwardRef} from 'react';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '../../../../../contexts/NoteGeneratorTuningContext';
import {AnimatePresence, motion} from 'framer-motion';
import StringDisplay from '../StringDisplay';
import StringGroupModifier from '../StringGroupModifier';
import S from './TuningBoard.module.css';
import {
  NoteGeneratorContext,
  NoteGeneratorProps,
} from '../../../../../contexts/NodeGeneratorContext';

const TuningBoard = forwardRef<HTMLDivElement>((_props, boardRef) => {
  const {changePitchRange} = useContext(NoteGeneratorContext) as NoteGeneratorProps;
  const {tuning, fretsAmount} = useContext(NoteGeneratorTuningContext) as NoteGeneratorTuningProps;

  const [selectedStringIndex, setSelectedStringIndex] = useState<number | null>();

  useEffect(() => {
    if (selectedStringIndex === undefined) return;
    changePitchRange([
      tuning.pitches[selectedStringIndex ?? 0].pitch,
      tuning.pitches[selectedStringIndex ?? tuning.pitches.length - 1].pitch + fretsAmount,
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStringIndex]);

  return (
    <div
      ref={boardRef}
      className={S.tuningBoard}
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
                    height={i + 1}
                    index={mirroredIndex}
                    selected={selectedStringIndex === mirroredIndex}
                    select={(i: number) => setSelectedStringIndex(ps => (ps === i ? null : i))}
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
