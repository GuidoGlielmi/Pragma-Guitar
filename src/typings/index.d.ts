import {notes} from '../constants/notes';
import {Step} from 'intro.js';

declare global {
  export type StepWithAction = Step & {click?: boolean};
  export type UsePitch = {
    note: Note | null;
    frecuency: number | null;
    pitch: number | null;
    detune: number | null;
  };

  export type Note = keyof typeof notes;
  export type Octave = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
  export type NoteWithOctave = `${Note}${Octave}`;

  export type gtrString = {value: number; label: NoteWithOctave};
  export type MediaType = 'audio' | 'video';
  export type MediaDirection = 'input' | 'output';
  export type Device = [string, MediaType, MediaDirection];
  export type NoteInfo = {
    frecuency: number | null;
    pitch: number | null;
    note: Note | null;
    detune: number | null;
  };
}
