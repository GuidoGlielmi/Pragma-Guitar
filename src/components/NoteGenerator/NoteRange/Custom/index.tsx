import Select from 'react-select';
import {customStyles} from '../../../../constants/selectStyles';
import {strings} from '../../../../constants/notes';

interface CustomNoteRangeProps extends NoteRangeProps {
  from: gtrString;
  to: gtrString;
}
const CustomNoteRange = ({from, to, setPitchRange}: CustomNoteRangeProps) => {
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
          onChange={e => setPitchRange([strings.indexOf(e!), undefined])}
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
          onChange={e => setPitchRange([strings.indexOf(e!), undefined])}
        />
      </div>
    </div>
  );
};
export default CustomNoteRange;
