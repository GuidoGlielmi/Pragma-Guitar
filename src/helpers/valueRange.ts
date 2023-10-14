export const setterRangeLimiter = (value: number, {min = -Infinity, max = Infinity}) => {
  return (ps: number) => {
    const newValue = ps + value;
    Math.min(max, Math.max(min, newValue));
    return newValue;
  };
};

export const rangeLimiter = (value: number, ...limits: [number, number]) => {
  // const finalValue = Number.isNaN(parseInt(value))
  return Math.min(limits[1], Math.max(limits[0], value));
};
