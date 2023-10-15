import {Dispatch, FC, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import StringNoteRange from './String';
import CustomNoteRange from './Custom';
import './NoteRange.css';
import Free from './Free';
import NoteGeneratorTuningProvider from '../../../contexts/NoteGeneratorTuningContext';

const options = {
  ['Free Mode']: <Free />,
  ['On Note Range']: <CustomNoteRange />,
  ['On String']: (
    <NoteGeneratorTuningProvider>
      <StringNoteRange />
    </NoteGeneratorTuningProvider>
  ),
};

const optionsEntries = Object.entries(options) as [keyof typeof options, JSX.Element][];

const RangeSelector = () => {
  const [overflowHidden, setOverflowHidden] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const slideForward = useRef(false);

  const sectionSelectionHandler = (i: number) => {
    setOverflowHidden(true);
    setSelectedIndex(ps => {
      slideForward.current = ps !== null ? ps! > i : i === 0;
      return ps === i ? null : i;
    });
  };

  return (
    <div
      id='rangeSelector'
      className='rangeSelectorContainer'
      style={{overflow: overflowHidden ? 'hidden' : 'visible'}}
    >
      <h3>Play Note</h3>
      <RangeOptions selectedIndex={selectedIndex} setSection={sectionSelectionHandler} />
      <RangeSelection
        selectedIndex={selectedIndex}
        overflowHidden={overflowHidden}
        setOverflowHidden={setOverflowHidden}
        slideForward={slideForward}
      />
    </div>
  );
};

const animate = {x: 0, opacity: 1};

type RangeOptionsProps = {
  selectedIndex: number | null;
  setSection: (i: number) => void;
};

const RangeOptions: FC<RangeOptionsProps> = ({selectedIndex, setSection}) => {
  return (
    <div className='rangeOptions'>
      {optionsEntries.map(([title], i) => (
        <button
          id={title.replaceAll(/ /g, '')}
          key={title}
          style={{
            ...(selectedIndex === i && {borderBottom: '1px solid #646cff', color: 'white'}),
          }}
          onClick={() => setSection(i)}
        >
          {title}
        </button>
      ))}
    </div>
  );
};

type RangeSelectionProps = {
  selectedIndex: number | null;
  overflowHidden: boolean;
  setOverflowHidden: Dispatch<React.SetStateAction<boolean>>;
  slideForward: React.MutableRefObject<boolean>;
};

const RangeSelection: FC<RangeSelectionProps> = ({
  selectedIndex,
  overflowHidden,
  setOverflowHidden,
  slideForward,
}) => {
  const hasSelection = selectedIndex !== null;
  return (
    <div
      style={{
        height: hasSelection ? (optionsEntries[selectedIndex][0] === 'On String' ? 450 : 60) : 0,
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
          style={{position: 'absolute', top: 0, width: '90%', height: '100%'}}
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
  );
};

export default RangeSelector;
