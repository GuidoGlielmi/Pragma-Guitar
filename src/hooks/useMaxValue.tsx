import {useEffect} from 'react';
import useLocalStorage from './useLocalStorage';

const useMaxValue = (currentValue: number, storageKey: string) => {
  const [maxValue, setMaxValue] = useLocalStorage(0, storageKey);

  useEffect(() => {
    setMaxValue(ps => Math.max(ps, currentValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue]);

  return maxValue;
};

export default useMaxValue;
