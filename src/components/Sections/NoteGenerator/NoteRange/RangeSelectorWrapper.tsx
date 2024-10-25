import {AnimatePresence, motion} from 'framer-motion';
import React from 'react';

type TRangeProps = {
  setOverflowHidden: (v: boolean) => void;
  isNext: boolean;
  children: React.ReactElement;
};

const RangeSelectorWrapper = ({setOverflowHidden, isNext, children}: TRangeProps) => {
  return (
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
        key={children.key}
      >
        {children}
      </motion.div>
    </AnimatePresence>
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

export default RangeSelectorWrapper;
