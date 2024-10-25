import {useEffect, useRef, useState} from 'react';
import {debounce, throttle} from '../../../helpers/timer';

interface NumberInputProps {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}

const EnhancedInput = ({
  value,
  setValue,
  ...props
}: Omit<
  React.HTMLProps<HTMLInputElement>,
  | 'value'
  | 'onChange'
  | 'onMouseDown'
  | 'onTouchEnd'
  | 'onMouseUp'
  | 'onKeyDown'
  | 'onTouchMove'
  | 'onTouchStart'
> &
  NumberInputProps) => {
  const [dragging, setDragging] = useState(false);

  const prevY = useRef(0);

  const changeHandler = (value: React.SetStateAction<number>) => {
    setValue(ps => {
      const oldValue = value instanceof Function ? value(ps) : value;
      const newValue = ~~(oldValue === 0 ? oldValue : oldValue || ps);
      return newValue;
    });
  };

  const touchDragHandler = (e: TTouchDragEvent) => {
    const currY = e.touches[0].pageY;
    setValue(ps => {
      const value = ps + (currY - prevY.current > 0 ? -1 : 1);
      return value;
    });
    prevY.current = currY;
  };

  const mouseDragHandler = (e: MouseEvent) => {
    setValue(ps => {
      const value = ps + (e.movementY > 0 ? -1 : 1);
      return value;
    });
  };

  const onTouchMove = useRef(throttle(touchDragHandler, 10)) as Readonly<
    React.MutableRefObject<Task<[TTouchDragEvent]>>
  >;
  const onChange = useRef(debounce(changeHandler, 10)) as Readonly<
    React.MutableRefObject<Task<[value: React.SetStateAction<number>]>>
  >;

  useEffect(() => {
    if (!dragging) return;
    const onMouseMove = throttle(mouseDragHandler, 10);
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  return (
    <input
      {...props}
      style={{
        ...(props.style || {}),
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
      value={value || ''}
      // onBlur={() => setValue(ps => ps || min)}
      onChange={e => {
        onChange.current(+e.target.value);
      }}
      onMouseDown={() => {
        setDragging(true);
      }}
      onMouseUp={() => {
        setDragging(false);
      }}
      onTouchStart={() => {
        setDragging(true);
      }}
      onTouchEnd={() => {
        setDragging(false);
      }}
      onKeyDown={e => {
        if (e.key === 'ArrowUp') onChange.current(ps => ps + 1);
        else if (e.key === 'ArrowDown') onChange.current(ps => ps - 1);
      }}
      onTouchMove={onTouchMove.current}
    />
  );
};
type TTouchDragEvent = React.TouchEvent<HTMLInputElement>;

export default EnhancedInput;
