import {BEAT_COUNT_MIN_VALUE, INCREMENTER_MIN_VALUE} from '@/constants';
import {MetronomeContext, MetronomeProps} from '@/contexts/MetronomeContext';
import {useContext} from 'react';
import {useTranslation} from 'react-i18next';
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

  const {t} = useTranslation('app');

  return (
    <div className={S.container}>
      <h3>{t('increasingTempo')}</h3>
      <div>
        <span>{t('by')}</span>{' '}
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
        <span>{t('every')}</span>{' '}
        <input
          value={barCountUntilIncrement}
          onChange={e => setBarCountUntilIncrement(e.target.valueAsNumber || BEAT_COUNT_MIN_VALUE)}
          type='number'
        />
        <span>{t('bars')}</span>{' '}
      </div>
      <div>
        <div>
          <input type='checkbox' checked={looped} onChange={e => setLooped(e.target.checked)} />
          <span>{t('repeatMetronomePattern')}</span>{' '}
        </div>
        <div>
          <input
            value={maxBpm}
            onChange={e => {
              setMaxBpm(e.target.valueAsNumber);
            }}
            type='number'
          />
          <span style={{cursor: 'help'}} title='Beats por minuto'>
            bpm
          </span>
        </div>
      </div>
    </div>
  );
};

export default Incrementer;
