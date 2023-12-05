import {useState, useEffect, useContext, forwardRef} from 'react';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '../../../../../contexts/NoteGeneratorTuningContext';
import {AnimatePresence, motion} from 'framer-motion';
import StringDisplay from './StringDisplay';
import StringGroupModifier from './StringGroupModifier';
import S from './TuningBoard.module.css';
import {
  NoteGeneratorContext,
  NoteGeneratorProps,
} from '../../../../../contexts/NodeGeneratorContext';
import {getHighestPitch, getLowestPitch} from '../../../../../helpers/tuning';

const TuningBoard = forwardRef<HTMLDivElement>((_props, boardRef) => {
  const {changePitchRange} = useContext(NoteGeneratorContext) as NoteGeneratorProps;
  const {tuning, fretsAmount} = useContext(NoteGeneratorTuningContext) as NoteGeneratorTuningProps;

  const [selectedStringId, setSelectedStringId] = useState<number | null>(null);

  useEffect(() => {
    const pitchObj = tuning.pitches.find(p => p.id === selectedStringId);
    if (!pitchObj) {
      changePitchRange([getLowestPitch(tuning), getHighestPitch(tuning) + fretsAmount]);
      setSelectedStringId(null);
    } else changePitchRange([pitchObj.pitch, pitchObj.pitch + fretsAmount]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStringId, tuning, fretsAmount]);

  return (
    <div ref={boardRef} className={S.tuningBoard}>
      <div>
        <div>
          <AnimatePresence initial={false}>
            {[...tuning.pitches].reverse().map((v, inverseIndex, arr) => {
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
                    select={(id: number) => setSelectedStringId(ps => (ps === id ? null : id))}
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
