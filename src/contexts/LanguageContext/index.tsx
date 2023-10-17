import {
  createContext,
  useMemo,
  useState,
  useEffect,
  FC,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from 'react';

export interface LanguageProps {
  setEng: Dispatch<SetStateAction<boolean>>;
  eng: boolean;
}

export const LanguageContext = createContext<LanguageProps | null>(null);

const LanguageProvider: FC<PropsWithChildren> = ({children}) => {
  const [eng, setEng] = useState(true);

  useEffect(() => {
    const eng = localStorage.getItem('eng');
    if (eng === null) return;
    setEng(eng !== 'false');
  }, []);

  useEffect(() => {
    localStorage.setItem('eng', `${eng}`);
  }, [eng]);

  const contextValue = useMemo<LanguageProps>(() => ({setEng, eng}), [eng]);

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export default LanguageProvider;
