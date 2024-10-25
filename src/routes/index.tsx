import {Translation} from '../helpers/translations';

const noteGeneratorPath = '/note-generator';
const metronomePath = '/metronome';
const tunerPath = '/tuner';

export enum Section {
  NOTE_GENERATOR = noteGeneratorPath,
  METRONOME = metronomePath,
  TUNER = tunerPath,
}

export const sectionUsesMic = (section: Section | null) =>
  section === Section.NOTE_GENERATOR || section === Section.TUNER;

export const routes = [
  {
    title: 'noteGenerator',
    path: noteGeneratorPath,
    element: () => import('../contexts/NoteGeneratorContext'),
  },
  {
    title: 'metronome',
    path: metronomePath,
    element: () => import('../contexts/MetronomeContext'),
  },
  {title: 'tuner', path: tunerPath, element: () => import('../components/Sections/Tuner')},
] as {
  title: keyof Translation;
  path: Section;
  element: () => Promise<any>;
}[];
