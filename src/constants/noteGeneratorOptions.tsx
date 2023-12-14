import CustomNoteRange from '@/components/Sections/NoteGenerator/NoteRange/Custom';
import Free from '@/components/Sections/NoteGenerator/NoteRange/Free';
import StringNoteRange from '@/components/Sections/NoteGenerator/NoteRange/String';
import NoteGeneratorTuningProvider from '@/contexts/NoteGeneratorTuningContext';

export const options = {
  ['freeMode']: {element: <Free />, height: 0},
  ['inNoteRange']: {element: <CustomNoteRange />, height: 60},
  ['inString']: {
    element: (
      <NoteGeneratorTuningProvider>
        <StringNoteRange />
      </NoteGeneratorTuningProvider>
    ),
    height: 445,
  },
};
