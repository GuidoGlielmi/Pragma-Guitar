import {useState, useEffect} from 'react';

const useStreak = (correct: boolean) => {
  const [currStreak, setCurrStreak] = useState(0);

  useEffect(() => {
    if (correct) setCurrStreak(ps => ps + 1);
  }, [correct]);

  return [currStreak, setCurrStreak] as [number, React.Dispatch<React.SetStateAction<number>>];
};

export default useStreak;
