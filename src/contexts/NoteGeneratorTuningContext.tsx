import {
  DEFAULT_FRETS_AMOUNT,
  PERSISTED_FRET_AMOUNT_VARIABLE_NAME,
  PERSISTED_PREFERRED_TUNING_VARIABLE_NAME,
  PERSISTED_TUNINGS_VARIABLE_NAME,
  defaultTunings,
  tunings,
} from '@/constants';
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {fretsLimiterStateAction, pitchValueLimiter} from '../helpers/limiter';
import {convertTuningToState, createString, createTuning} from '../helpers/notes';
import {getHighestPitch, getLowestPitch} from '../helpers/tuning';
import useLocalStorageWithValue from '../hooks/useLocalStorageWithValue';
import {NoteGeneratorContext, NoteGeneratorProps} from './NoteGeneratorContext';

export interface NoteGeneratorTuningProps {
  tuning: ITuningState;
  setTuning: (label: string) => void;
  /**
   * Resets a tuning to its last save state
   */
  reset: () => void;
  fretsAmount: number;
  selectedStringId: TPitchToPlay;
  setSelectedStringId: (id: TPitchToPlay) => void;
  decrementFretsAmount: () => void;
  incrementFretsAmount: () => void;
  removeString: (id: number) => void;
  /**
   * @param higher Flag indicating if it's to be added as first or last string
   */
  addString: (higher: boolean) => void;
  /**
   * Returns flag indicating if save was successfull
   * @returns Flag indicating if save was successfull
   */
  saveTuning: (label: string) => boolean;
  tunings: ITuning[];
  /**
   * @returns `null` if not modified. `true` if it's higher, `false` if lower
   */
  stringModifiedChecker: (i: number) => boolean | null;
  /**
   * Deletes a tuning and sets the first one with a different id it encounters
   * It can delete a hard-coded one, but it re-appears on page load
   */
  deleteTuning: (label: string) => void;
  /**
   * Increases or decreases a half step to the string with passed id, and to all if not passed
   * @param higher Flag indicating to increase pitch if `true` and to decrease otherwise
   */
  modifyPitch: (higher: boolean, id?: number) => void;
}

type NoteGeneratorTuningProviderProps = {children: React.ReactNode};

export const NoteGeneratorTuningContext = createContext<NoteGeneratorTuningProps | null>(null);

const NoteGeneratorTuningProvider: FC<PropsWithChildren<NoteGeneratorTuningProviderProps>> = ({
  children,
}) => {
  const {changePitchRange, changeHigherPitch} = useContext(
    NoteGeneratorContext,
  ) as NoteGeneratorProps;

  const [persistedTunings, setPersistedTunings] = useLocalStorageWithValue<
    ITuning[],
    IPersistedTuning[]
  >(PERSISTED_TUNINGS_VARIABLE_NAME, {
    getter: t => (t ?? []).map(t => ({...t, deletable: true})),
    setter: t => (t || []).map(t => ({...t, deletable: undefined})), // JSON.stringify ignores undefined
    initialValue: [],
  });

  const [fretsAmount, setFretsAmount] = useLocalStorageWithValue(
    PERSISTED_FRET_AMOUNT_VARIABLE_NAME,
    {
      initialValue: DEFAULT_FRETS_AMOUNT,
    },
  );

  const [selectedStringId, setSelectedStringId] = useState<TPitchToPlay>(null);

  const getAllTunings = () => [...persistedTunings, ...tunings];

  const [tuning, setTuning] = useLocalStorageWithValue<ITuningState, string>(
    PERSISTED_PREFERRED_TUNING_VARIABLE_NAME,
    {
      getter: label =>
        convertTuningToState(getAllTunings().find(t => t.label === label) ?? getAllTunings()[0]),
      setter: t => t?.label || '',
      initialValue: convertTuningToState(defaultTunings[0]),
    },
  );

  const changeFretsAmount = (amountToAdd: number) => {
    setFretsAmount(fretsLimiterStateAction(amountToAdd));
  };
  const incrementFretsAmount = () => changeFretsAmount(1);
  const decrementFretsAmount = () => changeFretsAmount(-1);

  const getTuningState = (label: string) => {
    return convertTuningToState(getAllTunings().find(t => t.label === label)!);
  };

  const setTuningHandler = (label: string) => setTuning(getTuningState(label));

  const reset = () => setTuning(ps => getTuningState(ps.label));

  /**
   * Modifies the pitch for all strings or the one that has the specified id
   */
  const modifyPitches = (
    strings: StringStateValue[],
    halfStepsAmount: number,
    stringId?: number,
  ) => {
    if (stringId === undefined) {
      return strings.map(s => ({
        ...s,
        pitch: pitchValueLimiter(s.pitch + halfStepsAmount),
      }));
    }
    return strings.map(s => ({
      ...s,
      pitch: s.id === stringId ? pitchValueLimiter(s.pitch + halfStepsAmount) : s.pitch,
    }));
  };

  const modifyPitch = (higher: boolean, id?: number) => {
    const pitchAmount = higher ? 1 : -1;
    setTuning(ps => ({...ps, strings: modifyPitches(ps.strings, pitchAmount, id)}));
    if (id !== undefined && id === selectedStringId) changeHigherPitch(ps => ps + pitchAmount);
  };

  const addString = (higher: boolean) => {
    setTuning(ps => {
      const newPitch = createString(ps.strings[higher ? ps.strings.length - 1 : 0].pitch);
      return {
        ...ps,
        strings: higher ? [...ps.strings, newPitch] : [newPitch, ...ps.strings],
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
      modifyPitch,
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
