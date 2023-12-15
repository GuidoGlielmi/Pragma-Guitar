export const addToPrevValueRangeLimiterStateAction = (
  value: number,
  {min = -Infinity, max = Infinity}: {min: number; max: number},
) => {
  return (ps: number) => {
    const newValue = ps + value;
    return rangeLimiter(newValue, min, max);
  };
};

export const rangeLimiter = (value: number, ...limits: [min: number, max: number]) =>
  Math.min(limits[1], Math.max(limits[0], value));
