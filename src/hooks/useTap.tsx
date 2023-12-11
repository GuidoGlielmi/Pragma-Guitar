import {useState, useRef} from 'react';
import useTranslation from './useTranslation';

const useTap = (snapValue = 5) => {
  const [tapString] = useTranslation('tap');

  const [bpm, setBpm] = useState(0);
  const prevTime = useRef(0);
  const tapHandler = () => {
    const currTime = new Date().getTime();
    setBpm(getSnappedValue(~~(1 / ((currTime - prevTime.current) / 1000 / 60)), snapValue));
    prevTime.current = currTime;
  };
  return [<button onClick={tapHandler}>{tapString}</button>, bpm] as [JSX.Element, number];
};

export function getSnappedValue(value: number, snapUnit = 5, multiplier = 1) {
  return Math.round((value * multiplier) / snapUnit) * snapUnit;
}

export default useTap;
