import {useContext, useEffect, useState, useCallback, useRef} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import Select from 'react-select';
import usePitch from '../../hooks/usePitch';
import {AudioContext, AudioProps} from '../../contexts/AudioContext';
import './NoteGenerator.css';
import Minus from '../../icons/Minus';
import Plus from '../../icons/Plus';
import Tick from '../../icons/Tick';
import {notes} from '../../constants/notes';
import ArrowRight from '../../icons/ArrowRight';
import useCorrectPitch from '../../hooks/useCorrectPitch';

const NoteGenerator = () => {
  const {start, stop, started} = useContext(AudioContext) as AudioProps;

  const [updateFrecuency, setUpdateFrecuency] = useState<number>(10000);

  const handleUpdateFrecuency = (value: number) => {
    setUpdateFrecuency(ps => (value === 0 ? value : Math.max(0, Math.min(value, 60_000)) || ps));
  };

  return (
    <div className='container'>
      <div className='inputContainer'>
        <label htmlFor='updateFrecuency'>Set your Interval (seconds)</label>
        <div>
          <input
            id='updateFrecuency'
            value={updateFrecuency / 1000 || ''}
            onChange={e => {
              handleUpdateFrecuency(+e.target.value * 1000);
            }}
          />
          <div>
            <button onClick={() => handleUpdateFrecuency(updateFrecuency - 1000)}>
              <Minus />
            </button>
            <button onClick={() => handleUpdateFrecuency(updateFrecuency + 1000)}>
              <Plus />
            </button>
          </div>
        </div>
      </div>
      <button onClick={started ? stop : start}>{started ? 'Stop' : 'Start'}</button>
      {<Note updateFrecuency={updateFrecuency || 1000} />}
    </div>
  );
};

const notesArray = Object.values(notes);
const C1_NUMBER = 24;
const OCTAVES_COVERED = 8;

const strings: gtrString[] = [];
for (let octave = 0; octave <= OCTAVES_COVERED; octave++) {
  for (let noteIndex = 0; noteIndex < notesArray.length; noteIndex++) {
    const label = `${notesArray[noteIndex]}${octave}` as NoteWithOctave;
    strings.push({value: octave * 12 + noteIndex, label});
  }
}

const customStyles = {
  control: (defaultStyles: any) => ({
    ...defaultStyles,
    minWidth: 120,
    height: 30,
    minHeight: 30,
  }),
  indicatorsContainer: (provided: any, _state: any) => ({
    ...provided,
    height: 30,
    minHeight: 30,
  }),
};

const getPitchAndOctave = (pitch: number | null) => {
  if (strings[pitch!] === undefined) return ['', ''];
  return strings[pitch!].label.split(/(\d)/);
};

