import {useContext, useEffect, useState} from 'react';
import Minus from '../../../icons/Minus';
import Plus from '../../../icons/Plus';
import ProgressRing from '../../../icons/ProgressRing';
import {AudioContext, AudioProps} from '../../../contexts/AudioContext';
import {NoteGeneratorContext, NoteGeneratorProps} from '../../../contexts/NodeGeneratorContext';
import {pollRemainingTime} from '../../../helpers/timer';
import S from './Timer.module.css';

const Timer = () => {
  const {started} = useContext(AudioContext) as AudioProps;
  const {generatePitch, countdownInitialValue, setCountdownInitialValue} = useContext(
    NoteGeneratorContext,
  ) as NoteGeneratorProps;

  const [remainingMs, setRemainingMS] = useState(countdownInitialValue * 1000);

  useEffect(() => {
    setRemainingMS(countdownInitialValue * 1000);
  }, [countdownInitialValue]);

  useEffect(() => {
    if (!started) return;

    let remainingCountdownTimeProvider = pollRemainingTime(countdownInitialValue);

    const stopProvider = () => {
      setRemainingMS(countdownInitialValue * 1000);
      remainingCountdownTimeProvider.return();
    };

    const intervalId = setInterval(() => {
      const remainingMs = remainingCountdownTimeProvider.next().value!;
      if (remainingMs <= 0) {
        stopProvider();
        remainingCountdownTimeProvider = pollRemainingTime(countdownInitialValue);
        generatePitch();
        return;
      }
      setRemainingMS(remainingMs);
    }, 50);

    return () => {
      stopProvider();
      clearInterval(intervalId);
    };
  }, [started, countdownInitialValue, generatePitch]);

  const remainingPercentage = (remainingMs / (countdownInitialValue * 1000)) * 100;

  const onChangeArrowKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') setCountdownInitialValue(ps => ps + 1);
    else if (e.key === 'ArrowDown') setCountdownInitialValue(ps => ps - 1);
  };

  return (
    <div className={S.timerContainer}>
      <h3>Countdown</h3>
      <div className={S.countdownContainer}>
        <button onClick={() => setCountdownInitialValue(ps => ps - 1)} id='minus'>
          <Minus />
        </button>
        <div>
          <input
            id='updateFrecuency'
            value={!countdownInitialValue ? '' : Math.ceil(remainingMs / 1000)}
            onChange={e => {
              setCountdownInitialValue(+e.target.value || 0);
            }}
            onBlur={() => !countdownInitialValue && setCountdownInitialValue(1)}
            onKeyDown={onChangeArrowKey}
          />
          <ProgressRing percentage={remainingPercentage} />
        </div>
        <button onClick={() => setCountdownInitialValue(ps => ps + 1)} id='plus'>
          <Plus />
        </button>
      </div>
    </div>
  );
};

export default Timer;
