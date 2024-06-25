import Metronome from '@/components/Sections/Metronome';
import {minBPM, maxBPM} from '@/constants/notes';
import useNumberInput from '@/hooks/useNumberInput';
import {createContext, useMemo, FC, PropsWithChildren, SetStateAction, useState} from 'react';

export interface MetronomeProps {
  bpmInput: JSX.Element;
  bpm: number;
  setBpm: (value: SetStateAction<number>) => void;
  nextBpm: number;
  setNextBpm: React.Dispatch<SetStateAction<number>>;
}
type MetronomeProviderProps = {children: React.ReactNode};

export const MetronomeContext = createContext<MetronomeProps | null>(null);

const MetronomeProvider: FC<PropsWithChildren<MetronomeProviderProps>> = () => {
  const [nextBpm, setNextBpm] = useState(0);

  const {
    input,
    value: bpm,
    changeHandler: setBpm,
  } = useNumberInput({min: minBPM, max: maxBPM, initialValue: 120});

  const contextValue = useMemo(
    () => ({
      bpmInput: input,
      bpm,
      setBpm,
      nextBpm,
      setNextBpm,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nextBpm, bpm],
  );
  return (
    <MetronomeContext.Provider value={contextValue}>
      <Metronome />
    </MetronomeContext.Provider>
  );
};

export default MetronomeProvider;
