import {useState, useEffect} from 'react';

const useStreak = (correct: boolean) => {
  const [currStreak, setCurrStreak] = useState(0);

  useEffect(() => {
    if (correct) setCurrStreak(ps => ps + 1);
  }, [correct]);

  return currStreak;
};

export default useStreak;
