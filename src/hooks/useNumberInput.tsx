import {useState} from 'react';

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
  style,
}: NumberInputProps = {}) => {
  const [value, setValue] = useState(initialValue);
  const changeHandler = (value: number) => {
    setValue(ps => {
      const newValue = value === 0 ? value : Math.max(min, Math.min(value, max)) || ps;
      return newValue;
    });
  };

  const add = (newValue: number) => {
    changeHandler(newValue + value);
  };

  const subtract = (newValue: number) => {
    changeHandler(newValue + value);
  };

  return {
    input: (
      <input
        style={style}
        value={value || ''}
        onBlur={() => setValue(ps => ps || min)}
        onChange={e => changeHandler(+e.target.value)}
      />
    ),
    value,
    changeHandler,
    add,
    subtract,
  };
};

export default useNumberInput;
