import {useState, useEffect, useContext} from 'react';
import {strings} from '../../../../constants/notes';
import {NoteGeneratorContext, NoteGeneratorProps} from '../../../../contexts/NodeGeneratorContext';

const Free = () => {
  const {changePitchRange} = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const [anyNote, setAnyNote] = useState(true);

  useEffect(() => {
    return () => {
      changePitchRange([0, strings.length - 1]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    changePitchRange(anyNote ? [null, null] : [0, strings.length - 1]);
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
