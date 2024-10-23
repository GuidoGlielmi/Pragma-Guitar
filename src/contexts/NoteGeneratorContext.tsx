import OnboardingWrapper from '@/components/OnboardingWrapper';
import NoteGenerator from '@/components/Sections/NoteGenerator';
import {
  DEFAULT_COUNTDOWN_INITIAL_VALUE,
  MAX_PITCH_INDEX,
  PERSISTED_COUNTDOWN_INITIAL_VALUE_VARIABLE_NAME,
  PERSISTED_MAX_STREAKS_VARIABLE_NAME,
} from '@/constants';
import {noteGenerator} from '@/constants/steps';
import useCorrectPitch from '@/hooks/useCorrectPitch';
import useInitialBufferLoad from '@/hooks/useInitialBufferLoad';
import useLocalStorage from '@/hooks/useLocalStorage';
import {Section} from '@/routes';
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import {countdownValueLimiter, valueLimiter} from '../helpers/limiter';
import {generateRandomIndex} from '../helpers/tuning';
import {AudioContext, AudioProps, audioEcosystem} from './AudioContext';

const initialState = {
  currStreak: 0,
  maxStreaks: [] as number[],
  correct: false,
  pitchToPlay: null as TPitchToPlay,
  pitchRange: [null, null] as TPitchRange,
  countdownInitialValue: DEFAULT_COUNTDOWN_INITIAL_VALUE,
};

function reducer(
  prevState: typeof initialState,
  action: TNoteGeneratorAction,
): typeof initialState {
  if (action.type === 'TOGGLE_START') {
    return {
      ...prevState,
      correct: false,
      pitchToPlay: action.payload ? generatePitch() : null,
    };
  }
  if (action.type === 'SET_CORRECT') {
    if (prevState.correct === false) {
      // only going from `false` to `true`
      const storedMaxStreak = prevState.maxStreaks[prevState.countdownInitialValue];
      const newCurrStreak = prevState.currStreak + 1;
      const maxStreaks = [...prevState.maxStreaks];
      if ((storedMaxStreak || 0) < newCurrStreak)
        maxStreaks[prevState.countdownInitialValue] = newCurrStreak;
      return {
        ...prevState,
        correct: true,
        currStreak: newCurrStreak,
        maxStreaks,
      };
    }
    return prevState;
  }
  if (action.type === 'SET_MAX_STREAKS') {
    return {
      ...prevState,
      maxStreaks: action.payload,
    };
  }
  if (action.type === 'SET_PITCH_TO_PLAY') {
    return setPitch();
  }
  if (action.type === 'SET_PITCH_RANGE') {
    return {
      ...setPitch(),
      pitchRange: getPitchRange(action.payload),
    };
  }
  if (action.type === 'SET_LOW_PITCH_RANGE') {
    return {
      ...setPitch(),
      pitchRange: getPitchRange([
        action.payload instanceof Function
          ? action.payload(prevState.pitchRange[0] ?? 0)
          : action.payload,
        prevState.pitchRange[1] ?? MAX_PITCH_INDEX,
      ]),
    };
  }
  if (action.type === 'SET_HIGH_PITCH_RANGE') {
    return {
      ...setPitch(),
      pitchRange: getPitchRange([
        prevState.pitchRange[1] ?? 0,
        action.payload instanceof Function
          ? action.payload(prevState.pitchRange[1] ?? MAX_PITCH_INDEX)
          : action.payload,
      ]),
    };
  }
  if (action.type === 'SET_COUNTDOWN_INITIAL_VALUE') {
    return setCountdownInitialValue(action.payload);
  }
  if (action.type === 'INCREASE_COUNTDOWN_INITIAL_VALUE') {
    return setCountdownInitialValue(prevState.countdownInitialValue + 1);
  }
  if (action.type === 'DECREASE_COUNTDOWN_INITIAL_VALUE') {
    return setCountdownInitialValue(prevState.countdownInitialValue - 1);
  }

  function setPitch(value?: TPitchToPlay) {
    if (value === null) return {...prevState, correct: false, pitchToPlay: null};
    return {
      ...prevState,
      pitchToPlay: generatePitch(),
      correct: false,
    };
  }

  function setCountdownInitialValue(value: number) {
    return {
      ...setPitch(),
      currStreak: 0,
      countdownInitialValue: countdownValueLimiter(value),
    };
  }

  function getPitchRange(e: TPitchRangeSetterArgs): TPitchRange {
    const newRange: TPitchRange =
      e instanceof Function
        ? e([prevState.pitchRange[0] ?? 0, prevState.pitchRange[1] ?? MAX_PITCH_INDEX])
        : e;
    if (newRange[0] === null || newRange[1] === null) return [null, null];
    if (newRange[0] > newRange[1]) return prevState.pitchRange;
    if (newRange[0] === prevState.pitchRange[0] && newRange[1] === prevState.pitchRange[1])
      return prevState.pitchRange;
    return [
      valueLimiter(newRange[0], 0, newRange[1]),
      valueLimiter(newRange[1], newRange[0], MAX_PITCH_INDEX),
    ];
  }

  function generatePitch() {
    let newValue;
    do
      newValue = generateRandomIndex(
        prevState.pitchRange[0] ?? 0,
        prevState.pitchRange[1] ?? MAX_PITCH_INDEX,
      );
    while (newValue == prevState.pitchToPlay);
    return newValue;
  }

  throw new Error('Invalid action');
}

