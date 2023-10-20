import {useState, useEffect, useRef} from 'react';

const useChangeDebounce = <T,>(value: T, changeWindow: number) => {
  const [changedValue, setChangedValue] = useState<T>();
  const prevMsg = useRef<T>();
  const timeout = useRef<number>();

  useEffect(() => {
    if (value !== prevMsg.current) {
      console.log(`change intention from "${prevMsg.current} to "${value}"`);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        prevMsg.current = value;
        setChangedValue(value);
        timeout.current = undefined;
      }, changeWindow);
    } else {
      console.log('change intention withdrawn');
      clearTimeout(timeout.current);
      timeout.current = undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return changedValue;
};

export default useChangeDebounce;
