import {useState, useRef} from 'react';

type NumberInputProps = {
  initialValue?: number;
  max?: number;
  min?: number;
  style?: React.CSSProperties;
};

const useNumberInput = ({
  initialValue = 0,
  max = Infinity,
  min = -Infinity,
  style = {},
}: NumberInputProps = {}) => {
  const [value, setValue] = useState(initialValue);
  const [dragging, setDragging] = useState(false);

  const changeHandler = (value: number) => {
    setValue(ps => {
      const newValue = ~~(value === 0 ? value : Math.max(min, Math.min(value, max)) || ps);
      return newValue;
    });
  };

  const add = (newValue: number) => {
    changeHandler(newValue + value);
  };

  const subtract = (newValue: number) => {
    changeHandler(newValue + value);
  };

  const dragHandler = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    if (!dragging) return;
    setValue(ps => ps + (e.movementY > 0 ? -1 : 1));
  };

  return {
    input: (
      <input
        style={{...style, cursor: dragging ? 'grabbing' : 'grab'}}
        value={value || ''}
        onBlur={() => setValue(ps => ps || min)}
        onChange={e => changeHandler(+e.target.value)}
        onMouseDown={() => setDragging(true)}
        onMouseMove={throttle(dragHandler, 10)}
        onTouchStart={() => setDragging(true)}
        onTouchEnd={() => setDragging(false)}
        onTouchMove={throttle(dragHandler, 10)}
      />
    ),
    value,
    changeHandler,
    add,
    subtract,
  };
};

export const throttle = (fn: (...args: any[]) => any, delay = 50): ((...args: any[]) => any) => {
  let timer: number | undefined;

  return (...args: any[]) => {
    if (timer !== undefined) return;
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, delay);
  };
};

export default useNumberInput;
