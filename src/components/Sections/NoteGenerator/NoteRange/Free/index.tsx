import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NoteGeneratorContext';
import {useContext, useEffect} from 'react';

const Free = () => {
  const {changePitchRange} = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  useEffect(() => {
    changePitchRange([null, null]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default Free;
