export const routes = [
  {
    title: 'Note Generator',
    path: '/note-generator',
    element: () => import('../components/NoteGenerator'),
  },
  {title: 'Metronome', path: '/metronome', element: () => import('../components/Metronome')},
  {title: 'Tuner', path: '/tuner', element: () => import('../components/Tuner')},
];
