import {useEffect, useRef} from 'react';

/**
 * It sets a state only if it's value doesn't change for a specificed window of time
 */
const useDebouncedChange = <T,>(
  value: T,
  setValue: (v: T) => void,
  timeWindow: number,
  condition?: (prevValue: T, value: T) => boolean,
) => {
  const prevValueRef = useRef<T>(value);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (value !== prevValueRef.current) {
      // console.log(`change intention from "${prevValueRef.current} to "${value}"`);
      // this is necessary if there are more than 2 possible values
      timeoutRef.current = setTimeout(() => {
        if (condition && !condition(prevValueRef.current, value)) return;
        prevValueRef.current = value;
        setValue(value);
      }, timeWindow);
      return;
    }
    // console.log('change intention withdrawn');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
};

export default useDebouncedChange;
