import {useState, useEffect, useRef} from 'react';

const useDebouncedChange = <T,>(
  value: T,
  defaultTimeWindow: number,
  timeWindows?: {[key: string | number]: number},
) => {
  const [changedValue, setChangedValue] = useState<T>();
  const prevValueRef = useRef<T>();
  const timeoutRef = useRef<number>();

  useEffect(() => {
    if (value !== prevValueRef.current) {
      // console.log(`change intention from "${prevValueRef.current} to "${value}"`);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        prevValueRef.current = value;
        setChangedValue(value);
        timeoutRef.current = undefined;
      }, timeWindows?.[`${value}`] || defaultTimeWindow);
    } else {
      // console.log('change intention withdrawn');
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return changedValue;
};

export default useDebouncedChange;
