import {BEAT_COUNT_MIN_VALUE, INCREMENTER_MIN_VALUE} from '@/constants';
import {MetronomeContext, MetronomeProps} from '@/contexts/MetronomeContext';
import useTranslation from '@/hooks/useTranslation';
import {useContext} from 'react';
import S from './Incrementer.module.css';

const Incrementer = () => {
  const {
    maxBpm,
    setMaxBpm,
    incrementBy,
    setIncrementBy,
    setLooped,
    setBarCountUntilIncrement,
    looped,
    barCountUntilIncrement,
  } = useContext(MetronomeContext) as MetronomeProps;

  const [byString, everyString, repeatMetronomePatternString, barsString, increasingTempoString] =
    useTranslation(['by', 'every', 'repeatMetronomePattern', 'bars', 'increasingTempo']);

  return (
    <div className={S.container}>
      <h3>{increasingTempoString}</h3>
      <div>
        <span>{byString}</span>{' '}
        <input
          value={incrementBy}
          onChange={e => setIncrementBy(e.target.valueAsNumber || INCREMENTER_MIN_VALUE)}
          type='number'
        />
        <span style={{cursor: 'help'}} title='Beats por minuto'>
          bpm
        </span>{' '}
      </div>
      <div>
        <span>{everyString}</span>{' '}
        <input
          value={barCountUntilIncrement}
          onChange={e => setBarCountUntilIncrement(e.target.valueAsNumber || BEAT_COUNT_MIN_VALUE)}
          type='number'
        />
        <span>{barsString}</span>{' '}
      </div>
      <div>
        <div>
          <input
            style={{width: 'min-content'}}
            type='checkbox'
            checked={looped}
            onChange={e => setLooped(e.target.checked)}
          />
          <span>{repeatMetronomePatternString}</span>{' '}
        </div>
        <input
          value={maxBpm}
          onChange={e => {
            setMaxBpm(e.target.valueAsNumber);
          }}
          type='number'
        />
        <span style={{cursor: 'help'}} title='Beats por minuto'>
          bpm
        </span>{' '}
      </div>
    </div>
  );
};

export default Incrementer;
