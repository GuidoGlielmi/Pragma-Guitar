import {useEffect, useRef} from 'react';

function useLocalStorage<T, TPersisted = T>(
  key: string,
  value: T | undefined,
  options: TOptionsWithInitialCallback<T, TPersisted>,
) {
  const firstRenderRef = useRef(true);
  useEffect(() => {
    const persistedValue = JSON.parse(localStorage.getItem(key)!);
    if (persistedValue !== undefined && persistedValue !== null) {
      options?.initialGetter?.(options?.getter ? options.getter(persistedValue) : persistedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(options.dependencies || [])]);

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
