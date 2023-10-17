import {Dispatch, FC, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import StringNoteRange from './String';
import CustomNoteRange from './Custom';
import './NoteRange.css';
import Free from './Free';
import NoteGeneratorTuningProvider from '../../../contexts/NoteGeneratorTuningContext';
import useTranslation from '../../../hooks/useTranslation';

const options = {
  ['Free Mode']: <Free />,
  ['In Note Range']: <CustomNoteRange />,
  ['In String']: (
    <NoteGeneratorTuningProvider>
      <StringNoteRange />
    </NoteGeneratorTuningProvider>
  ),
};

const optionsEntries = Object.entries(options) as [keyof typeof options, JSX.Element][];

const RangeSelector = () => {
  const [overflowHidden, setOverflowHidden] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const prevIndex = useRef(selectedIndex);

  const [playNoteString] = useTranslation('Play Note');

  const sectionSelectionHandler = (i: number) => {
    setOverflowHidden(true);
    prevIndex.current = selectedIndex;
    setSelectedIndex(i);
  };

  return (
    <div
      id='rangeSelector'
      className='rangeSelectorContainer'
      style={{overflow: overflowHidden ? 'hidden' : 'visible'}}
    >
      <h3>{playNoteString}</h3>
      <RangeOptions selectedIndex={selectedIndex} setSection={sectionSelectionHandler} />
      <SelectedRange
        selectedIndex={selectedIndex}
        overflowHidden={overflowHidden}
        setOverflowHidden={setOverflowHidden}
        prevIndex={prevIndex}
      />
    </div>
  );
};

const animate = {x: 0, opacity: 1};

type RangeOptionsProps = {
  selectedIndex: number;
  setSection: (i: number) => void;
};

const RangeOptions: FC<RangeOptionsProps> = ({selectedIndex, setSection}) => {
  const rangeOptionsTitles = useTranslation(optionsEntries.map(([k]) => k));

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
          {rangeOptionsTitles[i]}
        </button>
      ))}
    </div>
  );
};

type SelectedRangeProps = {
  selectedIndex: number;
  overflowHidden: boolean;
  setOverflowHidden: Dispatch<React.SetStateAction<boolean>>;
  prevIndex: React.RefObject<number>;
};

const RIGHT = 200;
const LEFT = -200;

const SelectedRange: FC<SelectedRangeProps> = ({
  selectedIndex,
  overflowHidden,
  setOverflowHidden,
  prevIndex,
}) => {
  const currentIsLast = selectedIndex === Object.keys(options).length - 1;

  return (
    <div
      style={{
        height: optionsEntries[selectedIndex][0] === 'In String' ? 430 : 60,
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
          initial={{
            x: selectedIndex === 0 || prevIndex.current! > selectedIndex! ? LEFT : RIGHT,
            opacity: 0,
          }}
          transition={{type: 'spring', mass: 0.4, duration: 0.01}}
          animate={animate}
          exit={{opacity: 0, y: '100%'}}
          onAnimationStart={def => {
            if (def === animate) {
              setOverflowHidden(true);
            }
          }}
          key={selectedIndex}
        >
          {optionsEntries[selectedIndex][1]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RangeSelector;
