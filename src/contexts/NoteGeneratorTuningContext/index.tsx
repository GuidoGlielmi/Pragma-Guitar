import {createContext, useMemo, useState, FC, PropsWithChildren, useContext} from 'react';
import {NoteGeneratorContext, NoteGeneratorProps} from '../NodeGeneratorContext';
import {
  pitchRangeLimits,
  tunings,
  convertTuningToState,
  createString,
  createTuning,
} from '../../constants/notes';
import {rangeLimiter, setterRangeLimiter} from '../../helpers/valueRange';
import useLocalStorage from '../../hooks/useLocalStorage';

export interface NoteGeneratorTuningProps {
  tuning: TuningState;
  setTuning: (i: number) => void;
  reset: () => void;
  fretsAmount: number;
  changeFretsAmount: (n: number) => void;
  removeString: (id: number) => void;
  addString: (higher: boolean) => void;
  saveTuning: (label: string) => boolean;
  tunings: Tuning[];
  stringModifiedChecker: (i: number) => boolean | null;
  deleteTuning: (label: string) => void;
  incrementPitch: (i?: number) => void;
  decrementPitch: (i?: number) => void;
}

type NoteGeneratorTuningProviderProps = {children: React.ReactNode};

export const NoteGeneratorTuningContext = createContext<NoteGeneratorTuningProps | null>(null);

const PERSISTED_TUNINGS_VARIABLE_NAME = 'customTunings';
const PERSISTED_FRET_AMOUNT_VARIABLE_NAME = 'fretsAmount';
const MAX_FRETS_AMOUNT = 24;

const NoteGeneratorTuningProvider: FC<PropsWithChildren<NoteGeneratorTuningProviderProps>> = ({
  children,
}) => {
  const {changePitchRange} = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const [persistedTunings, setPersistedTunings] = useLocalStorage<Tuning[], PersistableTuning[]>(
    [],
    PERSISTED_TUNINGS_VARIABLE_NAME,
    tunings =>
      tunings.map(t => {
        const {deletable, ...props} = t;
        return props;
      }),
  );

  const getAllTunings = () => [...persistedTunings, ...tunings];

  const [fretsAmount, setFretsAmount] = useLocalStorage(
    MAX_FRETS_AMOUNT,
    PERSISTED_FRET_AMOUNT_VARIABLE_NAME,
  );
  const [tuning, setTuning] = useState<TuningState>(convertTuningToState(getAllTunings()[0]));

  const changeFretsAmount = (n: number) => {
    changePitchRange(ps => [undefined, ps[1]! + n]);
    setFretsAmount(setterRangeLimiter(n, {min: 0, max: MAX_FRETS_AMOUNT}));
  };

  const setTuningHandler = (i: number) => setTuning(convertTuningToState(getAllTunings()[i]));
  const reset = () => {
    setTuning(ps => {
      const originalTuning = getAllTunings().find(t => t.label === ps.label)!;
      return {
        ...ps,
        pitches: originalTuning.pitches.map((op, oi) => ({
          id:
            ps.pitches.find(p => p.originalPitch === op && p.originalIndex === oi)?.id ||
            Math.random(),
          pitch: op,
          originalPitch: op,
          originalIndex: oi,
        })),
      };
    });
  };

  const modifyPitches = (pitches: StringStateValue[], halfStepsAmount: number, i?: number) => {
    let newPitches = JSON.parse(JSON.stringify(pitches)) as StringStateValue[];
    if (i === undefined) {
      newPitches = newPitches.map(p => ({
        ...p,
        pitch: rangeLimiter(p.pitch + halfStepsAmount, ...pitchRangeLimits),
      }));
    } else
      newPitches[i].pitch = rangeLimiter(
        newPitches[i].pitch + halfStepsAmount,
        ...pitchRangeLimits,
      );
    return newPitches;
  };

  const incrementPitch = (i?: number) => {
    setTuning(ps => ({...ps, pitches: modifyPitches(ps.pitches, 1, i)}));
  };

  const decrementPitch = (i?: number) => {
    setTuning(ps => ({...ps, pitches: modifyPitches(ps.pitches, -1, i)}));
  };

  const addString = (higher: boolean) => {
    setTuning(ps => {
      const newPitch = createString(
        higher ? ps.pitches.at(-1)!.pitch : ps.pitches[0].pitch,
        higher ? ps.pitches.at(-1)!.originalIndex + 1 : ps.pitches[0].originalIndex - 1,
      );
      return {
        ...ps,
        pitches: [...(higher ? [] : [newPitch]), ...ps.pitches, ...(higher ? [newPitch] : [])],
      };
    });
  };

  const removeString = (id: number) => {
    setTuning(ps => ({...ps, pitches: ps.pitches.filter(p => p.id !== id)}));
  };

  const saveTuning = (label: string) => {
    if (tunings.some(t => t.label === label)) return false;
    const newTuning = createTuning(label, tuning.pitches);
    setPersistedTunings(ps => [newTuning, ...ps.filter(t => t.label !== label)]);
    setTuning(ps => ({...ps, pitches: ps.pitches.map(p => ({...p, original: p.pitch}))}));
    return true;
  };

  const deleteTuning = (label: string) => {
    const originalTuning = persistedTunings.find(t => t.label === label)!;
    setTuning(convertTuningToState(getAllTunings().find(t => t !== originalTuning)!));
    setPersistedTunings(ps => ps.filter(t => t !== originalTuning));
  };

  const stringModifiedChecker = (id: number) => {
    const string = tuning.pitches.find(p => p.id === id);
    if (!string || string.originalPitch === null || string.pitch === string.originalPitch)
      return null;
    return string.pitch > string.originalPitch;
  };

  const contextValue = useMemo(
    () => ({
      tuning,
      setTuning: setTuningHandler,
      reset,
      fretsAmount,
      incrementPitch,
      decrementPitch,
      changeFretsAmount,
      removeString,
      addString,
      saveTuning,
      tunings: [
        ...persistedTunings.map(t => ({...t, deletable: true})),
        ...tunings.map(t => ({...t, deletable: false})),
      ],
      stringModifiedChecker,
      deleteTuning,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tuning, fretsAmount, persistedTunings],
  );
  return (
    <NoteGeneratorTuningContext.Provider value={contextValue}>
      {children}
    </NoteGeneratorTuningContext.Provider>
  );
};

export default NoteGeneratorTuningProvider;
