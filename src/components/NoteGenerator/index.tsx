import {useContext, useEffect, useState} from 'react';
import usePitch from '../../hooks/usePitch';
import {AudioContext, AudioProps} from '../../contexts/AudioContext';
import {notes} from '../../constants/notes';
import './NoteGenerator.css';
import {AnimatePresence, motion} from 'framer-motion';
import Minus from '../../icons/Minus';
import Plus from '../../icons/Plus';
import Tick from '../../icons/Tick';

const notesAsArray = Object.values(notes);
let interval: number;

const NoteGenerator = () => {
  const {start, stop, started} = useContext(AudioContext) as AudioProps;

  const [updateFrecuency, setUpdateFrecuency] = useState<number>(5000);

  const handleUpdateFrecuency = (value: number) => {
    setUpdateFrecuency(Math.max(1_000, Math.min(value, 60_000)));
  };

  return (
    <div className='container'>
      <div className='inputContainer'>
        <label htmlFor='updateFrecuency'>Set your Interval (seconds)</label>
        <div>
          <input
            id='updateFrecuency'
            value={updateFrecuency / 1000 || ''}
            type='number'
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
      {/* {started && <Note updateFrecuency={updateFrecuency} />} */}
      {<Note updateFrecuency={updateFrecuency} />}
    </div>
  );
};

const Note = ({updateFrecuency}: {updateFrecuency: number}) => {
  const [noteToPlay, setNoteToPlay] = useState('');
  const [correct, setCorrect] = useState(false);
  const [trigger, setTrigger] = useState<object | null>(null);
  const {note: playedNote} = usePitch();

  useEffect(() => {
    if (correct) return;
    setCorrect(() => {
      if (playedNote === noteToPlay) {
        new Audio('correct.mp3').play();
        return true;
      }
      return false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playedNote, correct]);

  useEffect(() => {
    if (trigger) {
      setNoteToPlay(notesAsArray[~~(Math.random() * notesAsArray.length)]);
      setCorrect(false);
    }
  }, [trigger]);

  return (
    <div className='noteContainer'>
      <Timer triggerChange={() => setTrigger({})} updateFrecuency={updateFrecuency} />
      <div>Note to play: {noteToPlay}</div>
      <div>Your note: {playedNote}</div>
      <AnimatePresence>
        {correct && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
            <Tick />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

let ringInterval: number;

const steps = 200;
const percentageStep = 100 / steps;

const Timer = ({
  triggerChange,
  updateFrecuency,
}: {
  triggerChange: () => void;
  updateFrecuency: number;
}) => {
  const [percentage, setPercentage] = useState(100);

  const {started} = useContext(AudioContext) as AudioProps;
  useEffect(() => {
    clearInterval(interval);
    clearInterval(ringInterval);
    if (started) {
      triggerChange();

      const ringUpdateInterval = updateFrecuency / (steps * 1.5);

      ringInterval = setInterval(() => {
        setPercentage(ps => {
          if (ps > 0) return ps - percentageStep;
          setTimeout(triggerChange);
          return 100;
        });
      }, ringUpdateInterval);
    } else setPercentage(100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

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
          stroke='#ccc'
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill='none'
          strokeWidth={strokeWidth}
          stroke='#00aaff'
          strokeDasharray={circumference}
          strokeDashoffset={-dashOffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
    </div>
  );
};

export default NoteGenerator;
