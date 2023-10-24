import {
  useMemo,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
  createContext,
  FC,
  PropsWithChildren,
} from 'react';
import {
  MAX_COUNTDOWN_VALUE,
  MAX_PITCH_INDEX,
  MIN_COUNTDOWN_VALUE,
  pitchRangeLimits,
} from '../../constants/notes';
import {rangeLimiter} from '../../helpers/valueRange';
import {AudioContext, AudioProps} from '../AudioContext';
import {getRandomIndexGenerator} from '../../helpers/randomIndexGenerator';
import useLocalStorage from '../../hooks/useLocalStorage';

const DEFAULT_COUNTDOWN_INITIAL_VALUE = 5;

type TPitchToPlay = number | null;
type TPitchRange = [TPitchToPlay, TPitchToPlay];
export interface NoteGeneratorProps {
  generatePitch: () => void;
  pitchRange: TPitchRange;
  pitchToPlay: TPitchToPlay;
  setPitchToPlay: Dispatch<SetStateAction<TPitchToPlay>>;
  countdownInitialValue: number;
  setCountdownInitialValue: Dispatch<SetStateAction<number>>;
  changePitchRange: PitchRangeSetter;
}
export const NoteGeneratorContext = createContext<NoteGeneratorProps | null>(null);

const NoteGeneratorProvider: FC<PropsWithChildren> = ({children}) => {
  const {started} = useContext(AudioContext) as AudioProps;

  const [pitchRange, setPitchRange] = useState<TPitchRange>([null, null]);
  const [pitchToPlay, setPitchToPlay] = useState<number | null>(null);

  const [countdownInitialValue, setCountdownInitialValue] = useLocalStorage(
    DEFAULT_COUNTDOWN_INITIAL_VALUE,
    'countdownInitialValue',
  );
  const [from, to] = pitchRange;

  const generateRandomIndex = useMemo(() => {
    return getRandomIndexGenerator(from ?? 0, to ?? MAX_PITCH_INDEX);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pitchRange]);

  const generatePitch = () => setPitchToPlay(generateRandomIndex());

  useEffect(() => {
    if (!started) return setPitchToPlay(null);
    generatePitch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, pitchRange]);

  const changePitchRange: PitchRangeSetter = e => {
    setPitchRange(ps => {
      // strings has the same length as possible pitches
      let newRange: PitchRange;
      if (e instanceof Function) {
        newRange = e([ps[0] || 0, ps[1] || MAX_PITCH_INDEX]);
      } else if (e[0] === null || e[1] === null) return [null, null];
      else newRange = e;
      return [
        newRange[0] === undefined ? ps[0] : rangeLimiter(newRange[0]!, ...pitchRangeLimits),
        newRange[1] === undefined ? ps[1] : rangeLimiter(newRange[1]!, ...pitchRangeLimits),
      ];
    });
  };

  const setCountdownInitialValueHandler = (n: SetStateAction<number>) => {
    setCountdownInitialValue(ps =>
      rangeLimiter(n instanceof Function ? n(ps) : n, MIN_COUNTDOWN_VALUE, MAX_COUNTDOWN_VALUE),
    );
  };

  const contextValue = useMemo(
    () => ({
      countdownInitialValue,
      setCountdownInitialValue: setCountdownInitialValueHandler,
      pitchRange,
      changePitchRange,
      pitchToPlay,
      setPitchToPlay,
      generatePitch,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [countdownInitialValue, pitchRange, pitchToPlay],
  );

  return (
    <NoteGeneratorContext.Provider value={contextValue}>{children}</NoteGeneratorContext.Provider>
  );
};

export default NoteGeneratorProvider;
