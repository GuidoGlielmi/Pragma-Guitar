import {Translation} from '../helpers/translations';

export const routes = [
  {
    title: 'noteGenerator',
    path: '/note-generator',
    element: () => import('../components/Sections/NoteGenerator/Wrapper'),
  },
  {
    title: 'metronome',
    path: '/metronome',
    element: () => import('../components/Sections/Metronome'),
  },
  {title: 'tuner', path: '/tuner', element: () => import('../components/Sections/Tuner')},
] as {
  title: keyof Translation;
  path: string;
  element: () => Promise<any>;
}[];
