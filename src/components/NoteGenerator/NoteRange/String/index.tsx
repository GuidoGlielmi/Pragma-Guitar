import {useState, useEffect, useRef} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import Select from 'react-select';
import ChevronDown from '../../../../icons/ChevronDown';
import {
  TuningStateValue,
  convertTuningToState,
  pitchRange,
  strings,
  tunings,
} from '../../../../constants/notes';
import {customStylesMaxContent} from '../../../../constants/reactSelectStyles';
import S from './String.module.css';
import {rangeLimiter, setterRangeLimiter} from '../../../../helpers/valueRange';
import Reset from '../../../../icons/Reset';
import NoteWithOctave from '../../../common/NoteWithOctave';

const StringNoteRange = ({setPitchRange}: NoteRangeProps) => {
  const [tuningIndex, setTuningIndex] = useState(0);
  const [tuning, setTuning] = useState(convertTuningToState(tunings[0]));
  const [fretsAmount, setFretsAmount] = useState(24);
  const [selectedStringIndex, setSelectedStringIndex] = useState<number | null>(null);

  const lastIdAdded = useRef(0);

  const changeFretsAmount = (n: number) => setFretsAmount(setterRangeLimiter(n, {min: 0, max: 24}));

  const changeTuning = (n: number, i?: number) => {
    setTuning(ps => {
      let newTuningValues = [...ps.value];
      if (i === undefined) {
        newTuningValues = newTuningValues.map(v => ({
          ...v,
          value: rangeLimiter(v.value + n, ...pitchRange),
        }));
      } else
        newTuningValues[i] = {
          ...newTuningValues[i],
          value: rangeLimiter(newTuningValues[i].value + n, ...pitchRange),
        };
      return {...ps, value: newTuningValues};
    });
  };

  const removeString = (index: number) => {
    setTuning(ps => ({...ps, value: ps.value.filter((_v, i) => i !== index)}));
  };

  const addString = (higher: boolean) => {
    const id = Math.random();
    lastIdAdded.current = id;
    setTuning(ps => {
      if (higher) {
        const lastString = ps.value.at(-1)!;
        return {...ps, value: [...ps.value, {...lastString, original: null, id}]};
      }
      const firstString = ps.value[0];
      return {...ps, value: [{...firstString, original: null, id}, ...ps.value]};
    });
  };

  useEffect(() => {
    if (lastIdAdded.current) {
      const lastElementAdded = document.getElementById(lastIdAdded.current.toString());
      lastElementAdded!.scrollIntoView({behavior: 'smooth'});
      lastIdAdded.current = 0;
    }
    if (selectedStringIndex === null) {
      return setPitchRange([0, strings.length - 1]);
    }
    const from = tuning.value[selectedStringIndex].value;
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
          setTuning(convertTuningToState(e!));
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
            <AnimatePresence initial={false}>
              {tuning.value
                .reduce<TuningStateValue[]>((p, c) => [c, ...p], [])
                .map((v, i, arr) => {
                  const mirroredIndex = arr.length - 1 - i;
                  return (
                    <motion.div
                      id={v.id.toString()}
                      key={v.id}
                      style={{scrollMarginTop: 50}}
                      layoutId={v.id.toString()}
                      initial={{opacity: 0, background: '#ffffff55'}}
                      animate={{
                        opacity: [0, 0, 0, 1],
                        background: ['#ffffff55', '#ffffff55', '#ffffff22', '#ffffff00'],
                      }}
                      exit={{opacity: 0, x: '100%'}}
                      transition={{duration: 0.5, ease: [0, 1, 1, 1]}}
                    >
                      <StringDisplay
                        pitch={v}
                        key={v.id}
                        selectedIndex={selectedStringIndex}
                        setSelectedIndex={setSelectedStringIndex}
                        changeTuning={changeTuning}
                        removeString={removeString}
                        height={i + 1}
                        index={mirroredIndex}
                      />
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </div>
        </div>
        <div className={S.allStringsButtonsContainer}>
          <button
            className={S.resetButton}
            onClick={() => {
              setTuning(convertTuningToState(tunings[tuningIndex]));
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
  pitch: TuningStateValue;
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
        <NoteWithOctave pitch={pitch.value} />
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
              ...(!!pitch.original && pitch.original < pitch.value && {background: '#ff5151ad'}),
            }}
            onClick={() => changeTuning(1, index)}
          >
            <ChevronDown color='white' />
          </button>
          <button
            title='Decrease semitone'
            style={{
              transform: 'translateY(2px)',
              ...(!!pitch.original && pitch.original > pitch.value && {background: '#ff5151ad'}),
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
