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
import {generateRandomIndex} from '../../helpers/tuning';
import useLocalStorage from '../../hooks/useLocalStorage';

const DEFAULT_COUNTDOWN_INITIAL_VALUE = 5;

type TPitchRangeSetter = (range: TPitchRange | ((range: TPitchRange) => TPitchRange)) => void;

export interface NoteGeneratorProps {
  generatePitch: () => void;
  pitchRange: TPitchRange;
  pitchToPlay: TPitchToPlay;
  setPitchToPlay: Dispatch<SetStateAction<TPitchToPlay>>;
  countdownInitialValue: number;
  setCountdownInitialValue: Dispatch<SetStateAction<number>>;
  /** Pass both tuple values as `null` for free mode */
  changePitchRange: TPitchRangeSetter;
}

export const NoteGeneratorContext = createContext<NoteGeneratorProps | null>(null);

const NoteGeneratorProvider: FC<PropsWithChildren> = ({children}) => {
  const {started} = useContext(AudioContext) as AudioProps;

  const [pitchRange, setPitchRange] = useState<TPitchRange>([null, null]);
  const [pitchToPlay, setPitchToPlay] = useState<number | null>(null);

  const [countdownInitialValue, setCountdownInitialValue] = useLocalStorage({
    initialValue: DEFAULT_COUNTDOWN_INITIAL_VALUE,
    storageKey: 'countdownInitialValue',
  });
  const [from, to] = pitchRange;

  const generatePitch = () =>
    setPitchToPlay(ps => {
      // can generate different octaves
      let newValue;
      do newValue = generateRandomIndex(from ?? 0, to ?? MAX_PITCH_INDEX);
      while (newValue == ps);
      return newValue;
    });

  useEffect(() => {
    if (!started) return setPitchToPlay(null);
    generatePitch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, pitchRange]);

  const changePitchRange: TPitchRangeSetter = e => {
    setPitchRange(ps => {
      const newRange: TPitchRange = e instanceof Function ? e(ps) : e;
      if (newRange[0] === null || newRange[1] === null) return [null, null];
      if (newRange[0] === ps[0] && newRange[1] === ps[1]) return ps;
      return [
        rangeLimiter(newRange[0], ...pitchRangeLimits),
        rangeLimiter(newRange[1], ...pitchRangeLimits),
      ];
    });
  };

  const setCountdownInitialValueHandler = (n: SetStateAction<number>) => {
    setCountdownInitialValue(ps =>
      rangeLimiter(n instanceof Function ? n(ps) : n, MIN_COUNTDOWN_VALUE, MAX_COUNTDOWN_VALUE),
    );
    generatePitch();
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
