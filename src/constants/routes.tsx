import {Component as NoteGenerator} from '../components/NoteGenerator';
import {Component as Tuner} from '../components/Tuner';
import {Component as Metronome} from '../components/Metronome';

export const lazyRoutes = [
  {
    title: 'Note Generator',
    path: '/note-generator',
    element: () => import('../components/NoteGenerator'),
  },
  {title: 'Metronome', path: '/metronome', element: () => import('../components/Metronome')},
  {title: 'Tuner', path: '/tuner', element: () => import('../components/Tuner')},
];

export const routes = [
  {
    title: 'Note Generator',
    path: '/note-generator',
    element: <NoteGenerator />,
  },
  {title: 'Metronome', path: '/metronome', element: <Metronome />},
  {title: 'Tuner', path: '/tuner', element: <Tuner />},
];
