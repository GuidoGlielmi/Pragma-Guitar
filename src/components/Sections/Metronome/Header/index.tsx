import {MetronomeContext, MetronomeProps} from '@/contexts/MetronomeContext';
import {getTapContext} from '@/helpers/timer';
import useTranslation from '@/hooks/useTranslation';
import {FC, PropsWithChildren, useContext, useRef} from 'react';

const MetronomeHeader: FC<PropsWithChildren> = ({children}) => {
  const {setBpm} = useContext(MetronomeContext) as MetronomeProps;

  const [beatString, tapString] = useTranslation(['beat', 'tap']);

  const tapContextRef: Readonly<React.MutableRefObject<() => number | null>> = useRef(
    getTapContext(),
  );

  return (
    <div>
      <h2>
        <span>{beatString}</span>
        {children}
        <button
          onClick={() => {
            setBpm(ps => tapContextRef.current() ?? ps);
          }}
        >
          {tapString}
        </button>
      </h2>
    </div>
  );
};

export default MetronomeHeader;
