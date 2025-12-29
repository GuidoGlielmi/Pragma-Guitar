import {COUNTER_FPS} from '@/constants';
import {AudioContext, AudioProps} from '@/contexts/AudioContext';
import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NoteGeneratorContext';
import {pollRemainingTime} from '@/helpers/timer';
import MinusIcon from '@/icons/Minus';
import PlusIcon from '@/icons/Plus';
import ProgressRing from '@/icons/ProgressRing';
import {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import S from './Timer.module.css';

const Timer = () => {
  const {started} = useContext(AudioContext) as AudioProps;
  const {
    generatePitch,
    countdownInitialValue,
    stepCountdownInitialValue,
    setCountdownInitialValue,
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const {t} = useTranslation('app');

  const [remainingMs, setRemainingMS] = useState(countdownInitialValue * 1000);

  useEffect(() => {
    setRemainingMS(countdownInitialValue * 1000);
  }, [countdownInitialValue]);

  useEffect(() => {
    if (!started) return;

    let remainingCountdownTimeProvider = pollRemainingTime(countdownInitialValue);

    const reset = () => {
      setRemainingMS(countdownInitialValue * 1000);
      remainingCountdownTimeProvider.return(0);
    };

    const intervalId = setInterval(() => {
      const remainingMs = remainingCountdownTimeProvider.next().value;
      if (remainingMs > 0) return setRemainingMS(remainingMs);

      reset();
      remainingCountdownTimeProvider = pollRemainingTime(countdownInitialValue);
      generatePitch();
    }, COUNTER_FPS);

    return () => {
      reset();
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, countdownInitialValue]);

  const remainingPercentage = (remainingMs / (countdownInitialValue * 1000)) * 100;

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') stepCountdownInitialValue(true);
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') stepCountdownInitialValue(false);
  };

  return (
    <div id='timerContainer' className={S.timerContainer}>
      <h3>{t('countdown')}</h3>
      <div className={S.countdownContainer}>
        <button onClick={() => stepCountdownInitialValue(false)} id='minus'>
          <MinusIcon />
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
        <button onClick={() => stepCountdownInitialValue(true)} id='plus'>
          <PlusIcon />
        </button>
      </div>
    </div>
  );
};

export default Timer;
