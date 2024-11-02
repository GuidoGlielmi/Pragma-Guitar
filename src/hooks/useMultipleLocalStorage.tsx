import {useEffect, useRef} from 'react';

interface TOptionsWithInitialCallback {
  /** Returns persisted values in order as passed, returning `undefined` if not found in storage */
  initialGetter?: (...storedValues: (any | undefined)[]) => void | undefined;
}

interface TOptionsWithSetterAndInitialGetter extends TOptionsWithInitialCallback {
  setter: (v: any) => any;
}

function useMultipleLocalStorage(...entries: [string, any, TOptionsWithInitialCallback][]): void;

function useMultipleLocalStorage(
  ...entries: [string, any, TOptionsWithSetterAndInitialGetter][]
): void;

function useMultipleLocalStorage(
  ...entries: [string, any, Partial<TOptionsWithSetterAndInitialGetter>][]
) {
  const firstRenderRef = useRef(true);
  useEffect(() => {
    const persistedValues = entries.map(
      ([k]) => JSON.parse(localStorage.getItem(k)! ?? null) ?? undefined,
    );
    entries.forEach(([, , options]) => {
      options?.initialGetter?.(persistedValues);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    for (const [key, value, options] of entries) {
      if (value === undefined) continue;
      localStorage.setItem(key, JSON.stringify(options?.setter ? options.setter(value) : value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(entries.map(e => e[1]))]);
}

export default useMultipleLocalStorage;
