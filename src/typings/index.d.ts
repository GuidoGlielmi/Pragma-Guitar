import {notes} from '../constants/notes';
import {Step} from 'intro.js';
import {Note, NoteEs} from '../main';

declare global {
  type TPitchToPlay = number | null;
  type TPitchRange = [from: number, to: number] | [from: null, to: null];

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

  interface IPersistedTuning extends IBaseTuning {
    strings: number[];
  }

  interface ISelectableTuning extends IBaseTuning {
    deletable: boolean;
  }

  interface ITuning extends IPersistedTuning, ISelectableTuning {}

  interface ITuningState extends ISelectableTuning {
    strings: StringStateValue[];
  }
}
