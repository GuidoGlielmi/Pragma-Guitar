import {Notes, OCTAVE_NOTES_AMOUNT, notes} from '@/constants';
import {Dispatch, FC, PropsWithChildren, SetStateAction, createContext, useMemo} from 'react';
import {Language} from '../helpers/translations';
import useLocalStorageWithValue from '../hooks/useLocalStorageWithValue';

export interface LanguageProps {
  setEng: Dispatch<SetStateAction<Language>>;
  eng: Language;
  notes: Notes;
  getNoteWithOctave: (pitch: TPitchToPlay) => [string, string];
}

export const LanguageContext = createContext<LanguageProps | null>(null);

const LANGUAGE_STORAGE_NAME = 'lang';
const LOWER_OCTAVE_INDEX = -1;

const LanguageProvider: FC<PropsWithChildren> = ({children}) => {
  const [eng, setEng] = useLocalStorageWithValue(LANGUAGE_STORAGE_NAME, {
    initialValue: Language.en,
  });

  const getNoteWithOctave = (pitch: TPitchToPlay): [string, string] => {
    if (pitch === null) return ['', ''];
    const octave = ~~(pitch / OCTAVE_NOTES_AMOUNT) + LOWER_OCTAVE_INDEX;
    const note = Object.values(notes[eng])[pitch % OCTAVE_NOTES_AMOUNT];
    return [note, `${octave}`];
  };

  const contextValue = useMemo<LanguageProps>(
    () => ({setEng, eng, getNoteWithOctave, notes: notes[eng]}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eng],
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export default LanguageProvider;
