import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '@/contexts/NoteGeneratorTuningContext';
import {useContext, useEffect, useRef} from 'react';
import StringButtons from './Buttons';
import Note from './Note';
import String from './String';
import S from './StringDisplay.module.css';

interface StringDisplayProps {
  string: StringStateValue;
  height: number;
}

const StringDisplay = ({string: {id, pitch, originalPitch}, height}: StringDisplayProps) => {
  const {selectedStringId, setSelectedStringId} = useContext(
    NoteGeneratorTuningContext,
  ) as NoteGeneratorTuningProps;

  const stringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!originalPitch) {
      stringRef.current?.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'nearest'});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = selectedStringId === id;

  return (
    <div className={S.stringContainer} ref={stringRef}>
      <div>
        <input
          aria-label="Set string's pitch range"
          type='checkbox'
          name='string'
          checked={selected}
          onChange={() => setSelectedStringId(id)}
        />
        <Note pitch={pitch} />
      </div>
      <String selected={selected} height={height} />
      <StringButtons id={id} />
    </div>
  );
};

export default StringDisplay;
