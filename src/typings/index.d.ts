import {Step} from 'intro.js';

declare global {
  type TObserver<T> = (data: T) => void;

  type GetPitchReturnType = {frecuency: number | null; amplitude: number};

  type TPitchToPlay = number | null;
  /** `[null, null]` represents free mode */
  type TPitchRange = [from: number, to: number] | [from: null, to: null];
  type TPitchRangeSetter = (
    range: TPitchRange | ((range: [number, number]) => TPitchRange),
  ) => void;
  type TPitchRangeSetterArgs = Parameters<TPitchRangeSetter>[0];

  type StepWithActionAndTranslation = Omit<Step, 'intro'> & {
    intro: {es: string; en: string};
    click?: boolean;
    updatable?: boolean;
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
    dependencies?: any[];
  }

  interface TOptionsWithInitialCallback<T, TPersistable> extends TOptions<T, TPersistable> {
    initialGetter: (storedValue: T) => void | undefined;
  }

  interface TOptionsWithInitialValue<T, TPersistable> extends TOptions<T, TPersistable> {
    initialValue: T;
  }

  // -------------

  interface IReducerAction<TType extends string, TPayload = never> {
    type: TType;
    payload?: TPayload;
  }

  interface IReducerActionWithPayload<key extends string, TPayload>
    extends IReducerAction<key, TPayload> {
    payload: TPayload;
  }

  // -------------

  /** Used by countdown */
  interface SetPitchToPlayAction extends IReducerAction<'SET_PITCH_TO_PLAY', null> {}

  interface SetPitchRangeAction
    extends IReducerActionWithPayload<'SET_PITCH_RANGE', TPitchRangeSetterArgs> {}

  interface SetLowPitchRangeAction
    extends IReducerActionWithPayload<'SET_LOW_PITCH_RANGE', React.SetStateAction<number>> {}

  interface SetHighPitchRangeAction
    extends IReducerActionWithPayload<'SET_HIGH_PITCH_RANGE', React.SetStateAction<number>> {}

  /** Action to call when correct note was hit */
  interface SetCorrectNoteAction extends IReducerAction<'CORRECT_NOTE'> {}

  interface SetMaxStreaksAction extends IReducerActionWithPayload<'SET_MAX_STREAKS', number[]> {}

  interface SetCountdownInitialValueAction
    extends IReducerActionWithPayload<'SET_COUNTDOWN_INITIAL_VALUE', number> {}

  interface StepCountdownInitialValueAction
    extends IReducerActionWithPayload<'STEP_COUNTDOWN_INITIAL_VALUE', boolean> {}

  interface StartAction extends IReducerActionWithPayload<'TOGGLE_START', boolean> {}
  type TNoteGeneratorAction =
    | StartAction
    | SetCorrectNoteAction
    | SetMaxStreaksAction
    | SetPitchToPlayAction
    | SetCountdownInitialValueAction
    | SetPitchRangeAction
    | SetLowPitchRangeAction
    | SetHighPitchRangeAction
    | StepCountdownInitialValueAction;

  // -------------

  interface SetNumeratorAction extends IReducerActionWithPayload<'SET_NUMERATOR', number> {}
  interface SetDenominatorAction extends IReducerActionWithPayload<'SET_DENOMINATOR', number> {}
  interface SetBpmUserAction
    extends IReducerActionWithPayload<'SET_BPM_USER', React.SetStateAction<number>> {}
  interface SetMaxBpmAction extends IReducerActionWithPayload<'SET_MAX_BPM', number> {}
  interface SetLoopedAction extends IReducerActionWithPayload<'SET_LOOPED', boolean> {}
  interface SetIncrementByAction extends IReducerActionWithPayload<'SET_INCREMENT_BY', number> {}
  interface StepIncrementByAction extends IReducerActionWithPayload<'STEP_INCREMENT_BY', boolean> {}
  interface SetTargetBarCountAction
    extends IReducerActionWithPayload<'SET_TARGET_BAR_COUNT', number> {}

  interface IncrementPositionAction extends IReducerAction<'INCREMENT_BEAT_POSITION'> {}
  interface MetronomeOffAction extends IReducerAction<'METRONOME_OFF'> {}

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
}
