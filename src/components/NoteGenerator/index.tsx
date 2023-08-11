import {useContext, useEffect, useState, useCallback, useRef} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import Select from 'react-select';
import {AudioContext, AudioProps} from '../../contexts/AudioContext';
import './NoteGenerator.css';
import Minus from '../../icons/Minus';
import Plus from '../../icons/Plus';
import Tick from '../../icons/Tick';
import {notes} from '../../constants/notes';
import ArrowRight from '../../icons/ArrowRight';
import useCorrectPitch from '../../hooks/useCorrectPitch';
import ProgressRing from '../../icons/ProgressRing';
import {getFrecuencyFromPitch, getMiddleOctavePitch} from '../../helpers/pitch';
import OnboardingWrapper from '../OnboardingWrapper';
import {Step} from 'intro.js';

const steps = [
  {
    title: 'NOTE GENERATOR',
    element: '.noteContainer',
    intro:
      "This exercise trains you in pitch recognition.\n It can be used to sing over or in any instrument you want to learn the notes across its entire range. It's perfect for learning how to improvise, and even to free yourself from having to look at the fingerboard.\n The idea is to play the notes displayed on the screen as fast as you can as they appear",
  },
  {
    title: 'Toggle On/Off',
    element: '#start',
    intro: 'You can start your timer here',
    // position: 'right',
  },
  {
    element: '#rangeSelector',
    title: 'Note Range',
    intro:
      'In this section, you can select the interval between which the notes are going to appear',
    // hintPosition: 'middle-middle',
    // intro: 'test 2',
  },
  {
    title: 'Notes of a String',
    element: '#OnString',
    intro:
      'You can select any note from C0 to C8 to represent a string that will cover two whole octaves. For example, if you select E2, the range will go from E2 to E4',
  },
  {
    title: 'Custom Interval',
    element: '#OnNoteRange',
    intro: 'Or you can select any custom interval you desire',
  },
  {
    title: 'Exact Note',
    element: '#exactOctave',
    intro: 'Enabling this option forces you to play the exact note and octave',
  },
  {
    title: 'Countdown',
    element: '.timerContainer',
    intro:
      'In this section, you will see a countdown showing the time you have left to play the right note. You can choose any value you want, from 1 to 60 seconds',
  },
  {
    title: 'Subtract one Second',
    element: '#minus',
    intro: 'You can subtract seconds one by one...',
  },
  {
    title: 'Add one Second',
    element: '#plus',
    intro: 'Add them one by one...',
  },
  {
    title: 'Exact Octave',
    element: '#updateFrecuency',
    intro: 'Or enter any value in this box',
  },
  {
    title: "Up and at 'em!",
    element: '#start',
    intro: 'Now let\'s do a little demonstration by pressing the "Start" button...',
  },
  {
    title: 'Your Note to Play',
    element: '.noteToPlay',
    intro:
      'This box will show you the generated note for you to play. You can also press it to hear what it sounds like',
  },
  {
    title: 'Note you Played',
    element: '.notePlayedContainer',
    intro:
      'And this box shows you what you are playing. \n Come on! whistle a little to see how it goes...',
  },
] as Step[];

