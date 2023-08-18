import {useState, useEffect} from 'react';
import {strings} from '../../../../constants/notes';

const Free = ({setPitchRange}: NoteRangeProps) => {
  const [anyNote, setAnyNote] = useState(true);

  useEffect(() => {
    return () => {
      setPitchRange([0, strings.length - 1]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPitchRange(anyNote ? [null, null] : [0, strings.length - 1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anyNote]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        width: 'max-content',
        margin: 'auto',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          width: 'max-content',
          margin: 'auto',
        }}
      >
        <input
          type='checkbox'
          id='any'
          checked={anyNote}
          onChange={e => {
            setAnyNote(e.target.checked);
          }}
        />
        <label htmlFor='any'>Any Octave</label>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          width: 'max-content',
          margin: 'auto',
        }}
      >
        <input
          type='checkbox'
          id='exact'
          checked={!anyNote}
          onChange={e => {
            setAnyNote(!e.target.checked);
          }}
        />
        <label htmlFor='exact'>Exact Octave</label>
      </div>
    </div>
  );
};

export default Free;
