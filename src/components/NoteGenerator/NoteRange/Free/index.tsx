import {useState, useEffect, useContext} from 'react';
import {strings} from '../../../../constants/notes';
import {NoteGeneratorContext, NoteGeneratorProps} from '../../../../contexts/NodeGeneratorContext';

const Free = () => {
  const {pitchRange, changePitchRange} = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  useEffect(() => {
    changePitchRange([null, null]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const anyNote = pitchRange[0] === null && pitchRange[1] === null;

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
          onChange={() => {
            changePitchRange([null, null]);
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
            changePitchRange([0, strings.length - 1]);
          }}
        />
        <label htmlFor='exact'>Exact Octave</label>
      </div>
    </div>
  );
};

export default Free;
