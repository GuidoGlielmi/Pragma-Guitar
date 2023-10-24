import {useState, useEffect} from 'react';
import useMaxValue from './useMaxValue';

type TUseStreak = [currentStreak: number, maxStreak: number];

const useStreak = (correct: boolean, storageKey: string): TUseStreak => {
  const [currStreak, setCurrStreak] = useState(0);
  const maxStreak = useMaxValue(currStreak, storageKey);

  useEffect(() => {
    if (correct) setCurrStreak(ps => ps + 1);
  }, [correct]);

  return [currStreak, maxStreak];
};

export default useStreak;
