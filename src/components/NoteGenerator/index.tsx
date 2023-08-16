import {useContext, useEffect, useState, useCallback, useRef} from 'react';
import {AnimatePresence} from 'framer-motion';
import {AudioContext, AudioProps} from '../../contexts/AudioContext';
import './NoteGenerator.css';
import Minus from '../../icons/Minus';
import Plus from '../../icons/Plus';
import {strings} from '../../constants/notes';
import ProgressRing from '../../icons/ProgressRing';
import OnboardingWrapper from '../OnboardingWrapper';
import {noteGenerator} from '../../constants/steps';
import useCorrectPitch from '../../hooks/useCorrectPitch';
import RangeSelector from './NoteRange';
import Notes from './Notes';
import {rangeLimiter} from '../../helpers/valueRange';

const NoteGenerator = () => {
  const {started} = useContext(AudioContext) as AudioProps;

  return (
    <OnboardingWrapper steps={noteGenerator} stepsToUpdate={started ? [9, 10, 11, 12] : undefined}>
      <div className='container'>
        <Note />
      </div>
    </OnboardingWrapper>
  );
};

const initialPitchRange = [strings[0], strings.at(-1)!] as [gtrString, gtrString];

const Note = () => {
  const {started} = useContext(AudioContext) as AudioProps;

  const [pitchToPlay, setPitchToPlay] = useState<number | null>(null);
  const [pitchTrigger, setPitchTrigger] = useState<object | null>(null);
  const [countdownTrigger, setCountdownTrigger] = useState<object | null>(null);
  const [pitchRange, setPitchRange] = useState<[gtrString, gtrString]>(initialPitchRange);
  const [from, to] = pitchRange;

  const [updateFrecuency, setUpdateFrecuency] = useState<number>(5000);

  const handleUpdateFrecuency = (value: number) => {
    setUpdateFrecuency(ps => {
      const newValue = value === 0 ? value : Math.max(0, Math.min(value, 60_000)) || ps;
      return newValue;
    });
  };

  const condition = useCallback(
    (pitch: number) => {
      if (from !== strings[0] || to !== strings.at(-1)) {
        if (pitch === pitchToPlay) return true;
      } else if (pitchToPlay && !(Math.abs(pitch - pitchToPlay) % 12)) {
        return true;
      }
      return false;
    },
    [pitchToPlay, from, to],
  );

  const {pitch, correct, currStreak, maxStreak} = useCorrectPitch({condition});

  useEffect(() => {
    if (correct) {
      new Audio('/audio/correct.mp3').play();
    }
  }, [correct]);

  useEffect(() => {
    if (!started) setPitchToPlay(null);
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const fromIndex = strings.indexOf(from);
    const toIndex = strings.indexOf(to);
    const getRandomIndex = () => (~~(Math.random() * (toIndex - fromIndex)) || 1) + fromIndex;
    setPitchToPlay(ps => {
      let randomIndex: number;
      do {
        randomIndex = getRandomIndex();
      } while (strings[randomIndex].value === ps);
      return strings[randomIndex].value;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pitchTrigger, started, updateFrecuency, from, to]);

  const triggerPitch = () => setPitchTrigger({});
  const triggerCountdown = () => setCountdownTrigger({});

  useEffect(() => {
    if (pitchRange === initialPitchRange) return;
    triggerCountdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  const changePitchRange: PitchRangeSetter = e => {
    setPitchRange(ps => [
      e[0] === undefined ? ps[0] : strings[rangeLimiter(e[0], 0, 127)],
      e[1] === undefined ? ps[1] : strings[rangeLimiter(e[1], 0, 127)],
    ]);
  };

  const anyOctave = from === strings[0] && to === strings.at(-1);

  return (
    <>
      <div className='noteContainer'>
        <RangeSelector from={from} to={to} setPitchRange={changePitchRange} />
        <Timer
          triggerPitch={triggerPitch}
          countdownTrigger={countdownTrigger}
          updateFrecuency={updateFrecuency}
          handleUpdateFrecuency={handleUpdateFrecuency}
        />
        <AnimatePresence>
          {started && (
            <Notes
              pitch={pitch}
              pitchToPlay={pitchToPlay}
              correct={correct}
              anyOctave={anyOctave}
              currStreak={currStreak}
            />
          )}
        </AnimatePresence>
      </div>
      {!!maxStreak && <div>Best streak: {maxStreak}</div>}
    </>
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
  const {started} = useContext(AudioContext) as AudioProps;

  const [percentage, setPercentage] = useState(100);

  const resetInterval = useCallback(() => {
    clearInterval(ringInterval);
    setPercentage(100);
    if (!started) return;

    const ringUpdateInterval = updateFrecuency / STEPS;
    executeAtInterval(msPassed => {
      setPercentage(ps => {
        return ps - (msPassed / updateFrecuency) * 100;
      });
    }, ringUpdateInterval);
  }, [updateFrecuency, started]);

  useEffect(() => {
    if (percentage <= 0) {
      setPercentage(100);
      triggerPitch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage]);

  useEffect(() => {
    resetInterval();
  }, [resetInterval, started, countdownTrigger]);

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
