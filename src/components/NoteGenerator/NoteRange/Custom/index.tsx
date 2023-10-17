import {useEffect, useContext} from 'react';
import Select from 'react-select';
import {customStyles} from '../../../../constants/reactSelectStyles';
import {strings} from '../../../../constants/notes';
import {NoteGeneratorContext, NoteGeneratorProps} from '../../../../contexts/NodeGeneratorContext';

const CustomNoteRange = () => {
  const {
    changePitchRange,
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  useEffect(() => {
    changePitchRange([0, strings.length - 1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id='customNoteRange' style={{display: 'flex', gap: 10, justifyContent: 'center'}}>
      <div>
        <label htmlFor='from'>From</label>
        <Select
          id='from'
          isSearchable={false}
          styles={customStyles}
          options={strings}
          value={from}
          onChange={e => changePitchRange([e!.value, undefined])} // value is index
        />
      </div>
      <div>
        <label htmlFor='to'>To</label>
        <Select
          id='to'
          isSearchable={false}
          styles={customStyles}
          options={strings}
          value={to}
          onChange={e => changePitchRange([undefined, e!.value])} // value is index
        />
      </div>
    </div>
  );
};
export default CustomNoteRange;
