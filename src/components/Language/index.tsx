import {useContext} from 'react';
import S from './Language.module.css';
import {LanguageContext, LanguageProps} from '../../contexts/LanguageContext';

const Language = () => {
  const {setEng} = useContext(LanguageContext) as LanguageProps;
  return (
    <div className={S.container}>
      <button onClick={() => setEng(true)}>EN</button>
      <button onClick={() => setEng(false)}>ES</button>
    </div>
  );
};

export default Language;
