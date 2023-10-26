import {notes} from '../constants/notes';
import {Step} from 'intro.js';
import {Note, NoteEs} from '../main';

declare global {
  export type StepWithActionAndTranslation = Omit<Step, 'intro'> & {
    intro: {es: string; en: string};
    click?: boolean;
  };

  export type Task<T extends any[] = undefined, R = void> = (...args: T) => R;

  export type Octave = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
  export type NoteWithOctave = `${string}${Octave}`;

  export type MediaType = 'audio' | 'video';
  export type MediaDirection = 'input' | 'output';
  export type Device = [string, MediaType, MediaDirection];

  export type PersistableTuning = {label: string; pitches: number[]};
  export type Tuning = PersistableTuning & {deletable: boolean};
  export type StringStateValue = {
    id: number;
    originalPitch: number | null;
    pitch: number;
  };
  export type TuningState = Omit<Tuning, 'pitches'> & {pitches: StringStateValue[]};
}
