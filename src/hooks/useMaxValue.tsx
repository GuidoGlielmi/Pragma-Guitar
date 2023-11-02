import {useRef, useEffect} from 'react';
import useLocalStorage from './useLocalStorage';

const useMaxValue = (currentValue: number, storageKey: string) => {
  const [maxValue, setMaxValue] = useLocalStorage(0, storageKey);
  const prevStorageKeyRef = useRef(storageKey);

  useEffect(() => {
    if (prevStorageKeyRef.current === storageKey) {
      setMaxValue(ps => Math.max(ps, currentValue));
    }
    prevStorageKeyRef.current = storageKey;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue, storageKey]);

  return maxValue;
};

export default useMaxValue;
