import {useState, useEffect} from 'react';
import Select from 'react-select';
import ChevronDown from '../../../../icons/ChevronDown';
import {pitchRange, strings, tunings} from '../../../../constants/notes';
import {customStylesMaxContent} from '../../../../constants/selectStyles';
import S from './String.module.css';
import {rangeLimiter, setterRangeLimiter} from '../../../../helpers/valueRange';
import Reset from '../../../../icons/Reset';
import NoteWithOctave from '../../../common/NoteWithOctave';

const StringNoteRange = ({setPitchRange}: NoteRangeProps) => {
  const [tuningIndex, setTuningIndex] = useState(0);
  const [tuning, setTuning] = useState(tunings[0]);
  const [fretsAmount, setFretsAmount] = useState(24);
  const [selectedStringIndex, setSelectedStringIndex] = useState<number | null>(null);

  const changeFretsAmount = (n: number) => setFretsAmount(setterRangeLimiter(n, {min: 0, max: 24}));

  const changeTuning = (n: number, i?: number) => {
    setTuning(ps => {
      let newTuningValues = [...ps.value];
      if (i === undefined) {
        newTuningValues = newTuningValues.map(v => rangeLimiter(v + n, ...pitchRange));
      } else newTuningValues[i] = rangeLimiter(newTuningValues[i] + n, ...pitchRange);
      return {...ps, value: newTuningValues};
    });
  };

  const removeString = (index: number) => {
    setTuning(ps => ({...ps, value: ps.value.filter((_v, i) => i !== index)}));
  };

  const addString = (higher: boolean) => {
    setTuning(ps => {
      if (higher) return {...ps, value: [...ps.value, ps.value.at(-1)!]};
      return {...ps, value: [ps.value[0], ...ps.value]};
    });
  };

  useEffect(() => {
    if (selectedStringIndex === null) {
      return setPitchRange([0, strings.length - 1]);
    }
    const from = tuning.value[selectedStringIndex];
    setPitchRange([from, from + fretsAmount]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tuning, selectedStringIndex, fretsAmount]);

  return (
    <div className={S.stringSection}>
      <Select
        isSearchable={false}
        styles={customStylesMaxContent}
        options={tunings}
        value={tunings[tuningIndex]}
        onChange={e => {
          setTuningIndex(tunings.indexOf(e!));
          setTuning(e!);
        }}
      />
      <div className={S.fretsContainer}>
        <h4>Frets</h4>
        <button onClick={() => changeFretsAmount(-1)}>-</button>
        <p>{fretsAmount}</p>
        <button onClick={() => changeFretsAmount(1)}>+</button>
      </div>
      <button title='Add Upper string' onClick={() => addString(true)}>
        Add Upper String
      </button>
      <div
        style={{
          display: 'flex',
          gap: 10,
          height: 200,
          overflow: 'scroll',
          position: 'relative',
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
              gap: 4,
              marginBottom: 10,
            }}
          >
            {tuning.value
              .reduce<number[]>((p, c) => [c, ...p], [])
              .map((v, i, arr) => {
                const mirroredIndex = arr.length - 1 - i;
                return (
                  <StringDisplay
                    pitch={v}
                    key={i}
                    selectedIndex={selectedStringIndex}
                    setSelectedIndex={setSelectedStringIndex}
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
          <button
            className={S.resetButton}
            onClick={() => {
              setTuning(tunings[tuningIndex]);
            }}
            style={{padding: 0}}
            title='Reset tuning'
          >
            <Reset />
          </button>
          <div>
            <button
              title='Increase all strings'
              onClick={() => changeTuning(1)}
              style={{transform: 'rotateZ(180deg)'}}
            >
              <ChevronDown color='white' />
            </button>
            <button
              title='Decrease all strings'
              onClick={() => changeTuning(-1)}
              style={{transform: 'translateY(2px)'}}
            >
              <ChevronDown color='white' />
            </button>
          </div>
        </div>
      </div>
      <button title='Add Lower string' onClick={() => addString(false)}>
        Add Lower String
      </button>
    </div>
  );
};

interface StringDisplayProps {
  height: number;
  pitch: number;
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  changeTuning: (n: number, index?: number) => void;
  removeString: (index: number) => void;
  index: number;
}
const StringDisplay = ({
  height,
  pitch,
  removeString,
  changeTuning,
  selectedIndex,
  setSelectedIndex,
  index,
}: StringDisplayProps) => {
  const selected = selectedIndex === index;

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
        <NoteWithOctave pitch={pitch} />
        {/* <p>{pitchToNote(pitch)?.join('')}</p> */}
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
            style={{transform: 'rotateZ(180deg)'}}
            onClick={() => changeTuning(1, index)}
          >
            <ChevronDown color='white' />
          </button>
          <button
            title='Decrease semitone'
            style={{transform: 'translateY(2px)'}}
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