const Note = ({updateFrecuency}: {updateFrecuency: number}) => {
  const {started} = useContext(AudioContext) as AudioProps;

  const [pitchToPlay, setPitchToPlay] = useState<number | null>(null);
  const [trigger, setTrigger] = useState<object | null>(null);
  const [exact, setExact] = useState(false);
  const [[from, to], setPitchRange] = useState<[gtrString, gtrString]>([
    strings[0],
    strings.at(-1)!,
  ]);

  const condition = useCallback(
    (pitch: number) => {
      if (exact) {
        if (pitch === pitchToPlay) {
          return true;
        }
      } else if (
        pitch >= from.value &&
        pitch <= to.value &&
        pitchToPlay &&
        !(Math.abs(pitch - pitchToPlay) % 12)
      ) {
        return true;
      }
      return false;
    },
    [exact, pitchToPlay, from, to],
  );

  const {pitch, correct, notification} = useCorrectPitch({condition});

  useEffect(() => {
    if (correct) new Audio('correct.mp3').play();
  }, [correct]);

  useEffect(() => {
    if (!started) {
      setPitchToPlay(null);
      // setCorrect(false);
    } else {
      setTrigger({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  useEffect(() => {
    if (!trigger) return;

    const fromIndex = strings.findIndex(s => s === from);
    const toIndex = strings.findIndex(s => s === to);
    setPitchToPlay(strings[(~~(Math.random() * (toIndex - fromIndex)) || 1) + fromIndex].value);
    // setCorrect(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // console.log({pitchToPlay});

  const [noteToPlay, octaveToPlay] = getPitchAndOctave(pitchToPlay);
  const [notePlayed, octavePlayed] = getPitchAndOctave(pitch);
  const anyOctave = from === strings[0] && to === strings.at(-1) && !exact;

  return (
    <div className='noteContainer'>
      <RangeSelector
        from={from}
        to={to}
        exact={exact}
        setExact={setExact}
        setPitchRange={setPitchRange}
      />
      <Timer triggerChange={() => setTrigger({})} updateFrecuency={updateFrecuency} />
      <AnimatePresence>
        {started && (
          <motion.div
            className='mainBoard'
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 150, marginBottom: 10}}
            exit={{opacity: 0.5, height: 0, marginBottom: 0}}
          >
            <div className='notesDisplay'>
              <div className='noteToPlay'>
                <span>Play</span>
                <p style={{...(!anyOctave && {transform: 'translateX(-0.15em)'})}}>
                  <span className={`octave${anyOctave ? ' transparent' : ''}`}>{octaveToPlay}</span>
                  <span>{noteToPlay}</span>
                </p>
              </div>
              <ArrowRight />
              <div className='notePlayedContainer'>
                <span>You Played</span>
                <p>
                  <span className={`octave${anyOctave ? ' transparent' : ''}`}>{octavePlayed}</span>
                  {notePlayed}
                </p>
              </div>
            </div>
            <AnimatePresence mode='wait'>
              <motion.div
                className='result'
                key={correct ? 'tick' : 'ellipsis'}
                initial={{opacity: 0, y: -10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0}}
                transition={{duration: 0.1}}
              >
                {correct ? <Tick /> : <Ellipsis />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const animate = {x: 0, opacity: 1};

const RangeSelector = ({
  from,
  to,
  exact,
  setExact,
  setPitchRange,
}: {
  from: gtrString;
  to: gtrString;
  exact: boolean;
  setExact: React.Dispatch<React.SetStateAction<boolean>>;
  setPitchRange: React.Dispatch<React.SetStateAction<[gtrString, gtrString]>>;
}) => {
  const [overflowHidden, setOverflowHidden] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const slideForward = useRef(false);

  const options = [
    {
      title: 'On String',
      content: (
        <>
          <label htmlFor='from'>Choose a string</label>
          <Select
            id='from'
            isSearchable={false}
            styles={customStyles}
            options={strings}
            value={from}
            onChange={e => setPitchRange([e!, strings[strings.indexOf(e!) + 24]])}
          />
        </>
      ),
    },
    {
      title: 'On Note Range',
      content: (
        <div style={{display: 'flex', gap: 10}}>
          <div>
            <label htmlFor='from'>From</label>
            <Select
              id='from'
              isSearchable={false}
              styles={customStyles}
              options={strings}
              value={from}
              onChange={e => setPitchRange(ps => [e!, ps[1]])}
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
              onChange={e => setPitchRange(ps => [ps[0], e!])}
            />
          </div>
        </div>
      ),
    },
  ];

  const [buttons, sections] = options.reduce<[string[], JSX.Element[]]>(
    (p, c) => [
      [...p[0], c.title],
      [...p[1], c.content],
    ],
    [[], []],
  );

  const sectionSelectionHandler = (i: number) => {
    setOverflowHidden(true);
    setSelectedIndex(ps => {
      slideForward.current = ps !== null ? ps! > i : i === 0;
      return ps === i ? null : i;
    });
  };

  const hasSelection = selectedIndex !== null;

  return (
    <div
      className='rangeSelectorContainer'
      style={{overflow: overflowHidden ? 'hidden' : 'visible'}}
    >
      <div>
        {buttons.map((title, i) => (
          <button
            key={title}
            style={{
              ...(selectedIndex === i && {borderBottom: '1px solid #646cff', color: 'white'}),
            }}
            onClick={() => sectionSelectionHandler(i)}
          >
            {title}
          </button>
        ))}
      </div>
      <div
        style={{
          height: hasSelection ? 60 : 0,
          transition: 'height 0.2s ease',
          overflow: overflowHidden ? 'hidden' : 'visible',
        }}
        className='rangeSelectorSection'
      >
        <AnimatePresence
          initial={false}
          onExitComplete={() => {
            setOverflowHidden(false);
          }}
        >
          <motion.div
            style={{position: 'absolute', top: 0}}
            initial={{x: slideForward.current ? -200 : 200, opacity: 0}}
            transition={{type: 'spring', mass: 0.4, duration: 0.01}}
            animate={animate}
            exit={{x: slideForward.current ? -200 : 200, opacity: 0}}
            onAnimationStart={def => {
              if (def === animate) {
                setOverflowHidden(true);
              }
            }}
            key={selectedIndex}
          >
            {hasSelection ? sections[selectedIndex] : null}
          </motion.div>
        </AnimatePresence>
      </div>
      <div>
        <label htmlFor='exact'>Exact Octave</label>
        <input id='exact' type='checkbox' checked={exact} onChange={() => setExact(ps => !ps)} />
      </div>
    </div>
  );
};

export const Ellipsis = ({size = 5}) => {
  return (
    <div className='ellipsis'>
      <div style={{width: size, height: size}} />
      <div style={{width: size, height: size}} />
      <div style={{width: size, height: size}} />
    </div>
  );
};

let ringInterval: number;
let previousMs = 0;
const STEPS = 200;

const Timer = ({
  triggerChange,
  updateFrecuency,
}: {
  triggerChange: () => void;
  updateFrecuency: number;
}) => {
  const {started} = useContext(AudioContext) as AudioProps;

  const [percentage, setPercentage] = useState(100);

  const resetInterval = useCallback(() => {
    const ringUpdateInterval = updateFrecuency / STEPS;
    previousMs = new Date().getTime();
    ringInterval = setInterval(() => {
      const currentMs = new Date().getTime();
      const msPassed = currentMs - previousMs;
      previousMs = currentMs;
      setPercentage(ps => {
        if (ps > 0) return ps - (msPassed / updateFrecuency) * 100;
        setTimeout(triggerChange);
        return 100;
      });
    }, ringUpdateInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateFrecuency]);

  useEffect(() => {
    clearInterval(ringInterval);
    if (started) {
      triggerChange();
      resetInterval();
    } else setPercentage(100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  useEffect(() => {
    clearInterval(ringInterval);
    setPercentage(100);
    if (started) {
      triggerChange();
      resetInterval();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetInterval]);

  // console.log(percentage);

  const radius = 20;
  const strokeWidth = 5;
  const viewBoxSize = radius * 2 + strokeWidth * 2;
  const center = viewBoxSize / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - circumference * (percentage / 100);

  const initialCountdownValue = updateFrecuency / 1000;

  return (
    <div className='timerContainer'>
      <span>{Math.ceil(initialCountdownValue * (percentage / 100)) || initialCountdownValue}</span>
      <svg width='70' height='70' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill='none'
          strokeWidth={strokeWidth}
          stroke='#333'
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill='none'
          strokeWidth={strokeWidth}
          stroke='#646cff'
          strokeDasharray={circumference}
          strokeDashoffset={-dashOffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
    </div>
  );
};

export default NoteGenerator;

// option: (defaultStyles: any, state: any) => ({
//   ...defaultStyles,
// }),
// valueContainer: (provided: any, state: any) => ({
//   ...provided,
//   height: 30,
//   padding: 0,
// }),
// input: (provided: any, state: any) => ({
//   ...provided,
//   margin: 0,
//   padding: 0,
//   height: 20,
//   minHeight: 30,
// }),
