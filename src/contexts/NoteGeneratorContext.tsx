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

interface INoteGeneratorState {
  /** Gets updated when hitting the correct {@link pitchToPlay} */
  currStreak: number;
  maxStreaks: number[];
  /** Tells whether the current note was hit. Gets reset to false when generating a new {@link pitchToPlay} */
  correct: boolean;
  /** Remembers the value of {@link correct} for after generating a new {@link pitchToPlay}, to keep track of {@link currStreak} */
  prevCorrect: boolean;
  pitchToPlay: TPitchToPlay;
  pitchRange: TPitchRange;
  countdownInitialValue: number;
}

const initialState: INoteGeneratorState = {
  currStreak: 0,
  maxStreaks: [],
  correct: false,
  prevCorrect: false,
  pitchToPlay: null,
  pitchRange: [null, null],
  countdownInitialValue: DEFAULT_COUNTDOWN_INITIAL_VALUE,
};

function reducer(
  prevState: INoteGeneratorState,
  action: TNoteGeneratorAction,
): INoteGeneratorState {
  if (action.type === 'TOGGLE_START') {
    return {
      ...prevState,
      correct: false,
      prevCorrect: false,
      currStreak: 0,
      pitchToPlay: action.payload ? generatePitch() : null,
    };
  }
  if (action.type === 'CORRECT_NOTE') {
    const newState: INoteGeneratorState = {
      ...prevState,
      correct: true,
      prevCorrect: true,
      currStreak: prevState.currStreak + 1,
    };
    if (prevState.prevCorrect === true) {
      const storedMaxStreak = prevState.maxStreaks[prevState.countdownInitialValue - 1];
      const maxStreaks = [...prevState.maxStreaks];
      if ((storedMaxStreak ?? 0) < newState.currStreak) {
        maxStreaks[prevState.countdownInitialValue - 1] = newState.currStreak;
      }
      newState.maxStreaks = maxStreaks;
    }
    return newState;
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
        prevState.pitchRange[0] ?? 0,
        action.payload instanceof Function
          ? action.payload(prevState.pitchRange[1] ?? MAX_PITCH_INDEX)
          : action.payload,
      ]),
    };
  }
  if (action.type === 'SET_COUNTDOWN_INITIAL_VALUE') {
    return setCountdownInitialValue(action.payload);
  }
  if (action.type === 'STEP_COUNTDOWN_INITIAL_VALUE') {
    return setCountdownInitialValue(prevState.countdownInitialValue + (action.payload ? 1 : -1));
  }

  function setCountdownInitialValue(value: number): typeof initialState {
    return {
      ...setPitch(),
      prevCorrect: false,
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

  /** When changing pitch, correct is set to false  */
  function setPitch(value?: TPitchToPlay): typeof initialState {
    if (value === null) return {...prevState, correct: false, pitchToPlay: null};
    return {
      ...prevState,
      pitchToPlay: generatePitch(),
      correct: false,
      prevCorrect: prevState.correct,
      ...(!prevState.correct && {currStreak: 0}),
    };
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
  stepCountdownInitialValue: (up: boolean) => void;
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
    exactOctave: !(from === null && to === null),
    cb: () => dispatch({type: 'CORRECT_NOTE'}),
    extraDependencies: [countdownInitialValue],
  });

  useLocalStorage(PERSISTED_MAX_STREAKS_VARIABLE_NAME, maxStreaks, {
    initialGetter: v => dispatch({payload: v, type: 'SET_MAX_STREAKS'}),
  });

  useEffect(() => {
    dispatch({type: 'TOGGLE_START', payload: started === Section.NOTE_GENERATOR}); // <- starts here
  }, [started]);

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

  const stepCountdownInitialValue = (up: boolean) => {
    dispatch({type: 'STEP_COUNTDOWN_INITIAL_VALUE', payload: up});
  };

  const contextValue = useMemo(
    () => ({
      countdownInitialValue,
      setCountdownInitialValue,
      stepCountdownInitialValue,
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
      <OnboardingWrapper steps={noteGenerator}>
        <div className='container'>
          <NoteGenerator />
        </div>
      </OnboardingWrapper>
    </NoteGeneratorContext.Provider>
  );
};

export default NoteGeneratorProvider;
