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
import {pitchRangeLimits, strings} from '../../constants/notes';
import {rangeLimiter} from '../../helpers/valueRange';
import {AudioContext, AudioProps} from '../AudioContext';
import {getRandomIndexGenerator} from '../../helpers/randomIndexGenerator';

const DEFAULT_COUNTDOWN_INITIAL_VALUE = 5;
const MIN_COUNTDOWN_VALUE = 0;
const MAX_COUNTDOWN_VALUE = 99;

type TPitchRange = [gtrString | null, gtrString | null];
type TPitchToPlay = number | null;
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

  const [pitchRange, setPitchRange] = useState<[gtrString | null, gtrString | null]>([null, null]);
  const [pitchToPlay, setPitchToPlay] = useState<number | null>(null);
  const [countdownInitialValue, setCountdownInitialValue] = useState(
    DEFAULT_COUNTDOWN_INITIAL_VALUE,
  );
  const [from, to] = pitchRange;

  const generateRandomIndex = useMemo(() => {
    console.log({from: pitchRange[0]?.label, to: pitchRange[1]?.label});
    const fromIndex = strings.indexOf(from || strings[0]);
    const toIndex = strings.indexOf(to || strings.at(-1)!);
    return getRandomIndexGenerator(fromIndex, toIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pitchRange]);

  const generatePitch = () => setPitchToPlay(strings[generateRandomIndex()].value);

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
        newRange = e([ps[0]?.value || 0, ps[1]?.value || strings.at(-1)!.value]);
      } else if (e[0] === null || e[1] === null) return [null, null];
      else newRange = e;
      console.log(ps[0], newRange[0], strings[rangeLimiter(newRange[0]!, ...pitchRangeLimits)]);
      return [
        newRange[0] === undefined
          ? ps[0]
          : strings[rangeLimiter(newRange[0]!, ...pitchRangeLimits)],
        newRange[1] === undefined
          ? ps[1]
          : strings[rangeLimiter(newRange[1]!, ...pitchRangeLimits)],
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
