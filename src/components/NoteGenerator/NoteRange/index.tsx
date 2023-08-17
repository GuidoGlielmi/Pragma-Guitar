import {useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import StringNoteRange from './String';
import CustomNoteRange from './Custom';
import './NoteRange.css';

const RangeSelector = ({
  from,
  to,
  setPitchRange,
}: {
  from: gtrString;
  to: gtrString;
  setPitchRange: PitchRangeSetter;
}) => {
  const [overflowHidden, setOverflowHidden] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const slideForward = useRef(false);

  const options = {
    ['On String']: <StringNoteRange setPitchRange={setPitchRange} />,
    ['On Note Range']: <CustomNoteRange to={to} from={from} setPitchRange={setPitchRange} />,
  };

  const optionsEntries = Object.entries(options) as [keyof typeof options, JSX.Element][];

  const sectionSelectionHandler = (i: number) => {
    setOverflowHidden(true);
    setSelectedIndex(ps => {
      slideForward.current = ps !== null ? ps! > i : i === 0;
      return ps === i ? null : i;
    });
  };

  const hasSelection = selectedIndex !== null;

  return (
    <div
      id='rangeSelector'
      className='rangeSelectorContainer'
      style={{overflow: overflowHidden ? 'hidden' : 'visible'}}
    >
      <h3>Play Note</h3>
      <div style={{marginBottom: 10}}>
        {optionsEntries.map(([title], i) => (
          <button
            id={title.replaceAll(/ /g, '')}
            key={title}
            style={{
              ...(selectedIndex === i && {borderBottom: '1px solid #646cff', color: 'white'}),
            }}
            onClick={() => sectionSelectionHandler(i)}
          >
            {title}
          </button>
        ))}
      </div>
      <div
        style={{
          height: hasSelection ? (optionsEntries[selectedIndex][0] === 'On String' ? 400 : 60) : 0,
          transition: 'height 0.2s ease',
          overflow: overflowHidden ? 'hidden' : 'visible',
        }}
        className='rangeSelectorSection'
      >
        <AnimatePresence
          initial={false}
          onExitComplete={() => {
            setOverflowHidden(false);
          }}
        >
          <motion.div
            style={{position: 'absolute', top: 0, width: '90%'}}
            initial={{x: slideForward.current ? -200 : 200, opacity: 0}}
            transition={{type: 'spring', mass: 0.4, duration: 0.01}}
            animate={animate}
            exit={{x: slideForward.current ? -200 : 200, opacity: 0}}
            onAnimationStart={def => {
              if (def === animate) {
                setOverflowHidden(true);
              }
            }}
            key={selectedIndex}
          >
            {hasSelection ? optionsEntries[selectedIndex][1] : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const animate = {x: 0, opacity: 1};

export default RangeSelector;
