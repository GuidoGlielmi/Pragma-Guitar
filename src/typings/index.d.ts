import {notes} from '../constants/notes';
import {Step} from 'intro.js';

declare global {
  export type StepWithActionAndTranslation = Omit<Step, 'intro'> & {
    intro: {es: string; en: string};
    click?: boolean;
  };
  export type UsePitch = {
    note: Note | null;
    frecuency: number | null;
    pitch: number | null;
    detune: number | null;
  };

  export type Note = keyof typeof notes;
  export type NoteEs = (typeof notes)[keyof typeof notes];
  export type Octave = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
  // export type NoteWithOctave = `${Note}${Octave}`;
  export type NoteWithOctave = `${string}${Octave}`;

  export type GtrString = {value: number; label: NoteWithOctave; labelEs: NoteWithOctave};
  export type MediaType = 'audio' | 'video';
  export type MediaDirection = 'input' | 'output';
  export type Device = [string, MediaType, MediaDirection];
  export type NoteInfo = {
    frecuency: number | null;
    pitch: number | null;
    note: Note | null;
    detune: number | null;
  };
  export type Tuning = {label: string; pitches: number[]};
  export type StringStateValue = {original: number | null; pitch: number; id: number};
  export type TuningState = {label: string; pitches: StringStateValue[]};
}
