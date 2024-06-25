import {MetronomeContext, MetronomeProps} from '@/contexts/MetronomeContext';
import useTap from '@/hooks/useTap';
import useTranslation from '@/hooks/useTranslation';
import {useContext, useEffect} from 'react';

const Header = () => {
  const {bpmInput, setBpm} = useContext(MetronomeContext) as MetronomeProps;

  const [tapButton, tappedBpm] = useTap();

  useEffect(() => {
    if (tappedBpm) setBpm(tappedBpm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tappedBpm]);
  const [beatString] = useTranslation('beat');

  return (
    <div>
      <h2>
        <span>{beatString}</span>
        {bpmInput}
        {tapButton}
      </h2>
    </div>
  );
};

export default Header;
