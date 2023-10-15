import {
  createContext,
  useMemo,
  useState,
  FC,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useContext,
} from 'react';
import {NoteGeneratorContext, NoteGeneratorProps} from '../NodeGeneratorContext';
import {pitchRangeLimits, tunings as defaultTunings} from '../../constants/notes';
import {rangeLimiter, setterRangeLimiter} from '../../helpers/valueRange';

export interface NoteGeneratorTuningProps {
  tuning: Tuning;
  setTuning: (i: number) => void;
  fretsAmount: number;
  changeFretsAmount: (n: number) => void;
  selectedStringIndex: number | null;
  setSelectedStringIndex: Dispatch<SetStateAction<number | null>>;
  changeTuning: (n: number, i?: number) => void;
  removeString: (index: number) => void;
  addString: (higher: boolean) => void;
  saveTuning: (name: string) => void;
  getSavedTunings: () => Tuning[];
  tunings: Tuning[];
  stringModifiedChecker: (i: number) => boolean | null;
}
type NoteGeneratorTuningProviderProps = {children: React.ReactNode};

export const NoteGeneratorTuningContext = createContext<NoteGeneratorTuningProps | null>(null);

const NoteGeneratorTuningProvider: FC<PropsWithChildren<NoteGeneratorTuningProviderProps>> = ({
  children,
}) => {
  const {changePitchRange} = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const [tunings, setTunings] = useState<Tuning[]>([
    ...JSON.parse(localStorage.getItem('customTunings') || '[]'),
    ...defaultTunings,
  ]);
  const [tuning, setTuning] = useState<Tuning>(tunings[0]);
  const [fretsAmount, setFretsAmount] = useState(24);
  const [selectedStringIndex, setSelectedStringIndex] = useState<number | null>(null);

  const lastIdAdded = useRef(0);

  const changeFretsAmount = (n: number) => setFretsAmount(setterRangeLimiter(n, {min: 0, max: 24}));

  const setTuningHandler = (i: number) => setTuning(tunings[i]);

  const changeTuning = (n: number, i?: number) => {
    setTuning(ps => {
      let newPitches = [...ps.pitches];
      if (i === undefined) {
        newPitches = newPitches.map(v => rangeLimiter(v + n, ...pitchRangeLimits));
      } else newPitches[i] = rangeLimiter(newPitches[i] + n, ...pitchRangeLimits);
      return {...ps, pitches: newPitches};
    });
  };

  const removeString = (index: number) => {
    setTuning(ps => ({...ps, pitches: ps.pitches.filter((_v, i) => i !== index)}));
  };

  const addString = (higher: boolean) => {
    const id = Math.random();
    lastIdAdded.current = id;
    setTuning(ps => {
      if (higher) {
        const lastString = ps.pitches.at(-1)!;
        return {...ps, pitches: [...ps.pitches, lastString]};
      }
      const firstString = ps.pitches[0];
      return {...ps, pitches: [firstString, ...ps.pitches]};
    });
  };

  const saveTuning = (name: string) => {
    const newTuning = {label: name, pitches: tuning.pitches};
    setTunings(ps => [newTuning, ...ps]);
    setTuning(newTuning);
    persistTuning(newTuning);
  };

  const persistTuning = (tuning: Tuning) => {
    const savedTunings = JSON.parse(localStorage.getItem('customTunings') || '[]');
    localStorage.setItem('customTunings', JSON.stringify([...savedTunings, tuning]));
  };

  const getSavedTunings = () => JSON.parse(localStorage.getItem('customTunings') || '[]');

  const stringModifiedChecker = (i: number) => {
    const originalTuning = tunings.find(t => t.label === tuning.label);
    return tuning.pitches[i] === originalTuning?.pitches[i]
      ? null
      : tuning.pitches[i] > originalTuning?.pitches[i]!;
  };

  useEffect(() => {
    if (lastIdAdded.current) {
      const lastElementAdded = document.getElementById(lastIdAdded.current.toString());
      lastElementAdded!.scrollIntoView({behavior: 'smooth'});
      lastIdAdded.current = 0;
    }
    const from = tuning.pitches[selectedStringIndex ?? 0];
    const at = (selectedStringIndex === null ? tuning.pitches.at(-1)! : from) + fretsAmount;
    changePitchRange([from, at]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tuning, selectedStringIndex, fretsAmount]);

  const contextValue = useMemo(
    () => ({
      tuning,
      setTuning: setTuningHandler,
      fretsAmount,
      selectedStringIndex,
      setSelectedStringIndex,
      changeFretsAmount,
      changeTuning,
      removeString,
      addString,
      saveTuning,
      getSavedTunings,
      tunings,
      stringModifiedChecker,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tuning, fretsAmount, selectedStringIndex, tunings],
  );
  return (
    <NoteGeneratorTuningContext.Provider value={contextValue}>
      {children}
    </NoteGeneratorTuningContext.Provider>
  );
};

export default NoteGeneratorTuningProvider;
