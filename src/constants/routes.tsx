import {Translation} from '../helpers/translations';

export const routes = [
  {
    title: 'noteGenerator',
    path: '/note-generator',
    element: () => import('../components/NoteGenerator'),
  },
  {title: 'metronome', path: '/metronome', element: () => import('../components/Metronome')},
  {title: 'tuner', path: '/tuner', element: () => import('../components/Tuner')},
] as {title: keyof Translation; path: string; element: any}[];
