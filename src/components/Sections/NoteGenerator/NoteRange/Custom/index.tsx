import {useEffect, useContext} from 'react';
import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NodeGeneratorContext';
import useTranslation from '@/hooks/useTranslation';
import NoteWithOctaveSelect from '@/components/common/ReactSelect/NoteWithOctaveSelect';
import {MAX_PITCH_INDEX} from '@/constants/notes';

const CUSTOM_PITCH_RANGE_STORAGE_KEY = 'customPitchRange';

const CustomNoteRange = () => {
  const {
    changePitchRange,
    pitchRange: [from, to],
    pitchRange,
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const [fromString, toString] = useTranslation(['from', 'to']);

  useEffect(() => {
    const customPitchRange = JSON.parse(localStorage.getItem(CUSTOM_PITCH_RANGE_STORAGE_KEY)!);
    if (customPitchRange) changePitchRange(customPitchRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(CUSTOM_PITCH_RANGE_STORAGE_KEY, JSON.stringify(pitchRange));
  }, [pitchRange]);

  return (
    <div style={{display: 'flex', gap: 10, justifyContent: 'center'}}>
      <div>
        <label htmlFor='from'>{fromString}</label>
        <NoteWithOctaveSelect
          id='from'
          value={{value: from ?? 0}}
          onChange={e => changePitchRange(ps => [e!.value, ps[1] ?? MAX_PITCH_INDEX])}
          isOptionDisabled={e => e.value > to!}
        />
      </div>
      <div>
        <label htmlFor='to'>{toString}</label>
        <NoteWithOctaveSelect
          id='to'
          value={{value: to ?? MAX_PITCH_INDEX}}
          onChange={e => changePitchRange(ps => [ps[0] ?? 0, e!.value])}
          isOptionDisabled={e => e.value < from!}
        />
      </div>
    </div>
  );
};
export default CustomNoteRange;
