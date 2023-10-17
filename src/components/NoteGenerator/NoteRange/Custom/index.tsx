import {useEffect, useContext} from 'react';
import {strings} from '../../../../constants/notes';
import {NoteGeneratorContext, NoteGeneratorProps} from '../../../../contexts/NodeGeneratorContext';
import useTranslation from '../../../../hooks/useTranslation';
import NoteWithOctaveSelect from '../../../common/ReactSelect/NoteWithOctaveSelect';

const CustomNoteRange = () => {
  const {
    changePitchRange,
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const [fromString, toString] = useTranslation(['From', 'To']);

  useEffect(() => {
    changePitchRange([0, strings.length - 1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id='customNoteRange' style={{display: 'flex', gap: 10, justifyContent: 'center'}}>
      <div>
        <label htmlFor='from'>{fromString}</label>
        <NoteWithOctaveSelect
          id='from'
          value={from}
          onChange={e => changePitchRange([e!.value, undefined])} // value is index
        />
      </div>
      <div>
        <label htmlFor='to'>{toString}</label>
        <NoteWithOctaveSelect
          id='to'
          value={to}
          onChange={e => changePitchRange([undefined, e!.value])} // value is index
          isOptionDisabled={e => strings.indexOf(e) < strings.indexOf(from!)}
        />
      </div>
    </div>
  );
};
export default CustomNoteRange;