export interface NoteGeneratorProps {
  pitchRange: TPitchRange;
  /** Re-generated when {@link countdownInitialValue} or {@link pitchRange} changes */
  pitchToPlay: TPitchToPlay;
  countdownInitialValue: number;
  setCountdownInitialValue: (n: number) => void;
  increaseCountdownInitialValue: () => void;
  decreaseCountdownInitialValue: () => void;
  /** Pass both tuple values as `null` for free mode */
  changePitchRange: TPitchRangeSetter;
  generatePitch: () => void;
  changeLowerPitch: (v: React.SetStateAction<number>) => void;
  changeHigherPitch: (v: React.SetStateAction<number>) => void;
  /** Reset when changing {@link countdownInitialValue} */
  currStreak: number;
  /** One for each {@link countdownInitialValue}, which works as its indexes  */
  maxStreaks: number[];
  /** Reset when changing {@link pitchToPlay} */
  correct: boolean;
}

export const NoteGeneratorContext = createContext<NoteGeneratorProps | null>(null);

const NoteGeneratorProvider: FC<PropsWithChildren> = () => {
  const {started} = useContext(AudioContext) as AudioProps;
  const correctNoteAudio = useInitialBufferLoad('/audio/correct.mp3');
  const [
    {countdownInitialValue, pitchRange, pitchToPlay, maxStreaks, currStreak, correct},
    dispatch,
  ] = useReducer(reducer, initialState);

  const [from, to] = pitchRange;

  useLocalStorage(PERSISTED_COUNTDOWN_INITIAL_VALUE_VARIABLE_NAME, countdownInitialValue, {
    initialGetter: v => dispatch({payload: v, type: 'SET_COUNTDOWN_INITIAL_VALUE'}),
  });

  useCorrectPitch({
    target: pitchToPlay,
    exactOctave: from !== null && to !== null,
    cb: () => dispatch({type: 'SET_CORRECT'}),
    extraDependencies: [countdownInitialValue],
  });

  useLocalStorage<number[]>(PERSISTED_MAX_STREAKS_VARIABLE_NAME, maxStreaks, {
    initialGetter: v => dispatch({payload: v, type: 'SET_MAX_STREAKS'}),
  });

  useEffect(() => {
    dispatch({type: 'TOGGLE_START', payload: started === Section.NOTE_GENERATOR}); // <-------- starts here
  }, [started, pitchRange]);

  useEffect(() => {
    if (correct && !!correctNoteAudio) audioEcosystem.playBuffer(correctNoteAudio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correct]);

  const changePitchRange: TPitchRangeSetter = e => {
    dispatch({type: 'SET_PITCH_RANGE', payload: e});
  };

  const setCountdownInitialValue = (n: number) => {
    dispatch({type: 'SET_COUNTDOWN_INITIAL_VALUE', payload: n});
  };

  const changeLowerPitch = (value: React.SetStateAction<number>) => {
    dispatch({payload: value, type: 'SET_LOW_PITCH_RANGE'});
  };

  const changeHigherPitch = (value: React.SetStateAction<number>) => {
    dispatch({payload: value, type: 'SET_HIGH_PITCH_RANGE'});
  };

  const generatePitch = () => {
    dispatch({type: 'SET_PITCH_TO_PLAY'});
  };

  const increaseCountdownInitialValue = () => {
    dispatch({type: 'INCREASE_COUNTDOWN_INITIAL_VALUE'});
  };
  const decreaseCountdownInitialValue = () => {
    dispatch({type: 'DECREASE_COUNTDOWN_INITIAL_VALUE'});
  };

  const contextValue = useMemo(
    () => ({
      countdownInitialValue,
      setCountdownInitialValue,
      increaseCountdownInitialValue,
      decreaseCountdownInitialValue,
      pitchRange,
      changePitchRange,
      pitchToPlay,
      generatePitch,
      changeLowerPitch,
      changeHigherPitch,
      currStreak,
      maxStreaks,
      correct,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [countdownInitialValue, pitchRange, pitchToPlay, correct, currStreak, maxStreaks],
  );

  return (
    <NoteGeneratorContext.Provider value={contextValue}>
      <OnboardingWrapper steps={noteGenerator} stepsToUpdate={started ? [12, 13] : undefined}>
        <div className='container'>
          <NoteGenerator />
        </div>
      </OnboardingWrapper>
    </NoteGeneratorContext.Provider>
  );
};

export default NoteGeneratorProvider;
