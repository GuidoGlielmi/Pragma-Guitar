import {useState} from 'react';
import usePitch from './usePitch';

const usePitchWithValue = () => {
  const [frecuency, setFrecuency] = useState<TPitchToPlay>(null);
  usePitch(setFrecuency);
  return frecuency;
};

export default usePitchWithValue;
