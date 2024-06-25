import {maxBPM} from '@/constants/notes';
import {AudioContext, AudioProps} from '@/contexts/AudioContext';
import {MetronomeContext, MetronomeProps} from '@/contexts/MetronomeContext';
import {rangeLimiter} from '@/helpers/valueRange';
import useTranslation from '@/hooks/useTranslation';
import {useContext, useEffect, useRef, useState} from 'react';
import S from './Incrementer.module.css';

const INCREMENTER_MIN_VALUE = 0;
const BEAT_COUNT_MIN_VALUE = 1;
const BEAT_COUNT_INITIAL_VALUE = 0;

const Incrementer = ({position}: {position: number}) => {
  const {started} = useContext(AudioContext) as AudioProps;
  const {bpm, setBpm, setNextBpm} = useContext(MetronomeContext) as MetronomeProps;
  const [byString, everyString, repeatMetronomePatternString, barsString, increasingTempoString] =
    useTranslation(['by', 'every', 'repeatMetronomePattern', 'bars', 'increasingTempo']);
  const initialBpmRef = useRef(bpm);

  const [incrementer, setIncrementer] = useState(INCREMENTER_MIN_VALUE);
  const [maxBpm, setMaxBpm] = useState(bpm);
  const [repeat, setRepeat] = useState(false);
  const beatCountRef = useRef(BEAT_COUNT_INITIAL_VALUE);

  const [targetBeatCount, setTargetBeatCount] = useState(BEAT_COUNT_MIN_VALUE);

  useEffect(() => {
    if (started) initialBpmRef.current = bpm;
    else setBpm(initialBpmRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  useEffect(() => {
    if (repeat && !started) setMaxBpm(ps => Math.max(ps, bpm));
  }, [started, repeat, bpm]);

  useEffect(() => {
    if (position === 0) {
      if (beatCountRef.current === targetBeatCount - 1) {
        const nextValue = bpm + incrementer;
        setNextBpm(repeat && nextValue > maxBpm ? initialBpmRef.current : nextValue);
        beatCountRef.current = BEAT_COUNT_INITIAL_VALUE;
      } else beatCountRef.current += 1;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  return (
    <div className={S.container}>
      <h3>{increasingTempoString}</h3>
      <div>
        <span>{byString}</span>{' '}
        <input
          value={incrementer}
          onChange={e =>
            setIncrementer(
              Math.max(INCREMENTER_MIN_VALUE, e.target.valueAsNumber || INCREMENTER_MIN_VALUE),
            )
          }
          type='number'
        />
        <span>bmp</span>{' '}
      </div>
      <div>
        <span>{everyString}</span>{' '}
        <input
          value={targetBeatCount}
          onChange={e =>
            setTargetBeatCount(
              Math.max(BEAT_COUNT_MIN_VALUE, e.target.valueAsNumber || BEAT_COUNT_MIN_VALUE),
            )
          }
          type='number'
        />
        <span>{barsString}</span>{' '}
      </div>
      <div>
        <div>
          <input
            style={{width: 'min-content', marginRight: 10}}
            type='checkbox'
            checked={repeat}
            onChange={e => setRepeat(e.target.checked)}
          />
          <span>{repeatMetronomePatternString}</span>{' '}
        </div>
        <input
          value={maxBpm}
          onChange={e => {
            return setMaxBpm(
              rangeLimiter(
                e.target.valueAsNumber || 120,
                !started ? bpm : initialBpmRef.current,
                maxBPM,
              ),
            );
          }}
          type='number'
        />
        <span>bmp</span>{' '}
      </div>
    </div>
  );
};

export default Incrementer;
