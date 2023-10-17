import {useContext} from 'react';
import {LanguageContext, LanguageProps} from '../contexts/LanguageContext';
import {TranslationKeys, translate} from '../helpers/translations';

const useTranslation = (key: TranslationKeys | TranslationKeys[]) => {
  const {eng} = useContext(LanguageContext) as LanguageProps;
  const keys = key instanceof Array ? key : [key];
  return keys.map(k => translate(k, eng));
};

export default useTranslation;