const NoteGenerator = () => {
  const {start, stop, source} = useContext(AudioContext) as AudioProps;

  const [updateFrecuency, setUpdateFrecuency] = useState<number>(10000);

  const handleUpdateFrecuency = (value: number) => {
    setUpdateFrecuency(ps => {
      const newValue = value === 0 ? value : Math.max(0, Math.min(value, 60_000)) || ps;
      return newValue;
    });
  };

  return (
    <OnboardingWrapper steps={steps} stepsToUpdate={source ? [9, 10, 11, 12] : undefined}>
      <div className='container'>
        <button onClick={source ? stop : start} id='start'>
          {source ? 'Stop' : 'Start'}
        </button>
        <Note updateFrecuency={updateFrecuency} handleUpdateFrecuency={handleUpdateFrecuency} />
      </div>
    </OnboardingWrapper>
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
  option: (provided: any, _state: any) => ({
    ...provided,
    color: '#333',
  }),
};

const getPitchAndOctave = (pitch: number | null) => {
  if (strings[pitch!] === undefined) return ['', ''];
  return strings[pitch!].label.split(/(\d)/);
};

const initialPitchRange = [strings[0], strings.at(-1)!] as [gtrString, gtrString];

const Note = ({
  handleUpdateFrecuency,
  updateFrecuency,
}: {
  handleUpdateFrecuency: (value: number) => void;
  updateFrecuency: number;
}) => {
  const {source, startOscillator, stopOscillator} = useContext(AudioContext) as AudioProps;

  const [pitchToPlay, setPitchToPlay] = useState<number | null>(null);
  const [pitchTrigger, setPitchTrigger] = useState<object | null>(null);
  const [countdownTrigger, setCountdownTrigger] = useState<object | null>(null);
  const [exact, setExact] = useState(false);
  const [pitchRange, setPitchRange] = useState<[gtrString, gtrString]>(initialPitchRange);
  const [from, to] = pitchRange;

  const condition = useCallback(
    (pitch: number) => {
      if (exact) {
        if (pitch === pitchToPlay) return true;
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

  const {pitch, correct} = useCorrectPitch({condition});

  useEffect(() => {
    if (correct) new Audio('correct.mp3').play();
  }, [correct]);

  useEffect(() => {
    if (!source) {
      setPitchToPlay(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  useEffect(() => {
    if (!source) return;

    const fromIndex = strings.findIndex(s => s === from);
    const toIndex = strings.findIndex(s => s === to);
    setPitchToPlay(strings[(~~(Math.random() * (toIndex - fromIndex)) || 1) + fromIndex].value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pitchTrigger, source, updateFrecuency, from, to]);

  const triggerPitch = () => setPitchTrigger({});
  const triggerCountdown = () => setCountdownTrigger({});

  useEffect(() => {
    if (pitchRange === initialPitchRange) return;
    triggerCountdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

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
      <Timer
        triggerPitch={triggerPitch}
        countdownTrigger={countdownTrigger}
        updateFrecuency={updateFrecuency}
        handleUpdateFrecuency={handleUpdateFrecuency}
      />
      <AnimatePresence>
        {source && (
          <motion.div
            className='mainBoard'
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 160, marginBottom: 10}}
            exit={{opacity: 0.5, height: 0, marginBottom: 0}}
          >
            <div className='notesDisplay'>
              <button
                title='Press to listen'
                className='noteToPlay button'
                onMouseDown={() => {
                  const pitch = anyOctave
                    ? getMiddleOctavePitch(pitchToPlay || 0)
                    : pitchToPlay || 0;
                  startOscillator(getFrecuencyFromPitch(pitch));
                }}
                onMouseUp={() => stopOscillator()}
              >
                <span>Play</span>
                <p style={{...(!anyOctave && {transform: 'translateX(-0.15em)'})}}>
                  <span className={`octave${anyOctave ? ' transparent' : ''}`}>{octaveToPlay}</span>
                  <span>{noteToPlay}</span>
                </p>
              </button>
              <ArrowRight />
              <div className='notePlayedContainer'>
                <span>You Played</span>
                <p>
                  <span className={`octave${anyOctave ? ' transparent' : ''}`}>{octavePlayed}</span>
                  {notePlayed}
                </p>
              </div>
            </div>
            <AnimatePresence>
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
        <div id='customNoteRange' style={{display: 'flex', gap: 10}}>
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
      id='rangeSelector'
      className='rangeSelectorContainer'
      style={{overflow: overflowHidden ? 'hidden' : 'visible'}}
    >
      <h3>Play Note</h3>
      <div>
        {buttons.map((title, i) => (
          <button
            id={title.replaceAll(/ /g, '')}
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
      <div id='exactOctave'>
        <label htmlFor='exact'>Exact Note</label>
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
  triggerPitch,
  countdownTrigger,
  updateFrecuency,
  handleUpdateFrecuency,
}: {
  triggerPitch: () => void;
  countdownTrigger: object | null;
  updateFrecuency: number;
  handleUpdateFrecuency: (value: number) => void;
}) => {
  const {source} = useContext(AudioContext) as AudioProps;

  const [percentage, setPercentage] = useState(100);

  const resetInterval = useCallback(
    () => {
      clearInterval(ringInterval);
      setPercentage(100);
      if (!source) return;

      const ringUpdateInterval = updateFrecuency / STEPS;
      executeAtInterval(msPassed => {
        setPercentage(ps => {
          return ps - (msPassed / updateFrecuency) * 100;
        });
      }, ringUpdateInterval);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateFrecuency, source],
  );

  useEffect(() => {
    if (percentage <= 0) {
      setPercentage(100);
      triggerPitch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage]);

  useEffect(() => {
    resetInterval();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetInterval, source, countdownTrigger]);

  const initialCountdownValue = updateFrecuency / 1000;

  return (
    <div className='timerContainer'>
      <h3>Countdown</h3>
      <div className='countdownContainer'>
        <button onClick={() => handleUpdateFrecuency(updateFrecuency - 1000)} id='minus'>
          <Minus />
        </button>
        <div>
          <input
            id='updateFrecuency'
            value={
              !updateFrecuency
                ? ''
                : Math.ceil(initialCountdownValue * (percentage / 100)) || initialCountdownValue
            }
            onChange={e => {
              handleUpdateFrecuency(+e.target.value * 1000);
            }}
            onBlur={() => !updateFrecuency && handleUpdateFrecuency(1000)}
          />
          <ProgressRing percentage={percentage} />
        </div>
        <button onClick={() => handleUpdateFrecuency(updateFrecuency + 1000)} id='plus'>
          <Plus />
        </button>
      </div>
    </div>
  );
};

export default NoteGenerator;

const executeAtInterval = (fn: (msPassed: number) => void, delay = 50) => {
  previousMs = new Date().getTime();
  ringInterval = setInterval(() => {
    const currentMs = new Date().getTime();
    const msPassed = currentMs - previousMs;
    previousMs = currentMs;
    fn(msPassed);
  }, delay);
};

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
