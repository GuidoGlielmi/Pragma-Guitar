import {useState, useEffect} from 'react';

type TUseLocalStorageWithInitialValue<T, TPersistable> = {
  initialValue: T;
  storageKey: string;
  getter?: (t: TPersistable) => T;
  setter?: (t: T) => TPersistable;
};

type TUseLocalStorage<T, TPersistable> = {
  initialValue?: T | undefined;
  storageKey: string;
  getter?: (t?: TPersistable) => T;
  setter?: (t?: T) => TPersistable;
};

function useLocalStorage<T, TPersistable = T>({
  initialValue,
  storageKey,
  getter,
  setter,
}: TUseLocalStorageWithInitialValue<T, TPersistable>): [T, React.Dispatch<React.SetStateAction<T>>];

function useLocalStorage<T, TPersistable = T>({
  initialValue,
  storageKey,
  getter,
  setter,
}: TUseLocalStorage<T, TPersistable>): [
  T | undefined,
  React.Dispatch<React.SetStateAction<T | undefined>>,
];

function useLocalStorage<T, TPersistable = T>({
  initialValue,
  storageKey,
  getter,
  setter,
}: TUseLocalStorageWithInitialValue<T, TPersistable> | TUseLocalStorage<T, TPersistable>) {
  const getInitialValue = (): T | undefined => {
    const storedValue = JSON.parse(localStorage.getItem(storageKey)!);
    // JSON can't directly parse strings, they should begin with quotes
    return storedValue ? (getter ? getter(storedValue) : storedValue) : initialValue;
  };
  const [state, setState] = useState(() => getInitialValue());

  useEffect(() => {
    if (state !== undefined)
      localStorage.setItem(storageKey, JSON.stringify(setter ? setter(state) : state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    setState(ps => {
      return ps !== undefined &&
        JSON.stringify(setter ? setter(ps) : ps) !== localStorage.getItem(storageKey)
        ? getInitialValue()
        : ps;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  return [state, setState];
}

export default useLocalStorage;
