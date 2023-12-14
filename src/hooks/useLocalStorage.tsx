import {useState, useEffect} from 'react';

type TGetter<T, TPersistable> = (t: TPersistable | null) => T;
type TSetter<T, TPersistable> = (t: T) => TPersistable;

type TOptions<T, TPersistable> = {
  initialValue?: T;
  getter?: TGetter<T, TPersistable>;
  setter?: TSetter<T, TPersistable>;
};

function useLocalStorage<T, TPersistable = any>(
  storageKey: string,
): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>];

function useLocalStorage<T, TPersistable = any>(
  storageKey: string,
  options: TOptions<T, TPersistable>,
): [T, React.Dispatch<React.SetStateAction<T>>];

function useLocalStorage<T, TPersistable>(storageKey: string, options?: TOptions<T, TPersistable>) {
  const getInitialValue = (): T | undefined => {
    const storedValue: TPersistable | T | null = JSON.parse(localStorage.getItem(storageKey)!);
    // JSON can't directly parse strings, they should begin with quotes

    return options?.getter
      ? options?.getter(storedValue as TPersistable | null)
      : (storedValue as T | null) ?? options?.initialValue;
  };
  const [state, setState] = useState(() => getInitialValue());

  useEffect(() => {
    if (state !== undefined)
      localStorage.setItem(
        storageKey,
        JSON.stringify(options?.setter ? options.setter(state) : state),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    setState(ps => {
      return ps !== undefined &&
        JSON.stringify(options?.setter ? options.setter(ps) : ps) !==
          localStorage.getItem(storageKey)
        ? getInitialValue()
        : ps;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  return [state, setState];
}

export default useLocalStorage;
