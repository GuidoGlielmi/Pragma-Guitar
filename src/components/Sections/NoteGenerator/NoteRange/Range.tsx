import {AnimatePresence, motion} from 'framer-motion';
import {sections} from '@/constants/noteGeneratorOptions';

const optionsEntries = Object.entries(sections) as [keyof typeof sections, TSection][];

type TRangeProps = {
  selectedIndex: number;
  setOverflowHidden: (v: boolean) => void;
  isNext: boolean;
};

const Range = ({selectedIndex, setOverflowHidden, isNext}: TRangeProps) => {
  return (
    <div style={{height: optionsEntries[selectedIndex][1].height}} className='rangeSelectorSection'>
      <AnimatePresence
        initial={false}
        onExitComplete={() => {
          setOverflowHidden(false);
        }}
        custom={isNext}
      >
        <motion.div
          style={{position: 'absolute', top: 0, width: '90%', height: '100%'}}
          variants={variants}
          custom={isNext}
          transition={{type: 'spring', mass: 0.4, duration: 0.01}}
          onAnimationStart={def => {
            if (def === 'animate') setOverflowHidden(true);
          }}
          initial='initial'
          animate='animate'
          exit='exit'
          key={selectedIndex}
        >
          {optionsEntries[selectedIndex][1].element}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const variants = {
  initial(isNext: boolean) {
    return {
      x: isNext ? 200 : -200,
      opacity: 0,
    };
  },
  animate: {x: 0, opacity: 1},
  exit(isNext: boolean) {
    return {
      x: isNext ? -200 : 200,
      opacity: 0,
    };
  },
};

export default Range;
