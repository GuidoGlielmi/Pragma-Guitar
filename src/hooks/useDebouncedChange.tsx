import {useState, useEffect, useRef} from 'react';

const useDebouncedChange = <T,>(newValue: T, timeWindow: number) => {
  const [changedValue, setChangedValue] = useState<T>(newValue);
  const prevValueRef = useRef<T>(newValue);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    if (newValue !== prevValueRef.current) {
      // console.log(`change intention from "${prevValueRef.current} to "${value}"`);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        prevValueRef.current = newValue;
        setChangedValue(newValue);
        timeoutRef.current = undefined;
      }, timeWindow);
    } else {
      // console.log('change intention withdrawn');
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newValue]);

  return [changedValue, setChangedValue] as [T, React.Dispatch<React.SetStateAction<T>>];
};

export default useDebouncedChange;
