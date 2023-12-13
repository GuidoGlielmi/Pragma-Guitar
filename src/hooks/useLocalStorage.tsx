import {useState, useEffect} from 'react';

type TGetter<T, TPersistable> = (t: TPersistable | null) => T;
type TSetter<T, TPersistable> = (t: T) => TPersistable;

type TAccessors<T, TPersistable> = {
  getter: TGetter<T, TPersistable>;
  setter: TSetter<T, TPersistable>;
};

function useLocalStorage<T, TPersistable = any>(
  storageKey: string,
): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>];

function useLocalStorage<T, TPersistable = any>(
  storageKey: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>];

function useLocalStorage<T, TPersistable = any>(
  storageKey: string,
  accessors: TAccessors<T, TPersistable>,
): [T, React.Dispatch<React.SetStateAction<T>>];

function useLocalStorage<T, TPersistable = any>(
  storageKey: string,
  initialValue: T,
  accessors: TAccessors<T, TPersistable>,
): [T, React.Dispatch<React.SetStateAction<T>>];

function useLocalStorage<T, TPersistable>(
  storageKey: string,
  initialValue?: T,
  accessors?: TAccessors<T, TPersistable>,
) {
  const getInitialValue = (): T | undefined => {
    const storedValue: TPersistable | T | null = JSON.parse(localStorage.getItem(storageKey)!);
    // JSON can't directly parse strings, they should begin with quotes
    return accessors?.getter
      ? accessors?.getter(storedValue as TPersistable | null)
      : (storedValue as T | null) ?? initialValue;
  };
  const [state, setState] = useState(() => getInitialValue());

  useEffect(() => {
    if (state !== undefined)
      localStorage.setItem(
        storageKey,
        JSON.stringify(accessors?.setter ? accessors.setter(state) : state),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    setState(ps => {
      return ps !== undefined &&
        JSON.stringify(accessors?.setter ? accessors.setter(ps) : ps) !==
          localStorage.getItem(storageKey)
        ? getInitialValue()
        : ps;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  return [state, setState];
}

export default useLocalStorage;
