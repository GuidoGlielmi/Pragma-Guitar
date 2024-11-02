import {useState} from 'react';
import useLocalStorage from './useLocalStorage';

function useLocalStorageWithValue<T, TPersistable = T>(
  key: string,
): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>];

/** Without initial value and with G&S */
function useLocalStorageWithValue<T, TPersistable = T>(
  key: string,
  options: TRequiredGetterAndSetter<T, TPersistable>,
): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>];

/** With initial value and without G&S */
function useLocalStorageWithValue<T, TPersistable = T>(
  key: string,
  options: TOptionsWithInitialValue<T>,
): [T, React.Dispatch<React.SetStateAction<T>>];

/** With both initial value and G&S */
function useLocalStorageWithValue<T, TPersistable = T>(
  key: string,
  options: TOptionsWithInitialValueAndGetterAndSetter<T, TPersistable>,
): [T, React.Dispatch<React.SetStateAction<T>>];

function useLocalStorageWithValue<T, TPersistable = T>(
  key: string,
  options?: Partial<TOptionsWithInitialValueAndGetterAndSetter<T, TPersistable>>,
) {
  const [value, setValue] = useState<T | undefined>(options?.initialValue);

  useLocalStorage<T | undefined, TPersistable>(key, value, {
    ...(options?.setter && {setter: v => v && options.setter!(v)}),
    initialGetter: initialStoredValue => {
      setValue(options?.getter ? options.getter(initialStoredValue as any) : initialStoredValue);
    },
  });

  return [value, setValue] as [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>];
}

export default useLocalStorageWithValue;
