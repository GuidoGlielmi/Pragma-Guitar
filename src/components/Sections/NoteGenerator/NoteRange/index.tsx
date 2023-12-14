import {useRef, useState} from 'react';
import './NoteRange.css';
import useTranslation from '@/hooks/useTranslation';
import Options from './Options';
import Range from './Range';

const RangeSelector = () => {
  const [overflowHidden, setOverflowHidden] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const prevIndexRef = useRef(selectedIndex);

  const [playNoteString] = useTranslation('playNote');

  const sectionSelectionHandler = (i: number) => {
    setOverflowHidden(true);
    prevIndexRef.current = selectedIndex;
    setSelectedIndex(i);
  };

  return (
    <div
      id='rangeSelector'
      className='rangeSelectorContainer'
      style={{overflow: overflowHidden ? 'hidden' : 'visible'}}
    >
      <h3>{playNoteString}</h3>
      <Options selectedIndex={selectedIndex} setSection={sectionSelectionHandler} />
      <Range
        selectedIndex={selectedIndex}
        overflowHidden={overflowHidden}
        setOverflowHidden={setOverflowHidden}
        isNext={selectedIndex > prevIndexRef.current}
      />
    </div>
  );
};

export default RangeSelector;
