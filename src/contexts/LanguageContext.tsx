import {LANGUAGE_VARIABLE_NAME, Notes, OCTAVE_NOTES_AMOUNT, notes} from '@/constants';
import useLocalStorage from '@/hooks/useLocalStorage';
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useMemo,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {Language} from '../helpers/translations';

export interface LanguageProps {
  setEng: Dispatch<SetStateAction<Language>>;
  eng: Language;
  notes: Notes;
  getNoteWithOctave: (pitch: TPitchToPlay) => [string, string];
}

export const LanguageContext = createContext<LanguageProps | null>(null);

const LOWER_OCTAVE_INDEX = -1;

const LanguageProvider: FC<PropsWithChildren> = ({children}) => {
  const {i18n} = useTranslation();

  const [eng, setEng] = useState(Language.en);

  useLocalStorage(LANGUAGE_VARIABLE_NAME, eng, {
    initialGetter(storedValues) {
      setEng(storedValues);
      i18n.changeLanguage(storedValues);
    },
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
