import {AudioContext, AudioProps} from '@/contexts/AudioContext';
import useTranslation from '@/hooks/useTranslation';
import {useContext, useEffect} from 'react';

const StartButton = () => {
  const {start, stop, started} = useContext(AudioContext) as AudioProps;

  const [startString, stopString] = useTranslation(['start', 'stop']);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Enter' && (started ? stop : start)();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return (
    <button onClick={started ? stop : start} id='start'>
      {started ? stopString : startString}
    </button>
  );
};
export default StartButton;
