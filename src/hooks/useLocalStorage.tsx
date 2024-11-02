import {useEffect, useRef} from 'react';

function useLocalStorage<T, TPersistable = T>(
  key: string,
  value: T,
  options: TOptionsWithSetterAndInitialGetter<T, TPersistable>,
): void;

function useLocalStorage<T, TPersistable = T>(
  key: string,
  value: T,
  options: TOptionsWithInitialCallback<T>,
): void;

function useLocalStorage<T, TPersistable = T>(
  key: string,
  value: T,
  options: Partial<TOptionsWithSetterAndInitialGetter<T, TPersistable>>,
) {
  const firstRenderRef = useRef(true);
  useEffect(() => {
    const persistedValue = JSON.parse(localStorage.getItem(key)!);
    if (persistedValue !== undefined && persistedValue !== null) {
      options?.initialGetter?.(persistedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (value === undefined || firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    localStorage.setItem(key, JSON.stringify(options?.setter ? options.setter(value) : value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
}

export default useLocalStorage;
