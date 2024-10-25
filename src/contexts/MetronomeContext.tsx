import Bar from '@/components/Sections/Metronome/Bar';
import BeatCircles from '@/components/Sections/Metronome/BeatCircles';
import MetronomeHeader from '@/components/Sections/Metronome/Header';
import Incrementer from '@/components/Sections/Metronome/Incrementer';
import EnhancedInput from '@/components/common/Inputs/EnhancedInput';
import {
  BAR_COUNT_UNTIL_INCREMENT_VARIABLE_NAME,
  BEAT_COUNT_MIN_VALUE,
  DEFAULT_BMP,
  INCREMENTER_MIN_VALUE,
  LOOPING_MAX_BMP_VARIABLE_NAME,
} from '@/constants';
import {bpmLimiter} from '@/helpers/limiter';
import {bpmToMs} from '@/helpers/timer';
import useInitialBufferLoad from '@/hooks/useInitialBufferLoad';
import useLocalStorage from '@/hooks/useLocalStorage';
import usePlayAudio from '@/hooks/usePlayAudio';
import React, {FC, createContext, useContext, useEffect, useMemo, useReducer} from 'react';
import S from '../components/Sections/Metronome/Metronome.module.css';
import {AudioContext, AudioProps} from './AudioContext';

const initialState = {
  bar: [4, 4] as [number, number],
  bpm: DEFAULT_BMP,
  beatPosition: 0,
  incrementer: {
    incrementBy: 0,
    barCountUntilIncrement: 1,
    barCount: 0,
    looping: {
      /**
       * When looping, it goes back to the last **user-set** bpm value
       */
      on: false,
      maxBpm: DEFAULT_BMP,
      /**
       * To which value to return after looping. It's tied to {@link bpm} and while looping is on, it should only change **through user input**
       */
      initialBpm: DEFAULT_BMP,
    },
  },
};

function reducer(prevState: typeof initialState, action: TMetronomeAction): typeof initialState {
  if (action.type === 'METRONOME_OFF') {
    return {
      ...prevState,
      beatPosition: -1,
      bpm: prevState.incrementer.looping.on
        ? prevState.incrementer.looping.initialBpm
        : prevState.bpm,
      incrementer: {
        ...prevState.incrementer,
        barCount: 0,
      },
    };
  }
  if (action.type === 'SET_NUMERATOR') {
    return {
      ...prevState,
      beatPosition:
        action.payload < prevState.beatPosition ? action.payload : prevState.beatPosition,
      bar: [action.payload, prevState.bar[1]],
    };
  }
  if (action.type === 'SET_DENOMINATOR') {
    return {
      ...prevState,
      bar: [prevState.bar[0], action.payload],
    };
  }
  if (action.type === 'SET_MAX_BPM') {
    return {
      ...prevState,
      incrementer: {
        ...prevState.incrementer,
        looping: {
          ...prevState.incrementer.looping,
          maxBpm: Math.max(action.payload, prevState.bpm),
        },
      },
    };
  }
  if (action.type === 'SET_LOOPED') {
    return {
      ...prevState,
      incrementer: {
        ...prevState.incrementer,
        looping: {
          ...prevState.incrementer.looping,
          on: action.payload,
        },
      },
    };
  }
  if (action.type === 'SET_INCREMENT_BY') {
    return {
      ...prevState,
      incrementer: {
        ...prevState.incrementer,
        incrementBy: Math.max(INCREMENTER_MIN_VALUE, action.payload),
      },
    };
  }
  if (action.type === 'SET_TARGET_BAR_COUNT') {
    return {
      ...prevState,
      incrementer: {
        ...prevState.incrementer,
        barCountUntilIncrement: Math.max(BEAT_COUNT_MIN_VALUE, action.payload),
      },
    };
  }

  if (action.type === 'INCREMENT_BEAT_POSITION') {
    const [numerator] = prevState.bar;
    const isLastBeat = prevState.beatPosition === numerator - 1;
    const isLastBar =
      prevState.incrementer.barCount === prevState.incrementer.barCountUntilIncrement - 1;

    const newBarCount = !isLastBeat
      ? prevState.incrementer.barCount
      : isLastBar
      ? 0
      : prevState.incrementer.barCount + 1;

    let newBpm = bpmLimiter(
      isLastBeat && isLastBar ? prevState.bpm + prevState.incrementer.incrementBy : prevState.bpm,
    );

    if (prevState.incrementer.looping.on && newBpm > prevState.incrementer.looping.maxBpm) {
      newBpm = prevState.incrementer.looping.initialBpm;
    }

    return {
      ...prevState,
      bpm: newBpm,
      beatPosition: isLastBeat ? 0 : prevState.beatPosition + 1,
      incrementer: {
        ...prevState.incrementer,
        barCount: newBarCount,
        looping: {
          ...prevState.incrementer.looping,
          ...(!prevState.incrementer.looping.on && {
            initialBpm: newBpm,
            maxBpm: Math.max(newBpm, prevState.incrementer.looping.maxBpm),
          }),
        },
      },
    };
  }

  if (action.type === 'SET_BPM_USER') {
    const newBpm = bpmLimiter(
      action.payload instanceof Function ? action.payload(prevState.bpm) : action.payload,
    );
    return {
      ...prevState,
      bpm: newBpm,
      incrementer: {
        ...prevState.incrementer,
        looping: {
          ...prevState.incrementer.looping,
          initialBpm: prevState.incrementer.looping.on
            ? prevState.incrementer.looping.initialBpm
            : newBpm,
          maxBpm: Math.max(newBpm, prevState.incrementer.looping.maxBpm),
        },
      },
    };
  }
  throw new Error('');
}

