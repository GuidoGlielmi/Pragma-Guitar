import {useContext} from 'react';
import {LanguageContext, LanguageProps} from '../../contexts/LanguageContext';
import {Language} from '../../helpers/translations';
import S from './Language.module.css';

const Languages = () => {
  const {setEng} = useContext(LanguageContext) as LanguageProps;
  return (
    <div className={S.container}>
      {Object.keys(Language).map(languageKey => (
        <button key={languageKey} onClick={() => setEng(languageKey as Language)}>
          {languageKey.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default Languages;
