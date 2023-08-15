import {useState, useRef, useEffect} from 'react';

interface NumberInputProps extends React.HTMLProps<HTMLInputElement> {
  initialValue?: number;
  max?: number;
  min?: number;
  style?: React.CSSProperties;
}

const useNumberInput = ({
  initialValue = 0,
  max = Infinity,
  min = -Infinity,
  style = {},
  ...htmlProps
}: NumberInputProps = {}) => {
  const [value, setValue] = useState(initialValue);
  const [dragging, setDragging] = useState(false);
  const prevY = useRef(0);
  const changeHandler = (value: number) => {
    setValue(ps => {
      const newValue = ~~(value === 0 ? value : Math.max(min, Math.min(value, max)) || ps);
      return newValue;
    });
  };
  useEffect(() => {
    const onMouseMove = throttle(dragHandler, 10);
    const onMouseUp = () => setDragging(false);
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  const add = (newValue: number) => {
    changeHandler(newValue + value);
  };

  const subtract = (newValue: number) => {
    changeHandler(newValue + value);
  };

  const dragHandler = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent> & React.TouchEvent<HTMLInputElement>,
  ) => {
    if (!dragging) return;
    if (e.movementY !== undefined) {
      setValue(ps => {
        const value = ps + (e.movementY > 0 ? -1 : 1);
        return Math.max(min, Math.min(value, max));
      });
    } else {
      const currY = e.touches[0].pageY;
      setValue(ps => {
        const value = ps + (currY - prevY.current > 0 ? -1 : 1);
        return Math.max(min, Math.min(value, max));
      });
      prevY.current = currY;
    }
  };

  return {
    input: (
      <input
        {...htmlProps}
        style={{...style, cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none'}}
        value={value || ''}
        onBlur={() => setValue(ps => ps || min)}
        onChange={e => changeHandler(+e.target.value)}
        onMouseDown={() => {
          setDragging(true);
        }}
        onTouchStart={() => {
          setDragging(true);
        }}
        onTouchEnd={() => {
          setDragging(false);
        }}
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
