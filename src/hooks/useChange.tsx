import {useState, useEffect, useRef} from 'react';

const useChange = <T,>(state: T, onChange = (state?: T) => {}, initialChangeState = true) => {
  const [stateChanged, setStateChanged] = useState(initialChangeState);
  const prevState = useRef<T>(state);

  useEffect(() => {
    if (!!prevState.current || !!state) {
      const stateChanged = prevState.current !== state;
      setStateChanged(stateChanged);
      if (stateChanged) onChange(state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return [stateChanged, () => setStateChanged(false)] as [
    stateChanged: boolean,
    setStateUnchanged: () => void,
  ];
};

export default useChange;
