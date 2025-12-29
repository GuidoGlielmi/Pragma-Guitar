import {AudioContext, AudioProps} from '@/contexts/AudioContext';
import {useContext, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

const StartButton = () => {
  const {start, stop, started} = useContext(AudioContext) as AudioProps;

  const {t} = useTranslation('app');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Enter' && (started ? stop : start)();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return (
    <button onClick={started ? stop : start} id='start'>
      {started ? t('stop') : t('start')}
    </button>
  );
};
export default StartButton;
