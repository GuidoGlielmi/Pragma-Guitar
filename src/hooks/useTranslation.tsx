import {useContext} from 'react';
import {LanguageContext, LanguageProps} from '../contexts/LanguageContext';
import {Translation, translate} from '../helpers/translations';

const useTranslation = (key: keyof Translation | (keyof Translation)[] | '') => {
  const {eng} = useContext(LanguageContext) as LanguageProps;
  const keys = key instanceof Array ? key : key ? [key] : [];
  return keys.map(k => translate(k, eng));
};

export default useTranslation;
