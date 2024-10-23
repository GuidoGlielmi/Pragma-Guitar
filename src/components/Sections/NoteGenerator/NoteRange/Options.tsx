import {NoteGeneratorTranslation} from '@/helpers/translations';
import useTranslation from '@/hooks/useTranslation';
import {FC} from 'react';
import NoteRangeToPlay from '../common/NoteRangeToPlay';
import './NoteRange.css';

type RangeOptionsProps = {
  selectedIndex: number;
  setSection: (i: number) => void;
  sections: (keyof NoteGeneratorTranslation)[];
};

const Options: FC<RangeOptionsProps> = ({selectedIndex, setSection, sections}) => {
  const rangeOptionsTitles = useTranslation(sections);

  return (
    <>
      <div className='rangeOptions'>
        {sections.map((title, i) => (
          <button
            id={title}
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
      <NoteRangeToPlay canScroll={sections[selectedIndex] === 'inNoteRange'} />
    </>
  );
};

export default Options;
