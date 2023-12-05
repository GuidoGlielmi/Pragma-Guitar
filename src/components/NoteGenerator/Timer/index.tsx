import {useContext, useEffect, useState} from 'react';
import Minus from '../../../icons/Minus';
import Plus from '../../../icons/Plus';
import ProgressRing from '../../../icons/ProgressRing';
import {AudioContext, AudioProps} from '../../../contexts/AudioContext';
import {NoteGeneratorContext, NoteGeneratorProps} from '../../../contexts/NodeGeneratorContext';
import {pollRemainingTime} from '../../../helpers/timer';
import S from './Timer.module.css';
import useTranslation from '../../../hooks/useTranslation';

const Timer = () => {
  const {started} = useContext(AudioContext) as AudioProps;
  const {generatePitch, countdownInitialValue, setCountdownInitialValue} = useContext(
    NoteGeneratorContext,
  ) as NoteGeneratorProps;

  const [remainingMs, setRemainingMS] = useState(countdownInitialValue * 1000);

  const [countdownString] = useTranslation('Countdown');

  useEffect(() => {
    setRemainingMS(countdownInitialValue * 1000);
  }, [countdownInitialValue]);

  useEffect(() => {
    if (!started) return;

    let remainingCountdownTimeProvider = pollRemainingTime(countdownInitialValue);

    const reset = () => {
      setRemainingMS(countdownInitialValue * 1000);
      remainingCountdownTimeProvider.return();
    };

    const intervalId = setInterval(() => {
      const remainingMs = remainingCountdownTimeProvider.next().value!;
      if (remainingMs > 0) return setRemainingMS(remainingMs);
      reset();
      remainingCountdownTimeProvider = pollRemainingTime(countdownInitialValue);
      generatePitch();
    }, 50);

    return () => {
      reset();
      clearInterval(intervalId);
    };
  }, [started, countdownInitialValue, generatePitch]);

  const remainingPercentage = (remainingMs / (countdownInitialValue * 1000)) * 100;

  const decreaseCountdownInitialValue = () => {
    setCountdownInitialValue(ps => (ps === 1 ? ps : ps - 1));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') setCountdownInitialValue(ps => ps + 1);
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') decreaseCountdownInitialValue();
  };

  return (
    <div id='timerContainer' className={S.timerContainer}>
      <h3>{countdownString}</h3>
      <div className={S.countdownContainer}>
        <button onClick={decreaseCountdownInitialValue} id='minus'>
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
            onKeyDown={onKeyDown}
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