export interface MetronomeProps {
  setBpm: React.Dispatch<React.SetStateAction<number>>;
  bar: [number, number];
  setDenominator: (d: number) => void;
  setNumerator: (n: number) => void;
  incrementBy: number;
  setIncrementBy: (n: number) => void;
  setMaxBpm: (n: number) => void;
  maxBpm: number;
  setLooped: (n: boolean) => void;
  looped: boolean;
  setBarCountUntilIncrement: (n: number) => void;
  barCountUntilIncrement: number;
}

export const MetronomeContext = createContext<MetronomeProps | null>(null);

const MetronomeProvider: FC = () => {
  const {started} = useContext(AudioContext) as AudioProps;

  const firstClickAudioBuffer = useInitialBufferLoad('/audio/metronome_oct_up.mp3');
  const clickAudioBuffer = useInitialBufferLoad('/audio/metronome.mp3');

  const [
    {
      bar,
      bpm,
      beatPosition,
      incrementer: {
        incrementBy,
        looping: {maxBpm, on: looped},
        barCountUntilIncrement,
      },
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const [numerator, denominator] = bar;

  useLocalStorage(LOOPING_MAX_BMP_VARIABLE_NAME, maxBpm, {
    initialGetter: v => dispatch({type: 'SET_MAX_BPM', payload: v}),
  });
  useLocalStorage(BAR_COUNT_UNTIL_INCREMENT_VARIABLE_NAME, barCountUntilIncrement, {
    initialGetter: v => dispatch({type: 'SET_TARGET_BAR_COUNT', payload: v}),
  });

  useEffect(() => {
    if (!started) return dispatch({type: 'METRONOME_OFF'});
  }, [started]);

  const nextShouldBeFirstAudio = beatPosition === numerator - 1 || beatPosition === -1;

  usePlayAudio(bpmToMs(bpm, denominator), () => {
    dispatch({type: 'INCREMENT_BEAT_POSITION'}); // used to start metronome
  }).current = nextShouldBeFirstAudio ? firstClickAudioBuffer : clickAudioBuffer;

  const setDenominator = (d: number) => {
    dispatch({type: 'SET_DENOMINATOR', payload: d});
  };

  const setNumerator = (n: number) => {
    dispatch({type: 'SET_NUMERATOR', payload: n});
  };

  const setLooped = (n: boolean) => {
    dispatch({type: 'SET_LOOPED', payload: n});
  };

  const setBarCountUntilIncrement = (n: number) => {
    dispatch({type: 'SET_TARGET_BAR_COUNT', payload: n});
  };

  const setMaxBpm = (n: number) => {
    dispatch({type: 'SET_MAX_BPM', payload: n});
  };

  const setIncrementBy = (n: number) => {
    dispatch({type: 'SET_INCREMENT_BY', payload: n});
  };

  const setBpm: React.Dispatch<React.SetStateAction<number>> = v => {
    dispatch({type: 'SET_BPM_USER', payload: v});
  };

  const contextValue = useMemo(
    () => ({
      setBpm,
      bar,
      setDenominator,
      setNumerator,
      incrementBy,
      setIncrementBy,
      maxBpm,
      setMaxBpm,
      looped,
      setLooped,
      setBarCountUntilIncrement,
      barCountUntilIncrement,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bar, incrementBy, maxBpm, looped, barCountUntilIncrement],
  );

  return (
    <MetronomeContext.Provider value={contextValue}>
      <div className={`${S.container} sectionBorder`}>
        <MetronomeHeader>
          <EnhancedInput
            value={bpm}
            setValue={e => {
              dispatch({type: 'SET_BPM_USER', payload: e});
            }}
          />
        </MetronomeHeader>
        <Bar />
        <BeatCircles beatPosition={beatPosition} />
        <Incrementer />
      </div>
    </MetronomeContext.Provider>
  );
};

export default MetronomeProvider;
