import {useState, useEffect} from 'react';

const useLocalStorage = <T, TPersistable = any>(
  initialValue: T,
  storageKey: string,
  {
    getter,
    setter = (t: T) => t as any,
  }: {
    getter?: (t: TPersistable) => T;
    setter?: (t: T) => TPersistable;
  } = {
    setter: (t: T) => t as any,
  },
) => {
  const [state, setState] = useState<T>(
    (() => {
      const storedValue = JSON.parse(localStorage.getItem(storageKey)!);
      // JSON can't directly parse strings, they should begin with quotes
      return storedValue !== null ? (getter ? getter(storedValue) : storedValue) : initialValue;
    })(),
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(setter(state)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return [state, setState] as [T, React.Dispatch<React.SetStateAction<T>>];
};

export default useLocalStorage;
