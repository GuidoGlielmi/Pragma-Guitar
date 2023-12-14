import {useRef, useEffect, useContext} from 'react';
import S from './StringDisplay.module.css';
import String from './String';
import Note from './Note';
import Buttons from './Buttons';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '@/contexts/NoteGeneratorTuningContext';

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
          type='checkbox'
          name='string'
          checked={selected}
          onChange={() => setSelectedStringId(id)}
        />
        <Note pitch={pitch} />
      </div>
      <String selected={selected} height={height} />
      <Buttons id={id} />
    </div>
  );
};

export default StringDisplay;
