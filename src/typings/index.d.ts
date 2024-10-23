import {Step} from 'intro.js';

declare global {
  type TObserver<T> = (data: T) => void;

  type TPitchToPlay = number | null;
  type TPitchRange = [from: number, to: number] | [from: null, to: null];
  type TPitchRangeSetter = (
    range: TPitchRange | ((range: [number, number]) => TPitchRange),
  ) => void;
  type TPitchRangeSetterArgs = Parameters<TPitchRangeSetter>[0];

  type StepWithActionAndTranslation = Omit<Step, 'intro'> & {
    intro: {es: string; en: string};
    click?: boolean;
  };

  type Task<T extends any[] = undefined, R = void> = (...args: T) => R;

  type StringStateValue = {
    id: number;
    originalPitch: TPitchToPlay;
    pitch: number;
  };

  interface IBaseTuning {
    label: string;
    strings: StringStateValue[] | number[];
  }

  /**
   * Tunings as persisted in storage
   */
  interface IPersistedTuning extends IBaseTuning {
    strings: number[];
  }

  /**
   * Tunings as used in app
   */
  interface ISelectableTuning extends IBaseTuning {
    /**
     * Indicates if tuning is hard-coded
     */
    deletable: boolean;
  }

  interface ITuning extends IPersistedTuning, ISelectableTuning {}

  interface ITuningState extends ISelectableTuning {
    strings: StringStateValue[];
  }

  type TSection = {
    element: JSX.Element;
    height: number;
  };
  // ---------

  type TGetter<T, TPersistable> = (storedValue?: TPersistable) => T;
  type TSetter<T, TPersistable> = (storedValue?: T) => TPersistable;

  interface TOptions<T, TPersistable> {
    getter?: TGetter<T, TPersistable>;
    setter?: TSetter<T, TPersistable>;
  }

  interface TOptionsWithInitialCallback<T, TPersistable> extends TOptions<T, TPersistable> {
    initialGetter: (storedValue: T) => void | undefined;
  }

  interface TOptionsWithInitialValue<T, TPersistable> extends TOptions<T, TPersistable> {
    initialValue: T;
  }

  // -------------

  interface IReducerAction<TType extends string, TPayload = any> {
    type: TType;
    payload: TPayload;
  }

  interface IReducerActionWithoutPayload<key extends string> extends IReducerAction<key> {
    payload?: never;
  }

  interface IReducerActionWithOptionalPayload<TType extends string, TPayload = any>
    extends IReducerAction<TType> {
    payload?: TPayload;
  }

  // -------------

  /** Used by countdown */
  interface SetPitchToPlayAction
    extends IReducerActionWithOptionalPayload<'SET_PITCH_TO_PLAY', null> {}

  interface SetPitchRangeAction extends IReducerAction<'SET_PITCH_RANGE', TPitchRangeSetterArgs> {}

  interface SetLowPitchRangeAction
    extends IReducerAction<'SET_LOW_PITCH_RANGE', React.SetStateAction<number>> {}

  interface SetHighPitchRangeAction
    extends IReducerAction<'SET_HIGH_PITCH_RANGE', React.SetStateAction<number>> {}

  interface SetCorrectAction extends IReducerActionWithoutPayload<'SET_CORRECT'> {}

  interface SetMaxStreaksAction extends IReducerAction<'SET_MAX_STREAKS', number[]> {}

  interface SetCountdownInitialValueAction
    extends IReducerAction<'SET_COUNTDOWN_INITIAL_VALUE', number> {}

  interface IncreaseCountdownInitialValueAction
    extends IReducerActionWithoutPayload<'INCREASE_COUNTDOWN_INITIAL_VALUE'> {}

  interface DecreaseCountdownInitialValueAction
    extends IReducerActionWithoutPayload<'DECREASE_COUNTDOWN_INITIAL_VALUE'> {}

  interface StartAction extends IReducerAction<'TOGGLE_START', boolean> {}

  type TNoteGeneratorAction =
    | StartAction
    | SetCorrectAction
    | SetMaxStreaksAction
    | SetPitchToPlayAction
    | SetCountdownInitialValueAction
    | SetPitchRangeAction
    | SetLowPitchRangeAction
    | SetHighPitchRangeAction
    | IncreaseCountdownInitialValueAction
    | DecreaseCountdownInitialValueAction;

  // -------------

  interface SetNumeratorAction extends IReducerAction<'SET_NUMERATOR', number> {}
  interface SetDenominatorAction extends IReducerAction<'SET_DENOMINATOR', number> {}
  interface IncrementPositionAction
    extends IReducerActionWithoutPayload<'INCREMENT_BEAT_POSITION'> {}
  interface MetronomeOffAction extends IReducerActionWithoutPayload<'METRONOME_OFF'> {}
  interface SetBpmUserAction extends IReducerAction<'SET_BPM_USER', React.SetStateAction<number>> {}
  interface SetMaxBpmAction extends IReducerAction<'SET_MAX_BPM', number> {}
  interface SetLoopedAction extends IReducerAction<'SET_LOOPED', boolean> {}
  interface SetIncrementByAction extends IReducerAction<'SET_INCREMENT_BY', number> {}
  interface StepIncrementByAction extends IReducerAction<'STEP_INCREMENT_BY', boolean> {}
  interface SetTargetBarCountAction extends IReducerAction<'SET_TARGET_BAR_COUNT', number> {}

  type TMetronomeAction =
    | SetNumeratorAction
    | SetDenominatorAction
    | IncrementPositionAction
    | MetronomeOffAction
    | SetBpmUserAction
    | SetMaxBpmAction
    | SetLoopedAction
    | SetIncrementByAction
    | StepIncrementByAction
    | SetTargetBarCountAction;

  interface StartAction extends IReducerAction<'START', boolean> {}
}
