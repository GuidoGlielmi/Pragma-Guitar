import {MetronomeContext, MetronomeProps} from '@/contexts/MetronomeContext';
import {getTapContext} from '@/helpers/timer';
import {FC, PropsWithChildren, useContext, useRef} from 'react';
import {useTranslation} from 'react-i18next';

const MetronomeHeader: FC<PropsWithChildren> = ({children}) => {
  const {setBpm} = useContext(MetronomeContext) as MetronomeProps;

  const {t} = useTranslation('app');

  const tapContextRef: Readonly<React.MutableRefObject<() => number | null>> = useRef(
    getTapContext(),
  );

  return (
    <div>
      <h2>
        <span>{t('beat')}</span>
        {children}
        <button
          onClick={() => {
            setBpm(ps => tapContextRef.current() ?? ps);
          }}
        >
          {t('tap')}
        </button>
      </h2>
    </div>
  );
};

export default MetronomeHeader;
