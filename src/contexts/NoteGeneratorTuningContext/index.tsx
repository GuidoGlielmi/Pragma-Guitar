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
import {
  convertTuningToState,
  pitchRangeLimits,
  tunings as defaultTunings,
} from '../../constants/notes';
import {rangeLimiter, setterRangeLimiter} from '../../helpers/valueRange';

export interface NoteGeneratorTuningProps {
  tuningIndex: number;
  setTuningIndex: Dispatch<SetStateAction<number>>;
  tuning: TuningState;
  setTuning: Dispatch<SetStateAction<TuningState>>;
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
}
type NoteGeneratorTuningProviderProps = {children: React.ReactNode};

export const NoteGeneratorTuningContext = createContext<NoteGeneratorTuningProps | null>(null);

const NoteGeneratorTuningProvider: FC<PropsWithChildren<NoteGeneratorTuningProviderProps>> = ({
  children,
}) => {
  const {changePitchRange} = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const [tuningIndex, setTuningIndex] = useState(0);
  const [tuning, setTuning] = useState(convertTuningToState(defaultTunings[0]));
  const [tunings, setTunings] = useState([
    ...JSON.parse(localStorage.getItem('customTunings') || '[]'),
    ...defaultTunings,
  ]);
  const [fretsAmount, setFretsAmount] = useState(24);
  const [selectedStringIndex, setSelectedStringIndex] = useState<number | null>(null);

  const lastIdAdded = useRef(0);

  const changeFretsAmount = (n: number) => setFretsAmount(setterRangeLimiter(n, {min: 0, max: 24}));

  const changeTuning = (n: number, i?: number) => {
    setTuning(ps => {
      let newTuningValues = [...ps.pitches];
      if (i === undefined) {
        newTuningValues = newTuningValues.map(v => ({
          ...v,
          value: rangeLimiter(v.value + n, ...pitchRangeLimits),
        }));
      } else
        newTuningValues[i] = {
          ...newTuningValues[i],
          value: rangeLimiter(newTuningValues[i].value + n, ...pitchRangeLimits),
        };
      return {...ps, pitches: newTuningValues};
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
        return {...ps, pitches: [...ps.pitches, {...lastString, original: null, id}]};
      }
      const firstString = ps.pitches[0];
      return {...ps, pitches: [{...firstString, original: null, id}, ...ps.pitches]};
    });
  };

  const saveTuning = (name: string) => {
    const newTuning = {label: name, pitches: tuning.pitches.map(p => p.value)};
    setTunings(ps => [newTuning, ...ps]);
    persistTuning(newTuning);
  };

  const persistTuning = (tuning: Tuning) => {
    const savedTunings = JSON.parse(localStorage.getItem('customTunings') || '[]');
    localStorage.setItem(
      'customTunings',
      JSON.stringify([...savedTunings, {label: name, pitches: tuning.pitches}]),
    );
  };

  const getSavedTunings = () => JSON.parse(localStorage.getItem('customTunings') || '[]');

  useEffect(() => {
    if (lastIdAdded.current) {
      const lastElementAdded = document.getElementById(lastIdAdded.current.toString());
      lastElementAdded!.scrollIntoView({behavior: 'smooth'});
      lastIdAdded.current = 0;
    }
    const from = tuning.pitches[selectedStringIndex ?? 0].value;
    const at = (selectedStringIndex === null ? tuning.pitches.at(-1)!.value : from) + fretsAmount;
    changePitchRange([from, at]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tuning, selectedStringIndex, fretsAmount]);

  const contextValue = useMemo(
    () => ({
      tuningIndex,
      setTuningIndex,
      tuning,
      setTuning,
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
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tuningIndex, tuning, fretsAmount, selectedStringIndex, tunings],
  );
  return (
    <NoteGeneratorTuningContext.Provider value={contextValue}>
      {children}
    </NoteGeneratorTuningContext.Provider>
  );
};

export default NoteGeneratorTuningProvider;
