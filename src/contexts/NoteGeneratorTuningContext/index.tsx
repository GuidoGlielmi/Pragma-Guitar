import {createContext, useMemo, useState, FC, PropsWithChildren, useContext} from 'react';
import {NoteGeneratorContext, NoteGeneratorProps} from '../NodeGeneratorContext';
import {
  pitchRangeLimits,
  tunings as defaultTunings,
  convertTuningToState,
} from '../../constants/notes';
import {rangeLimiter, setterRangeLimiter} from '../../helpers/valueRange';

export interface NoteGeneratorTuningProps {
  tuning: TuningState;
  setTuning: (i: number) => void;
  fretsAmount: number;
  changeFretsAmount: (n: number) => void;
  removeString: (id: number) => void;
  addString: (higher: boolean) => void;
  saveTuning: (name: string) => boolean;
  tunings: Tuning[];
  stringModifiedChecker: (i: number) => boolean | null;
  deleteTuning: (label: string) => void;
  incrementPitch: (i?: number) => void;
  decrementPitch: (i?: number) => void;
}

type NoteGeneratorTuningProviderProps = {children: React.ReactNode};

export const NoteGeneratorTuningContext = createContext<NoteGeneratorTuningProps | null>(null);

const PERSISTED_TUNINGS_VARIABLE_NAME = 'customTunings';

const NoteGeneratorTuningProvider: FC<PropsWithChildren<NoteGeneratorTuningProviderProps>> = ({
  children,
}) => {
  const {changePitchRange} = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const [tunings, setTunings] = useState<Tuning[]>([
    ...JSON.parse(localStorage.getItem(PERSISTED_TUNINGS_VARIABLE_NAME) || '[]'),
    ...defaultTunings,
  ]);
  const [tuning, setTuning] = useState<TuningState>(convertTuningToState(tunings[0]));
  const [fretsAmount, setFretsAmount] = useState(24);

  const changeFretsAmount = (n: number) => {
    changePitchRange(ps => [undefined, ps[1]! + n]);
    setFretsAmount(setterRangeLimiter(n, {min: 0, max: 24}));
  };

  const getOriginalTuning = () => tunings.find(t => t.label === tuning.label)!;

  const setTuningHandler = (i: number) => setTuning(convertTuningToState(tunings[i]));

  const modifyPitches = (pitches: StringStateValue[], halfStepsAmount: number, i?: number) => {
    let newPitches = JSON.parse(JSON.stringify(pitches)) as StringStateValue[];
    if (i === undefined) {
      newPitches = newPitches.map(p => ({
        ...p,
        value: rangeLimiter(p.pitch + halfStepsAmount, ...pitchRangeLimits),
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

  const createString = (pitch: number) => ({original: null, pitch, id: Math.random()});

  const addString = (higher: boolean) => {
    setTuning(ps => {
      const newPitches = [...ps.pitches];
      newPitches.splice(higher ? Infinity : 0, 0, createString(ps.pitches.at(-1)!.pitch));
      return {...ps, pitches: newPitches};
    });
  };

  const removeString = (id: number) => {
    setTuning(ps => ({...ps, pitches: ps.pitches.filter(p => p.id !== id)}));
  };

  const saveTuning = (name: string) => {
    if (tunings.some(t => t.label === name)) return false;
    const newTuning = {label: name, pitches: tuning.pitches.map(p => p.pitch)};
    setTunings(ps => [newTuning, ...ps]);
    persistTuning(newTuning);
    return true;
  };

  const persistTuning = (tuning: Tuning) => {
    localStorage.setItem(
      PERSISTED_TUNINGS_VARIABLE_NAME,
      JSON.stringify([tuning, ...getSavedTunings()]),
    );
  };

  const getSavedTunings = (): Tuning[] =>
    JSON.parse(localStorage.getItem(PERSISTED_TUNINGS_VARIABLE_NAME) || '[]');

  const deleteTuning = (label: string) => {
    if (tunings.length === 1) return;

    const originalTuning = getOriginalTuning();
    setTuning(convertTuningToState(tunings.find(t => t !== originalTuning)!));
    setTunings(ps => ps.filter(t => t !== originalTuning));

    const savedTunings = getSavedTunings();
    const originalSavedTuning = savedTunings.find(t => t.label === label);
    if (originalSavedTuning) {
      localStorage.setItem(
        PERSISTED_TUNINGS_VARIABLE_NAME,
        JSON.stringify(savedTunings.filter(t => t !== originalSavedTuning)),
      );
    }
  };

  const stringModifiedChecker = (id: number) => {
    const string = tuning.pitches.find(p => p.id === id);
    if (!string || string.original === null || string.pitch === string.original) return null;
    return string.pitch > string.original;
  };

  const contextValue = useMemo(
    () => ({
      tuning,
      setTuning: setTuningHandler,
      fretsAmount,
      incrementPitch,
      decrementPitch,
      changeFretsAmount,
      removeString,
      addString,
      saveTuning,
      getSavedTunings,
      tunings,
      stringModifiedChecker,
      deleteTuning,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tuning, fretsAmount, tunings],
  );
  return (
    <NoteGeneratorTuningContext.Provider value={contextValue}>
      {children}
    </NoteGeneratorTuningContext.Provider>
  );
};

export default NoteGeneratorTuningProvider;
