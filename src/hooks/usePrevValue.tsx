import {useRef, useEffect} from 'react';

const useChange = <T,>(value: T, onChange: (prevValue?: T) => void) => {
  const prevValue = useRef<T>();
  useEffect(() => {
    onChange(prevValue.current);
    prevValue.current = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
};

export default useChange;
