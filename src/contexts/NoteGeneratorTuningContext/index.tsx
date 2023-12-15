import {
  createContext,
  useState,
  useMemo,
  FC,
  PropsWithChildren,
  useEffect,
  useContext,
} from 'react';
import {
  pitchRangeLimits,
  staticTunings,
  convertTuningToState,
  createString,
  createTuning,
} from '../../constants/notes';
import {rangeLimiter, addToPrevValueRangeLimiterStateAction} from '../../helpers/valueRange';
import useLocalStorage from '../../hooks/useLocalStorage';
import {NoteGeneratorContext, NoteGeneratorProps} from '../NodeGeneratorContext';
import {getHighestPitch, getLowestPitch} from '../../helpers/tuning';

const tunings = staticTunings.map(t => ({...t, deletable: false}));

export interface NoteGeneratorTuningProps {
  tuning: ITuningState;
  setTuning: (label: string) => void;
  reset: () => void;
  fretsAmount: number;
  selectedStringId: TPitchToPlay;
  setSelectedStringId: (id: TPitchToPlay) => void;
  decrementFretsAmount: () => void;
  incrementFretsAmount: () => void;
  removeString: (id: number) => void;
  addString: (higher: boolean) => void;
  saveTuning: (label: string) => boolean;
  tunings: ITuning[];
  stringModifiedChecker: (i: number) => boolean | null;
  deleteTuning: (label: string) => void;
  incrementPitch: (i?: number) => void;
  decrementPitch: (i?: number) => void;
}

type NoteGeneratorTuningProviderProps = {children: React.ReactNode};

export const NoteGeneratorTuningContext = createContext<NoteGeneratorTuningProps | null>(null);

const PERSISTED_TUNINGS_VARIABLE_NAME = 'customTunings';
const PERSISTED_FRET_AMOUNT_VARIABLE_NAME = 'fretsAmount';
const PERSISTED_PREFERRED_TUNING_VARIABLE_NAME = 'preferredTuning';
const MAX_FRETS_AMOUNT = 50;
const DEFAULT_FRETS_AMOUNT = 24;

const NoteGeneratorTuningProvider: FC<PropsWithChildren<NoteGeneratorTuningProviderProps>> = ({
  children,
}) => {
  const {changePitchRange} = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const [persistedTunings, setPersistedTunings] = useLocalStorage<ITuning[], IPersistedTuning[]>(
    PERSISTED_TUNINGS_VARIABLE_NAME,
    {
      getter: t => (t ?? []).map(t => ({...t, deletable: true})),
      setter: t => t.map(t => ({...t, deletable: undefined})),
    },
  );

  const [fretsAmount, setFretsAmount] = useLocalStorage(PERSISTED_FRET_AMOUNT_VARIABLE_NAME, {
    initialValue: DEFAULT_FRETS_AMOUNT,
  });

  const [selectedStringId, setSelectedStringId] = useState<TPitchToPlay>(null);

  const getAllTunings = () => [...persistedTunings, ...tunings];

  const [tuning, setTuning] = useLocalStorage<ITuningState, string>(
    PERSISTED_PREFERRED_TUNING_VARIABLE_NAME,
    {
      getter: label =>
        convertTuningToState(getAllTunings().find(t => t.label === label) ?? getAllTunings()[0]),
      setter: t => t.label,
    },
  );

  const changeFretsAmount = (amountToAdd: number) => {
    setFretsAmount(
      addToPrevValueRangeLimiterStateAction(amountToAdd, {min: 0, max: MAX_FRETS_AMOUNT}),
    );
  };

  const incrementFretsAmount = () => changeFretsAmount(1);
  const decrementFretsAmount = () => changeFretsAmount(-1);

  const setTuningHandler = (label: string) =>
    setTuning(convertTuningToState(getAllTunings().find(t => t.label === label)!));

  const reset = () => {
    setTuning(ps => convertTuningToState(getAllTunings().find(t => t.label === ps.label)!));
  };

  const modifyPitches = (pitches: StringStateValue[], halfStepsAmount: number, id?: number) => {
    let newStrings = JSON.parse(JSON.stringify(pitches)) as StringStateValue[];
    if (id === undefined) {
      newStrings = newStrings.map(p => ({
        ...p,
        pitch: rangeLimiter(p.pitch + halfStepsAmount, ...pitchRangeLimits),
      }));
    } else {
      const foundIndex = newStrings.findIndex(s => s.id === id);
      newStrings[foundIndex].pitch = rangeLimiter(
        newStrings[foundIndex].pitch + halfStepsAmount,
        ...pitchRangeLimits,
      );
    }
    return newStrings;
  };

  const incrementPitch = (id?: number) => {
    setTuning(ps => ({...ps, strings: modifyPitches(ps.strings, 1, id)}));
  };

  const decrementPitch = (id?: number) => {
    setTuning(ps => ({...ps, strings: modifyPitches(ps.strings, -1, id)}));
  };

  const addString = (higher: boolean) => {
    setTuning(ps => {
      const newPitch = createString(ps.strings[higher ? ps.strings.length - 1 : 0].pitch);
      return {
        ...ps,
        strings: [...(higher ? [] : [newPitch]), ...ps.strings, ...(higher ? [newPitch] : [])],
      };
    });
  };

  const removeString = (id: number) => {
    setTuning(ps => ({...ps, strings: ps.strings.filter(p => p.id !== id)}));
  };

  const saveTuning = (label: string) => {
    if (tunings.some(t => t.label === label)) return false;
    const newTuning = createTuning(label, tuning.strings);
    setPersistedTunings(ps => [newTuning, ...ps.filter(t => t.label !== label)]);
    setTuning(ps => ({...ps, label}));
    return true;
  };

  const deleteTuning = (label: string) => {
    const originalTuning = persistedTunings.find(t => t.label === label)!;
    setTuning(convertTuningToState(getAllTunings().find(t => t !== originalTuning)!));
    setPersistedTunings(ps => ps.filter(t => t !== originalTuning));
  };

  const stringModifiedChecker = (id: number) => {
    const string = tuning.strings.find(p => p.id === id);
    return !string || string.originalPitch === null || string.pitch === string.originalPitch
      ? null
      : string.pitch > string.originalPitch;
  };

  const setSelectedStringIdHandler = (id: TPitchToPlay) =>
    setSelectedStringId(ps => (ps === id ? null : id));

  useEffect(() => {
    const selectedString = tuning.strings.find(p => p.id === selectedStringId);
    if (!selectedString) {
      changePitchRange([getLowestPitch(tuning), getHighestPitch(tuning) + fretsAmount]);
      setSelectedStringId(null);
    } else changePitchRange([selectedString.pitch, selectedString.pitch + fretsAmount]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tuning, fretsAmount, selectedStringId]);

  const contextValue = useMemo(
    () => ({
      tuning,
      setTuning: setTuningHandler,
      reset,
      fretsAmount,
      incrementFretsAmount,
      decrementFretsAmount,
      incrementPitch,
      decrementPitch,
      removeString,
      addString,
      saveTuning,
      selectedStringId,
      setSelectedStringId: setSelectedStringIdHandler,
      tunings: getAllTunings(),
      stringModifiedChecker,
      deleteTuning,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tuning, fretsAmount, persistedTunings, selectedStringId],
  );
  return (
    <NoteGeneratorTuningContext.Provider value={contextValue}>
      {children}
    </NoteGeneratorTuningContext.Provider>
  );
};

export default NoteGeneratorTuningProvider;
