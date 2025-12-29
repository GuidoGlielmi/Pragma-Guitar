import NoteGeneratorTuningProvider from '@/contexts/NoteGeneratorTuningContext';
import {NoteGeneratorTranslation} from '@/helpers/translations';
import {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import CustomNoteRange from './Custom';
import Free from './Free';
import './NoteRange.css';
import Options from './Options';
import RangeSelectorWrapper from './RangeSelectorWrapper';
import StringNoteRange from './String';

const RangeSelector = () => {
  const [overflowHidden, setOverflowHidden] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const prevIndexRef = useRef(selectedIndex);

  const {t} = useTranslation('app');

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
      <h3>{t('playNote')}</h3>
      <Options
        selectedIndex={selectedIndex}
        setSection={sectionSelectionHandler}
        sections={sections.map(s => s.title)}
      />
      <div style={{height: sections[selectedIndex].height}} className='rangeSelectorSection'>
        <RangeSelectorWrapper
          setOverflowHidden={setOverflowHidden}
          isNext={selectedIndex > prevIndexRef.current}
        >
          {sections[selectedIndex].element}
        </RangeSelectorWrapper>
      </div>
    </div>
  );
};

const sections: {
  title: keyof NoteGeneratorTranslation;
  element: React.ReactElement;
  height: number;
}[] = [
  {title: 'freeMode', element: <Free key='freeMode' />, height: 0},
  {title: 'inNoteRange', element: <CustomNoteRange key='inNoteRange' />, height: 60},
  {
    title: 'inString',
    element: (
      <NoteGeneratorTuningProvider key='inString'>
        <StringNoteRange />
      </NoteGeneratorTuningProvider>
    ),
    height: 445,
  },
];

export default RangeSelector;
