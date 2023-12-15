import {FC} from 'react';
import './NoteRange.css';
import useTranslation from '@/hooks/useTranslation';
import NoteRangeToPlay from '../common/NoteRangeToPlay';
import {sections} from '@/constants/noteRangeOptions';

type RangeOptionsProps = {
  selectedIndex: number;
  setSection: (i: number) => void;
};

const optionsEntries = Object.entries(sections) as [keyof typeof sections, TSection][];

const Options: FC<RangeOptionsProps> = ({selectedIndex, setSection}) => {
  const rangeOptionsTitles = useTranslation(optionsEntries.map(([k]) => k));

  return (
    <>
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
      <NoteRangeToPlay canWheel={optionsEntries[selectedIndex][0] === 'inNoteRange'} />
    </>
  );
};

export default Options;
