import {useState, useEffect} from 'react';

const useLocalStorage = <T extends TPersistable, TPersistable = T>(
  initialValue: T,
  storageKey: string,
  setter: (t: T) => TPersistable = t => t as TPersistable,
) => {
  const [state, setState] = useState<T>(
    JSON.parse(localStorage.getItem(storageKey)!) ?? initialValue,
  );
  // JSON can't directly parse strings, they should begin with quotes

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(setter(state)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return [state, setState] as [T, React.Dispatch<React.SetStateAction<T>>];
};

export default useLocalStorage;
