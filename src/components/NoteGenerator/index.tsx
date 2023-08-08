import {useContext, useEffect, useState, useCallback} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import Select from 'react-select';
import usePitch from '../../hooks/usePitch';
import {AudioContext, AudioProps} from '../../contexts/AudioContext';
import './NoteGenerator.css';
import Minus from '../../icons/Minus';
import Plus from '../../icons/Plus';
import Tick from '../../icons/Tick';
import {notes} from '../../constants/notes';

const notesAsArray = Object.values(notes);

const NoteGenerator = () => {
  const {start, stop, started} = useContext(AudioContext) as AudioProps;

  const [updateFrecuency, setUpdateFrecuency] = useState<number>(5000);

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
const OCTAVES_COVERED = 6;

const strings: gtrString[] = [{value: 0, label: 'Any'}];
for (let noteIndex = 0; noteIndex < notesArray.length; noteIndex++) {
  for (let octave = 1; octave <= OCTAVES_COVERED; octave++) {
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

const Note = ({updateFrecuency}: {updateFrecuency: number}) => {
  const {started} = useContext(AudioContext) as AudioProps;

  const {note, noteNumber} = usePitch();

  const [noteToPlay, setNoteToPlay] = useState('');
  const [trigger, setTrigger] = useState<object | null>(null);
  const [playedNote, setPlayedNote] = useState<Note | null>(note);
  const [selectedString, setSelectedString] = useState<gtrString>(strings[0]);

  useEffect(() => {
    if (playedNote === null) {
      const openStringNoteNumber = selectedString!.value;
      if (note === noteToPlay && noteNumber >= openStringNoteNumber) {
        new Audio('correct.mp3').play();
        setPlayedNote(note);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]);

  useEffect(() => {
    if (!started) {
      setNoteToPlay('');
      return;
    }
    if (trigger) {
      setNoteToPlay(notesAsArray[~~(Math.random() * notesAsArray.length)]);
      setPlayedNote(null);
    }
  }, [trigger, started]);

  return (
    <div className='noteContainer'>
      <Timer triggerChange={() => setTrigger({})} updateFrecuency={updateFrecuency} />
      <div>
        <span>Choose a string</span>
        <Select
          isSearchable={false}
          styles={customStyles}
          options={strings}
          value={selectedString}
          onChange={e => setSelectedString(e!)}
        />
      </div>
      <div>
        Note to play:{' '}
        <div className='noteToPlay' style={started ? {} : {background: 'transparent'}}>
          {noteToPlay}
        </div>
      </div>
      <div>Your note: {playedNote || note}</div>
      <AnimatePresence>
        {started && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 60}}
            exit={{opacity: 0, height: 0}}
          >
            <AnimatePresence mode='wait'>
              <motion.div
                className='result'
                key={playedNote ? 'tick' : 'ellipsis'}
                initial={{opacity: 0, y: -10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0}}
                transition={{duration: 0.1}}
              >
                {playedNote ? <Tick /> : <Ellipsis />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
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
      <svg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'>
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
