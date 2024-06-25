import {useState, useRef, useEffect} from 'react';
import {debounce, throttle} from '../helpers/timer';

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

  const changeHandler = (value: React.SetStateAction<number>) => {
    setValue(ps => {
      const oldValue = value instanceof Function ? value(ps) : value;
      const newValue = ~~(oldValue === 0 ? oldValue : Math.max(min, Math.min(oldValue, max)) || ps);
      return newValue;
    });
  };

  const touchDragHandler = (e: TTouchDragEvent) => {
    const currY = e.touches[0].pageY;
    setValue(ps => {
      const value = ps + (currY - prevY.current > 0 ? -1 : 1);
      return Math.max(min, Math.min(value, max));
    });
    prevY.current = currY;
  };

  const mouseDragHandler = (e: MouseEvent) => {
    setValue(ps => {
      const value = ps + (e.movementY > 0 ? -1 : 1);
      return Math.max(min, Math.min(value, max));
    });
  };

  const onTouchMove = useRef(throttle(touchDragHandler, 10)) as Readonly<
    React.MutableRefObject<Task<[TTouchDragEvent]>>
  >;
  const onChange = useRef(debounce(changeHandler, 10)) as Readonly<
    React.MutableRefObject<Task<[number]>>
  >;

  useEffect(() => {
    const onMouseUp = () => setDragging(false);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.addEventListener('mouseup', onMouseUp);
    };
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMouseMove = throttle(mouseDragHandler, 10);
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  const add = (newValue: number) => {
    onChange.current(newValue + value);
  };

  const subtract = (newValue: number) => {
    onChange.current(newValue + value);
  };

  return {
    input: (
      <input
        {...htmlProps}
        style={{
          ...style,
          cursor: dragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
        value={value || ''}
        onBlur={() => setValue(ps => ps || min)}
        onChange={e => onChange.current(+e.target.value)}
        onMouseDown={() => {
          setDragging(true);
        }}
        onTouchStart={() => {
          setDragging(true);
        }}
        onTouchEnd={() => {
          setDragging(false);
        }}
        onTouchMove={onTouchMove.current}
      />
    ),
    value,
    changeHandler,
    add,
    subtract,
  };
};

type TTouchDragEvent = React.TouchEvent<HTMLInputElement>;

export default useNumberInput;
