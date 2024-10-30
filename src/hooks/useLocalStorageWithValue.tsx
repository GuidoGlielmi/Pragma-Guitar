import {useState} from 'react';
import useLocalStorage from './useLocalStorage';

function useLocalStorageWithValue<T, TPersistable = T>(
  key: string,
): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>];

function useLocalStorageWithValue<T, TPersistable = T>(
  key: string,
  options: TOptions<T, TPersistable>,
): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>];

function useLocalStorageWithValue<T, TPersistable = T>(
  key: string,
  options: TOptionsWithInitialValue<T, TPersistable>,
): [T, React.Dispatch<React.SetStateAction<T>>];

function useLocalStorageWithValue<T, TPersistable = T>(
  key: string,
  options?: Partial<TOptionsWithInitialValue<T, TPersistable>>,
) {
  const [value, setValue] = useState<T | undefined>(options?.initialValue);

  useLocalStorage(key, value, {
    getter: options?.getter,
    setter: options?.setter,
    initialGetter: initialStoredValue => {
      setValue(initialStoredValue);
    },
    dependencies: options?.dependencies,
  });

  return [value, setValue] as [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>];
}

export default useLocalStorageWithValue;
