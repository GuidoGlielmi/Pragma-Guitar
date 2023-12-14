import {useRef, useEffect} from 'react';
import S from './StringDisplay.module.css';
import String from './String';
import Note from './Note';
import Buttons from './Buttons';

interface StringDisplayProps {
  height: number;
  pitch: StringStateValue;
  index: number;
  selected: boolean;
  select: (i: number) => void;
}

const StringDisplay = ({
  height,
  pitch: {id, pitch, originalPitch},
  index,
  selected,
  select,
}: StringDisplayProps) => {
  const stringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!originalPitch) {
      stringRef.current?.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'nearest'});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={S.stringContainer} ref={stringRef}>
      <div>
        <input type='checkbox' name='string' checked={selected} onChange={() => select(id)} />
        <Note pitch={pitch} />
      </div>
      <String selected={selected} height={height} />
      <Buttons id={id} selected={selected} index={index} />
    </div>
  );
};

export default StringDisplay;
