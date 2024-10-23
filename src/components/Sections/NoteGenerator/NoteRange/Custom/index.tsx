import NoteWithOctaveSelect from '@/components/common/ReactSelect/NoteWithOctaveSelect';
import {CUSTOM_PITCH_RANGE_STORAGE_KEY, MAX_PITCH_INDEX} from '@/constants';
import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NoteGeneratorContext';
import useLocalStorage from '@/hooks/useLocalStorage';
import useTranslation from '@/hooks/useTranslation';
import {useContext} from 'react';

const CustomNoteRange = () => {
  const {
    changePitchRange,
    changeLowerPitch,
    changeHigherPitch,
    pitchRange: [from, to],
    pitchRange,
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const [fromString, toString] = useTranslation(['from', 'to']);

  useLocalStorage(CUSTOM_PITCH_RANGE_STORAGE_KEY, pitchRange, {
    initialGetter: v => changePitchRange(v),
  });

  return (
    <div style={{display: 'flex', gap: 10, justifyContent: 'center'}}>
      <div>
        <label htmlFor='from'>{fromString}</label>
        <NoteWithOctaveSelect
          id='from'
          value={from ?? 0}
          onChange={e => changeLowerPitch(e!.value)}
          isOptionDisabled={e => e.value > to!}
        />
      </div>
      <div>
        <label htmlFor='to'>{toString}</label>
        <NoteWithOctaveSelect
          id='to'
          value={to ?? MAX_PITCH_INDEX}
          onChange={e => changeHigherPitch(e!.value)}
          isOptionDisabled={e => e.value < from!}
        />
      </div>
    </div>
  );
};
export default CustomNoteRange;
