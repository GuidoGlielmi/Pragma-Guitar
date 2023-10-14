import {
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
  createContext,
  FC,
  PropsWithChildren,
} from 'react';
import {strings} from '../../constants/notes';

const DEFAULT_COUNTDOWN_INITIAL_VALUE = 5;

type TPitchRange = [gtrString | null, gtrString | null];
type TPitchToPlay = number | null;

export interface NoteGeneratorProps {
  generatePitch: () => void;
  pitchRange: TPitchRange;
  setPitchRange: Dispatch<SetStateAction<TPitchRange>>;
  pitchToPlay: TPitchToPlay;
  setPitchToPlay: Dispatch<SetStateAction<TPitchToPlay>>;
  countdownInitialValue: number;
  setCountdownInitialValue: Dispatch<SetStateAction<number>>;
}
export const NoteGeneratorContext = createContext<NoteGeneratorProps | null>(null);

const NoteGeneratorProvider: FC<PropsWithChildren> = ({children}) => {
  const [pitchRange, setPitchRange] = useState<[gtrString | null, gtrString | null]>([null, null]);
  const [pitchToPlay, setPitchToPlay] = useState<number | null>(null);
  const [countdownInitialValue, setCountdownInitialValue] = useState(
    DEFAULT_COUNTDOWN_INITIAL_VALUE,
  );
  const [from, to] = pitchRange;

  const generatePitch = () => {
    const fromIndex = strings.indexOf(from || strings[0]);
    const toIndex = strings.indexOf(to || strings.at(-1)!);
    const getRandomIndex = () => (~~(Math.random() * (toIndex - fromIndex)) || 1) + fromIndex;
    setPitchToPlay(ps => {
      let randomIndex: number;
      do randomIndex = getRandomIndex();
      while (strings[randomIndex].value === ps);
      return strings[randomIndex].value;
    });
  };

  const contextValue = useMemo(
    () => ({
      countdownInitialValue,
      setCountdownInitialValue,
      pitchRange,
      setPitchRange,
      pitchToPlay,
      setPitchToPlay,
      generatePitch,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pitchRange, pitchToPlay],
  );

  return (
    <NoteGeneratorContext.Provider value={contextValue}>{children}</NoteGeneratorContext.Provider>
  );
};

export default NoteGeneratorProvider;
