import {useEffect, useContext} from 'react';
import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NodeGeneratorContext';
import useTranslation from '@/hooks/useTranslation';
import NoteWithOctaveSelect from '@/components/common/ReactSelect/NoteWithOctaveSelect';
import {MAX_PITCH_INDEX} from '@/constants/notes';

const CustomNoteRange = () => {
  const {
    changePitchRange,
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const [fromString, toString] = useTranslation(['From', 'To']);

  useEffect(() => {
    changePitchRange([0, MAX_PITCH_INDEX]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{display: 'flex', gap: 10, justifyContent: 'center'}}>
      <div>
        <label htmlFor='from'>{fromString}</label>
        <NoteWithOctaveSelect
          id='from'
          value={{value: from ?? 0}}
          onChange={e => changePitchRange([e?.value!, undefined])} // value is index
          isOptionDisabled={e => e.value > to!}
        />
      </div>
      <div>
        <label htmlFor='to'>{toString}</label>
        <NoteWithOctaveSelect
          id='to'
          value={{value: to ?? MAX_PITCH_INDEX}}
          onChange={e => changePitchRange([undefined, e?.value!])} // value is index
          isOptionDisabled={e => e.value < from!}
        />
      </div>
    </div>
  );
};
export default CustomNoteRange;
