import {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {LanguageContext, LanguageProps} from '../../contexts/LanguageContext';
import {Language} from '../../helpers/translations';
import S from './Language.module.css';

const Languages = () => {
  const {setEng} = useContext(LanguageContext) as LanguageProps;
  const {i18n} = useTranslation();

  return (
    <div className={S.container}>
      {(Object.keys(Language) as (keyof typeof Language)[]).map(languageKey => (
        <button
          key={languageKey}
          onClick={() => {
            i18n.changeLanguage(languageKey);
            setEng(languageKey as Language);
          }}
        >
          <span>{languageKey.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
};

export default Languages;
