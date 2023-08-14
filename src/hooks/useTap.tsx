import {useState, useRef} from 'react';

const useTap = (snapValue = 5) => {
  const [bpm, setBpm] = useState(0);
  const prevTime = useRef(0);
  const tapHandler = () => {
    const currTime = new Date().getTime();
    setBpm(getSnappedValue(~~(1 / ((currTime - prevTime.current) / 1000 / 60)), snapValue));
    prevTime.current = currTime;
  };
  return [<button onClick={tapHandler}>Tap</button>, bpm] as [JSX.Element, number];
};

export function getSnappedValue(value: number, snapUnit = 5, multiplier = 1) {
  return Math.round((value * multiplier) / snapUnit) * snapUnit;
}

export default useTap;
