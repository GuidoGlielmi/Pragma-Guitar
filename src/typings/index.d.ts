import {notes} from '../constants/notes';

export {};
declare global {
  export type Note = keyof typeof notes;
  export type Octave = '1' | '2' | '3' | '4' | '5' | '6';
  export type NoteWithOctave = `${Note}${Octave}` | 'Any';
  export type gtrString = {value: number; label: NoteWithOctave};
}
