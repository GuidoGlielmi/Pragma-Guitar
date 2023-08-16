import {useState, useEffect} from 'react';
import Select from 'react-select';
import {pitchToNote} from '../../../../helpers/pitch';
import ChevronDown from '../../../../icons/ChevronDown';
import {Tuning, strings, tunings} from '../../../../constants/notes';
import {customStylesMaxContent} from '../../../../constants/selectStyles';
import S from './String.module.css';
import {rangeLimiter, setterRangeLimiter} from '../../../../helpers/valueRange';

const StringNoteRange = ({setPitchRange}: NoteRangeProps) => {
  const [tuning, setTuning] = useState(tunings[0]);
  const [fretsAmount, setFretsAmount] = useState(24);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const changePitchRange = (openStringPitch: number) => {
    const index = strings.findIndex(s => s.value === openStringPitch)!;
    setPitchRange([index, index + fretsAmount || strings.length - 1]);
  };

  const changeFretsAmount = (n: number) => setFretsAmount(setterRangeLimiter(n, {min: 0, max: 24}));

  const changeTuning = (n: number, i?: number) => {
    setTuning(ps => {
      let newValues = [...ps.value];
      if (i === undefined) newValues = newValues.map(v => rangeLimiter(v + n, 0, 127));
      else newValues[i] = rangeLimiter(newValues[i] + n, 0, 127);
      return {...ps, value: newValues};
    });
  };

  const removeString = (index: number) => {
    setTuning(ps => ({...ps, value: ps.value.filter((_v, i) => i !== index)}));
  };

  useEffect(() => {
    setPitchRange([undefined, fretsAmount - 1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fretsAmount]);

  useEffect(() => {
    if (selectedIndex === null) return;
    changePitchRange(tuning.value[selectedIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tuning, selectedIndex]);

  return (
    <div className={S.stringSection}>
      <Select
        isSearchable={false}
        styles={customStylesMaxContent}
        options={tunings}
        value={tuning}
        onChange={e => setTuning(e!)}
      />
      <div className={S.fretsContainer}>
        <h4>Frets</h4>
        <button onClick={() => changeFretsAmount(-1)}>-</button>
        <p>{fretsAmount}</p>
        <button onClick={() => changeFretsAmount(1)}>+</button>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 10,
          maxHeight: 200,
          overflow: 'scroll',
          padding: 10,
          borderBottom: '2px solid #999',
          borderTop: '2px solid #999',
          margin: 0,
          boxShadow: 'inset 0 0 23px black',
        }}
      >
        <div style={{flexGrow: 1}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginBottom: 10,
            }}
          >
            {tuning.value.map((_v, i, arr) => {
              const mirroredIndex = arr.length - 1 - i;
              return (
                <StringDisplay
                  tuning={tuning}
                  pitch={arr[mirroredIndex]}
                  key={i}
                  selectedIndex={selectedIndex}
                  setSelectedIndex={setSelectedIndex}
                  changeTuning={changeTuning}
                  removeString={removeString}
                  height={i + 1}
                  index={mirroredIndex}
                />
              );
            })}
          </div>
        </div>
        <div className={S.allStringsButtonsContainer}>
          <button title='Increase all strings' onClick={() => changeTuning(1)}>
            +
          </button>
          <button title='Decrease all strings' onClick={() => changeTuning(-1)}>
            -
          </button>
        </div>
      </div>
      <button
        title='Add string'
        onClick={() => setTuning(ps => ({...ps, value: [...ps.value, ps.value.at(-1)!]}))}
      >
        Add String
      </button>
    </div>
  );
};

interface StringDisplayProps {
  tuning: Tuning;
  pitch: number;
  height: number;
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  changeTuning: (n: number, index?: number) => void;
  removeString: (index: number) => void;
  index: number;
}
const StringDisplay = ({
  tuning,
  pitch,
  removeString,
  changeTuning,
  selectedIndex,
  setSelectedIndex,
  index,
  height,
}: StringDisplayProps) => {
  const selected = selectedIndex === index;
  const exactTuningNode =
    tunings.find(t => t.label === tuning.label)!.value[index] === tuning.value[index];
  return (
    <div className={S.stringContainer}>
      <div>
        <input
          type='checkbox'
          name='string'
          checked={selected}
          onChange={() => {
            setSelectedIndex(ps => (ps === index ? null : index));
          }}
        />
        <p>{pitchToNote(pitch)}</p>
      </div>
      <div
        style={{
          ...(selected && {filter: 'drop-shadow(0 0 7px #999)'}),
        }}
      >
        <div className={S.stringBall} />
        <div className={S.string} style={{height}} />
      </div>
      <div>
        <div>
          <button
            title='Increase semitone'
            className='button'
            style={{
              transform: 'rotateZ(180deg)',
              background: exactTuningNode ? '#2b2a33' : '#642b2b99',
            }}
            onClick={() => changeTuning(1, index)}
          >
            <ChevronDown color='white' />
          </button>
          <button
            title='Decrease semitone'
            style={{
              transform: 'translateY(2px)',
              background: exactTuningNode ? '#2b2a33' : '#642b2b99',
            }}
            className='button'
            onClick={() => changeTuning(-1, index)}
          >
            <ChevronDown color='white' />
          </button>
        </div>
        <button title='Remove string' onClick={() => removeString(index)}>
          X
        </button>
      </div>
    </div>
  );
};

export default StringNoteRange;
